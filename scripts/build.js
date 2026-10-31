import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    render_courses,
    render_jobs,
    render_projects,
    render_skills,
    render_studies
} from '../assets/js/content.js';

// Configuration
// ==========================

// Resolve all build paths from this script instead of the current terminal directory
const script_dir = path.dirname(fileURLToPath(import.meta.url));
const project_dir = path.resolve(script_dir, '..');
const dist_dir = path.join(project_dir, 'dist');

// Public URL used to generate canonical links, language alternatives, and the sitemap
const site_origin = 'https://losedavidpb.github.io';
const site_base_path = '/portfolio/';

const site_url = new URL(site_base_path, site_origin);

const languages = ['en', 'es'];
const default_language = 'en';

// Page rendering
// ==========================

/**
 * Get a nested locale value
 *
 * @param {object} locale
 * @param {string} key
 * @returns {unknown}
 */
function get_locale_value(locale, key) {
    const value = key.split('.').reduce((current, part) => current?.[part], locale);

    if (value === undefined) {
        throw new Error(`Missing locale value: ${key}`);
    }

    return value;
}

/**
 * Escape visible HTML text
 *
 * @param {unknown} value
 * @returns {string}
 */
function escape_html(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

/**
 * Replace localized element text markers
 *
 * @param {string} html
 * @param {object} locale
 * @returns {string}
 */
function render_text_markers(html, locale) {
    return html.replace(
        /<([a-z][\w-]*)([^>]*\sdata-i18n="([^"]+)"[^>]*)>[\s\S]*?<\/\1>/gi,
        (_, tag, attributes, key) => {
            const clean_attributes = attributes.replace(/\sdata-i18n="[^"]+"/i, '');
            return `<${tag}${clean_attributes}>${escape_html(get_locale_value(locale, key))}</${tag}>`;
        }
    );
}

/**
 * Replace localized attribute markers
 *
 * @param {string} html
 * @param {object} locale
 * @returns {string}
 */
function render_attribute_markers(html, locale) {
    return html.replace(
        /<([a-z][\w-]*)([^>]*\sdata-i18n-attr="([^:"]+):([^"]+)"[^>]*)>/gi,
        (_, tag, raw_attributes, attribute, key) => {
            const value = escape_html(get_locale_value(locale, key));
            const marker_pattern = /\sdata-i18n-attr="[^"]+"/i;
            const attribute_pattern = new RegExp(`\\s${attribute.replace('-', '\\-')}="[^"]*"`, 'i');

            let attributes = raw_attributes.replace(marker_pattern, '');

            if (attribute_pattern.test(attributes)) {
                attributes = attributes.replace(attribute_pattern, ` ${attribute}="${value}"`);
            } else {
                attributes += ` ${attribute}="${value}"`;
            }

            return `<${tag}${attributes}>`;
        }
    );
}

/**
 * Replace localized paragraph lists
 *
 * @param {string} html
 * @param {object} locale
 * @returns {string}
 */
function render_list_markers(html, locale) {
    return html.replace(
        /<([a-z][\w-]*)([^>]*\sdata-i18n-list="([^"]+)"[^>]*)>[\s\S]*?<\/\1>/gi,
        (_, tag, attributes, key) => {
            const values = get_locale_value(locale, key);

            if (!Array.isArray(values)) {
                throw new Error(`Locale value must be an array: ${key}`);
            }

            const clean_attributes = attributes.replace(/\sdata-i18n-list="[^"]+"/i, '');
            const content = values.map(value => `<p>${escape_html(value)}</p>`).join('');
            return `<${tag}${clean_attributes}>${content}</${tag}>`;
        }
    );
}

/**
 * Replace portfolio content markers
 *
 * @param {string} html
 * @param {object} locale
 * @returns {string}
 */
function render_content_markers(html, locale) {
    const content = {
        jobs: render_jobs(locale.jobs, locale.site.skillsLabel),
        studies: render_studies(locale.studies),
        skills: render_skills(locale.skills, '../'),
        projects: render_projects(locale.projects, locale.site.skillsLabel),
        courses: render_courses(locale.courses)
    };

    return html.replace(
        /<([a-z][\w-]*)([^>]*\sdata-content="([^"]+)"[^>]*)>[\s\S]*?<\/\1>/gi,
        (_, tag, attributes, key) => {
            if (!(key in content)) {
                throw new Error(`Unknown content marker: ${key}`);
            }

            const clean_attributes = attributes.replace(/\sdata-content="[^"]+"/i, '');
            return `<${tag}${clean_attributes}>${content[key]}</${tag}>`;
        }
    );
}

