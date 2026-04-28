import { prepare_json } from './functions.js'

function get_clean_path() {
    let path = window.location.pathname;

    const base_path = path.startsWith('/portfolio/') ? '/portfolio/' : '/';

    path = path.substring(base_path.length);

    if (path.endsWith('index.html')) {
        path = path.replace('index.html', '');
    }

    return { path, base_path };
}

const { path, base_path } = get_clean_path();
const lang = path.includes('es/') ? 'es' : 'en';

const localization_dir = `${base_path}localization/`;

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
    let page = path.replace(/^es\//, '');

    const base = window.location.origin + base_path;

    const urls = {
        en: base + page,
        es: base + 'es/' + page
    };

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