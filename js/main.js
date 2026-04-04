import { prepare_json } from './functions.js'

const path = window.location.pathname;
const lang = path.includes('/es/') ? 'es' : 'en';

const localization_dir = './../localization/';

/**
 * Load localization file from the data folder
 *
 * @param {string} filename
 * @returns json object loaded
 */
async function load_localization(filename) {
    if (filename) {
        let response = await fetch(`${localization_dir}${lang}/${filename}`);
        let yaml_data = await response.text();
        return jsyaml.load(yaml_data);
    }

    return null;
}

/**
 * Set language selector based on current language
 */
function set_lang_selector() {
    const path_parts = window.location.pathname.split('/').filter(Boolean);

    let base = window.location.origin + '/';
    let page = '';

    // Add project base path if not in language root
    if (path_parts.length > 0 && path_parts[0] !== 'en' && path_parts[0] !== 'es') {
        base += path_parts[0] + '/';
    }

    // Get current page based on language
    if (path_parts.includes('en') || path_parts.includes('es')) {
        const lang_index = path_parts.findIndex(p => p === 'en' || p === 'es');
        page = path_parts[lang_index + 1] || '';
    }

    // Fallback for invalid pages
    if (!page || page === '') page = '';

    const urls = { es: `${base}es/${page}`, en: `${base}en/${page}` };

    $("#language-div").children().eq(0).attr("href", urls.es);
    $("#language-div").children().eq(1).attr("href", urls.en);

    const lang_index = lang === 'es' ? 0 : 1;
    const other_lang_index = lang_index === 0 ? 1 : 0;

    $("#language-div").children().eq(lang_index).addClass("active");
    $("#language-div").children().eq(other_lang_index).removeClass("active");
}

/**
 * Set navbar links
 */
function set_navbar_links() {
    $("#index-nav-link").attr("href", "./");
    $("#contact-nav-link").attr("href", `./contact.html`);
}

/**
 * Main procedure
 */
async function main() {
    set_lang_selector();
    set_navbar_links();

    const json_data = {
        general_json: await load_localization('general.yaml'),
        courses_json: await load_localization('courses.yaml'),
        jobs_json: await load_localization('jobs.yaml'),
        projects_json: await load_localization('projects.yaml'),
        skills_json: await load_localization('skills.yaml'),
        studies_json: await load_localization('studies.yaml')
    }

    prepare_json(json_data, lang);

    $("#loader").removeClass("show").one("transitionend", function () {
        $(this).remove();
    });
}

main();