/**
 * Set or replace an HTML attribute
 *
 * @param {string} tag
 * @param {string} attribute
 * @param {string} value
 * @returns {string}
 */
function set_attribute(tag, attribute, value) {
    const pattern = new RegExp(`\\s${attribute}="[^"]*"`, 'i');
    return pattern.test(tag)
        ? tag.replace(pattern, ` ${attribute}="${escape_html(value)}"`)
        : tag.replace(/>$/, ` ${attribute}="${escape_html(value)}">`);
}

/**
 * Render one localized production page
 *
 * @param {string} template
 * @param {string} language
 * @param {object} locale
 * @returns {string}
 */
function render_page(template, language, locale) {
    const canonical = new URL(`${language}/`, site_url).toString();
    const default_url = new URL(`${default_language}/`, site_url).toString();

    let html = template;

    // Mark the page with its language and production environment
    html = html.replace(/<html\b[^>]*>/i, `<html lang="${language}" data-environment="production">`);

    // Replace every localization marker with content from the selected locale
    html = render_text_markers(html, locale);
    html = render_attribute_markers(html, locale);
    html = render_list_markers(html, locale);

    // Adjust asset paths for nested language directories and prerender portfolio content
    html = html.replaceAll('./assets/', '../assets/');
    html = render_content_markers(html, locale);

    // Generate absolute SEO links for the current and alternative languages
    html = html.replace(/<link\b[^>]*rel="canonical"[^>]*>/i, tag =>
        set_attribute(tag, 'href', canonical)
    );

    html = html.replace(/<link\b[^>]*hreflang="en"[^>]*>/i, tag =>
        set_attribute(tag, 'href', new URL('en/', site_url).toString())
    );

    html = html.replace(/<link\b[^>]*hreflang="es"[^>]*>/i, tag =>
        set_attribute(tag, 'href', new URL('es/', site_url).toString())
    );

    html = html.replace(/<link\b[^>]*hreflang="x-default"[^>]*>/i, tag =>
        set_attribute(tag, 'href', default_url)
    );

    // Convert language selectors into links between the generated directories
    html = html.replace(/<a\b([^>]*\sdata-language="(en|es)"[^>]*)>/gi, (_, raw_attributes, target) => {
        let attributes = raw_attributes.replace(/\sdata-language="[^"]+"/i, '');
        attributes = attributes.replace(/\shref="[^"]*"/i, ` href="../${target}/"`);
        return `<a${attributes}>`;
    });

    // Ensure no development-only marker reaches the production output
    if (/data-(?:i18n|i18n-attr|i18n-list|content|language)=/i.test(html)) {
        throw new Error(`Unresolved build marker in ${language}/index.html`);
    }

    return html;
}

// Root files
// ==========================

/**
 * Generate the root language redirect page
 *
 * @param {Map<string, object>} locales
 * @returns {string}
 */
function render_root_page(locales) {
    const locale = locales.get(default_language);
    const default_url = new URL(`${default_language}/`, site_url).toString();

    return `<!DOCTYPE html>
<html lang="${default_language}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escape_html(locale.site.title)}</title>
    <meta name="description" content="${escape_html(locale.site.description)}">
    <meta http-equiv="refresh" content="0; url=./${default_language}/">
    <link rel="canonical" href="${default_url}">
    <link rel="alternate" hreflang="en" href="${new URL('en/', site_url)}">
    <link rel="alternate" hreflang="es" href="${new URL('es/', site_url)}">
    <link rel="alternate" hreflang="x-default" href="${default_url}">
    <script>window.location.replace('./${default_language}/');</script>
</head>
<body>
    <p><a href="./${default_language}/">Continue</a></p>
</body>
</html>
`;
}

/**
 * Generate the production sitemap
 *
 * @returns {string}
 */
