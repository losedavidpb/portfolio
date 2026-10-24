//////// URL

const path = window.location.pathname;
export const base_path = path.startsWith('/portfolio/') ? '/portfolio/' : '/';
export const is_production = document.documentElement.dataset.environment === 'production';

const supported_languages = ['en', 'es'];
const relative_path = path.slice(base_path.length);
const path_lang = relative_path.split('/').find(segment => supported_languages.includes(segment));
const query_lang = new URLSearchParams(window.location.search).get('lang');

export const lang = path_lang ?? (supported_languages.includes(query_lang) ? query_lang : 'en');

/**
 * Get the current page URL for a language
 *
 * @param {string|null} target_lang
 * @returns {string}
 */
export function get_page_url(target_lang = null) {
    if (is_production) {
        return new URL(`${base_path}${target_lang ?? 'en'}/`, window.location.origin).toString();
    }

    const url = new URL(base_path, window.location.origin);

    if (target_lang) {
        url.searchParams.set('lang', target_lang);
    }

    return url.toString();
}

//////// JSONC

/**
 * Parse JSON with comments
 *
 * @param {string} jsonc
 * @returns {object}
 */
function parse_jsonc(jsonc) {
    const json = jsonc.replace(
        /("(?:\\.|[^"\\])*")|\/\*[\s\S]*?\*\/|\/\/.*$/gm,
        (_, string_literal) => string_literal ?? ''
    );

    return JSON.parse(json);
}

//////// LOCALIZATION

const localization_dir = `${base_path}locales/`;
const localization_extension = is_production ? 'json' : 'jsonc';

/**
 * Load the current language localization
 *
 * @returns {Promise<object>}
 */
export async function load_localization() {
    const response = await fetch(`${localization_dir}${lang}.${localization_extension}`);

    if (!response.ok) {
        throw new Error(`Unable to load localization: ${response.status} ${response.statusText}`);
    }

    return parse_jsonc(await response.text());
}
