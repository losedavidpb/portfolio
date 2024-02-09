import { prepare_json } from './functions.js'

const lang = document.URL.split('?')[1].split('lang=')[1];
const localization_dir = './../data/localization/';

/**
 * Load localization file from the data folder
 *
 * @param {string} filename
 * @returns json object loaded
 */
async function load_localization(filename) {
    if (filename) {
        let response = await fetch(localization_dir + lang + '/' + filename);
        let yaml_data = await response.text();

        return jsyaml.load(yaml_data);
    }

    return null;
}

/**
 * Set language selector based on current language
 */
function set_lang_selector() {
    let lang_index = lang == 'es' ? 0 : 1;
    let other_lang_index = lang_index == 0 ? 1 : 0;

    $("#language-div").children().eq(lang_index).addClass("active");
    $("#language-div").children().eq(other_lang_index).removeClass("active");
}

/**
 * Set navbar links
 */
function set_navbar_links() {
    $("#index-nav-link").attr("href", "./index.html?lang=" + lang)
    $("#contact-nav-link").attr("href", "./contact.html?lang=" + lang);
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
}

main();