function render_sitemap() {
    const urls = languages.map(language => `
  <url>
    <loc>${new URL(`${language}/`, site_url)}</loc>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

// Validation
// ==========================

/**
 * Validate generated production files
 *
 * @param {Map<string, object>} locales
 */
async function validate_build(locales) {
    for (const language of languages) {
        const locale = locales.get(language);
        const json_file = path.join(dist_dir, 'locales', `${language}.json`);
        const html_file = path.join(dist_dir, language, 'index.html');
        const json = await readFile(json_file, 'utf8');
        const html = await readFile(html_file, 'utf8');

        // Confirm that the exported locale file contains valid JSON
        JSON.parse(json);

        // Check the language and environment metadata on the generated page
        if (!html.includes(`<html lang="${language}" data-environment="production">`)) {
            throw new Error(`Invalid HTML language for ${language}`);
        }

        // Confirm that representative portfolio entries were prerendered
        if (!html.includes(locale.jobs[0].job) || !html.includes(locale.projects[0].name)) {
            throw new Error(`Missing prerendered content for ${language}`);
        }

        // Production language navigation must use directories instead of query parameters
        if (html.includes('?lang=')) {
            throw new Error(`Query-based language URL found in ${language}/index.html`);
        }

        // Reject malformed paths and values accidentally interpolated as undefined
        if (html.includes('.../assets/') || html.includes('="undefined"')) {
            throw new Error(`Invalid generated value found in ${language}/index.html`);
        }

        // Every localized page must include its absolute canonical URL
        if (!html.includes(new URL(`${language}/`, site_url).toString())) {
            throw new Error(`Missing canonical URL for ${language}`);
        }
    }
}

// Localization
// ==========================

/**
 * Remove JSON comments without changing strings
 *
 * @param {string} jsonc
 * @returns {string}
 */
function strip_json_comments(jsonc) {
    return jsonc.replace(
        /("(?:\\.|[^"\\])*")|\/\*[\s\S]*?\*\/|\/\/.*$/gm,
        (_, string_literal) => string_literal ?? ''
    );
}

/**
 * Read and parse a locale source file
 *
 * @param {string} language
 * @returns {Promise<object>}
 */
async function read_locale(language) {
    const file = path.join(project_dir, 'locales', `${language}.jsonc`);
    const jsonc = await readFile(file, 'utf8');

    return JSON.parse(strip_json_comments(jsonc));
}

/**
 * Load the locale data for every supported language
 *
 * @returns {Promise<Map<string, object>>}
 */
async function load_locales() {
    const locales = new Map();

    // Preserve the configured language order in the resulting map
    for (const language of languages) {
        locales.set(language, await read_locale(language));
    }

    return locales;
}

// Build generation
// ==========================

/**
 * Recreate the build directory and copy the static assets
 *
 * @returns {Promise<void>}
 */
async function prepare_build_directory() {
    // Start from a clean output directory to avoid retaining stale files
    await rm(dist_dir, { recursive: true, force: true });
    await mkdir(path.join(dist_dir, 'locales'), { recursive: true });

    // Static assets are shared by every generated language page
    await cp(path.join(project_dir, 'assets'), path.join(dist_dir, 'assets'), { recursive: true });
}

/**
 * Generate the localized HTML and JSON files for every language
 *
 * @param {Map<string, object>} locales
 * @returns {Promise<void>}
 */
async function write_localized_files(locales) {
    const template = await readFile(path.join(project_dir, 'index.html'), 'utf8');

    // Generate one HTML page and one browser locale file per language
    for (const [language, locale] of locales) {
        const language_dir = path.join(dist_dir, language);

        // Write the prerendered language page
        await mkdir(language_dir, { recursive: true });
        await writeFile(path.join(language_dir, 'index.html'), render_page(template, language, locale));

        // Export locale data for client-side use
        await writeFile(
            path.join(dist_dir, 'locales', `${language}.json`),
            `${JSON.stringify(locale, null, 2)}\n`
        );
    }
}

/**
 * Write the root redirect, sitemap, and deployment files
 *
 * @param {Map<string, object>} locales
 * @returns {Promise<void>}
 */
async function render_root_redirect(locales) {
    // Write the root language redirect and the public URL index
    await writeFile(path.join(dist_dir, 'index.html'), render_root_page(locales));
    await writeFile(path.join(dist_dir, 'sitemap.xml'), render_sitemap());

    // Add files required by crawlers and GitHub Pages deployment
    await cp(path.join(project_dir, 'robots.txt'), path.join(dist_dir, 'robots.txt'));
    await writeFile(path.join(dist_dir, '.nojekyll'), '');
}

/**
 * Build the website
 *
 * @returns {Promise<void>}
 */
async function build() {
    const locales = await load_locales();

    // Generate the production files
    await prepare_build_directory();
    await write_localized_files(locales)
    await render_root_redirect(locales)

    // Validate the generated files
    await validate_build(locales);
}

await build();
