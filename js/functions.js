/****************************************************************
 * Functions for losedavidpb.github.io
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 *
 ***************************************************************/

/**
 * Prepare all data extracted from JSON files
 * just for general stuff
 *
 * @param {json} json_data
 * @param {string} lang
 */
export function prepare_json(json_data, lang = 'en') {
    if (json_data.jobs_json) {
        if (json_data.jobs_json.jobs) {
            let jobs = json_data.jobs_json.jobs;

            jobs.forEach(job => {
                include_job(job, lang);
            })
        }
    }

    if (json_data.studies_json) {
        if (json_data.studies_json.studies) {
            let studies = json_data.studies_json.studies;

            studies.forEach(study => {
                include_study(study, lang);
            });
        }
    }

    if (json_data.skills_json) {
        if (json_data.skills_json.skills) {
            let skills = json_data.skills_json.skills;

            skills.forEach(skill => {
                include_skill(skill, lang);
            });
        }
    }

    if (json_data.courses_json) {
        if (json_data.courses_json.courses) {
            let courses = json_data.courses_json.courses;

            courses.forEach(course => {
                include_course(course, lang);
            });
        }
    }

    if (json_data.projects_json) {
        if (json_data.projects_json.projects) {
            let projects = json_data.projects_json.projects;

            projects.forEach(project => {
                include_project(project, lang);
            });
        }
    }
}

/**
 * Include a new job at the current job list
 *
 * @param {object} job
 * @param {string} lang
 */
function include_job(job, lang = 'en') {
    const skill_name = lang == 'es' ? 'Aptitudes' : 'Skills';

    const html_content = `
        <li class="mb-3 pb-3">
            <h4>${job.job}</h4>
            <div class="fs-5">
                <span><i>${job.company} - ${job.type}</i></span><br>
                <span class="text-muted">${job.date}</span><br>
                <p class="text-muted">${job.location}</p>
                <p>${job.description}</p>
                <span>
                    <span class="fw-bold">${skill_name}: </span> ${job.skills}
                </span>
            </div>
        </li>
    `;

    $("#job-list").append(html_content);
}

/**
 * Include a new study at the current study list
 *
 * @param {object} study
 * @param {string} lang
 */
function include_study(study, lang = 'en') {
    let extra_html = '';

    if (study.extra) {
        extra_html = `
            <ul>
                ${study.extra.map(element => `
                    <li>
                        <span class="fw-bold">${element.name}: </span>${element.value}
                    </li>
                `).join('')}
            </ul>
        `;
    }

    const html_content = `
        <li class="mb-3 pb-3">
            <h4>${study.title}</h4>
            <div class="fs-5">
                <span><i>${study.institution}</i></span><br>
                <p class="text-muted">${study.date}</p>
                ${extra_html}
            </div>
        </li>
    `;

    $("#study-list").append(html_content);
}

/**
 * Include a new skill at the current skill list.
 *
 * @param {object} skill
 * @param {string} lang
 */
function include_skill(skill, lang = 'en') {
    const base_path = lang == 'en' ? '/portfolio/' : '';

    const values_html = skill.values.map(value => `
        <h4>${value.tooltip}</h4>

        <div class="row align-items-center pt-2 pb-4">
            <div class="col-auto">
                <a href="${value.href}" target="_blank">
                    <img src="${base_path + value.src}" class="lang-image img-fluid" alt="${value.alt}"
                        style="max-width: 80px; height: auto;" data-bs-toggle="tooltip"
                        data-bs-placement="bottom" title="${value.tooltip}" />
                </a>
            </div>

            <div class="col">
                <div class="progress" style="height: 30px">
                    <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                        style="width: ${value.value * 2}%" aria-valuenow="${value.value}">
                        <h4 class="my-4">${value.value * 2}%</h4>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    const html_content = `
        <li class="py-4">
            <h4>${skill.title}</h4>
            <div class="row justify-content-md mt-5 ps-5">
                ${values_html}
            </div>
        </li>
    `;

    $('#skill-list').append(html_content);
}

/**
 * Include a new course at the current course list.
 *
 * @param {object} course
 * @param {string} lang
 */
function include_course(course, lang = 'en') {
    const html_content = `
        <li class="mb-4">
            <h4>${course.title}</h4>
            <span class="fs-5">
                <i>${course.subtitle}</i>
            </span><br>
        </li>
    `;

    $("#course-list").append(html_content);
}

/**
 * Include a new project at the current project list
 *
 * @param {object} project
 * @param {string} lang
 */

function include_project(project, lang = 'en') {
    const skill_name = lang === 'es' ? 'Aptitudes' : 'Skills';

    const urls_html = project.urls
        ? project.urls.map(url => `
            <a class="btn btn-primary me-3 mb-3" href="${url.value}" target="_blank" role="button">
                <span class="fw-bold">
                    ${url.name} <i class="bi bi-box-arrow-up-right"></i>
                </span>
            </a>
        `).join('')
        : '';

    const html_content = `
        <li class="mb-5">
            <h4>${project.name}</h4>
            <span class="text-muted fs-5">${project.date}</span><br><br>

            <span class="fs-5">
                <span class="fw-bold">${skill_name}: </span>${project.skills}
            </span><br>

            <div class="fs-5">
                <p class="pt-3 mb-2 pe-4">${project.description}</p>
            </div>

            ${urls_html}
        </li>
    `;

    $("#project-list").append(html_content);
}