/****************************************************************
 * Functions for losedavidpb.github.io
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 *
 ***************************************************************/

/**
 * Prepare all data extracted from JSON files
 *
 * @param {string} jobs_json
 * @param {string} studies_json
 * @param {string} courses_json
 * @param {string} projects_json
 * @param {string} skills_json
 * @param {string} lang
 */
export function prepare_json(jobs_json, studies_json, skills_json, courses_json, projects_json, lang = 'en') {
    if (jobs_json.jobs) {
        let jobs = jobs_json.jobs;

        jobs.forEach(job => {
            include_job(job, lang);
        })
    }

    if (studies_json.studies) {
        let studies = studies_json.studies;

        studies.forEach(study => {
            include_study(study, lang);
        });
    }

    if (skills_json.skills) {
        let skills = skills_json.skills;

        skills.forEach(skill => {
            include_skill(skill, lang);
        });
    }

    if (courses_json.courses) {
        let courses = courses_json.courses;

        courses.forEach(course => {
            include_course(course, lang);
        });
    }

    if (projects_json.projects) {
        let projects = projects_json.projects;

        projects.forEach(project => {
            include_project(project, lang);
        });
    }
}

/**
 * Include a new job at the current job list
 *
 * @param {object} job
 * @param {string} lang
 */
function include_job(job, lang = 'en') {
    let skill_name = lang == 'es' ? 'Aptitudes' : 'Skills';

    let html_content = '<li class="mb-3 pb-3"> \
        <h4>' + job.job + '</h4> \
        <div class="fs-5"><span><i>' + job.company + ' - ' + job.type + '</i></span><br> \
        <span class="text-muted">' + job.date + '</span><br> \
        <p class="text-muted">' + job.location + '</p> \
        <p>' + job.description + '</p> \
        <span><span class="fw-bold">' + skill_name + ': </span> ' + job.skills + '</span></div> \
    </li>';

    $("#job-list").append(html_content);
}

/**
 * Include a new study at the current study list
 *
 * @param {object} study
 * @param {string} lang
 */
function include_study(study, lang = 'en') {
    let html_content = '<li class="mb-3 pb-3"> \
        <h4>' + study.title + '</h4> \
        <div class="fs-5"><span><i>' + study.institution + '</i></span><br> \
        <p class="text-muted">' + study.date + '</p>';

    if (study.extra) {
        html_content += '<ul>';

        study.extra.forEach(element => {
            html_content += ' \
                <li><span class="fw-bold">' + element.name + ': </span>' + element.value + '</li> \
            ';
        });

        html_content += '</ul>';
    }

    html_content += '</li>';

    $("#study-list").append(html_content);
}

/**
 * Include a new skill at the current skill list.
 *
 * @param {object} skill
 * @param {string} lang
 */
function include_skill(skill, lang = 'en') {
    let html_content = '<li class="py-4"> \
        <h4>' + skill.title + '</h4> \
        <div class="row justify-content-md mt-5 ps-5">';

    skill.values.forEach(value => {
        html_content += '<div class="col-md-auto"> \
            <a href="' + value.href + '" target="_blank"> \
                <img src="' + value.src + '" class="lang-image img-fluid" alt="' + value.alt + '" \
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="' + value.tooltip + '" /> \
            </a> \
        </div>';
    });

    html_content += '</div></li>';

    $('#skill-list').append(html_content);
}

/**
 * Include a new course at the current course list.
 *
 * @param {object} course
 * @param {string} lang
 */
function include_course(course, lang = 'en') {
    let html_content = '\
        <li class="mb-4"> \
            <h4>' + course.title + '</h4> \
            <span class="fs-5"><i>' + course.subtitle + '</i></span><br> \
        </li> \
    ';

    $("#course-list").append(html_content);
}

/**
 * Include a new project at the current project list
 *
 * @param {object} project
 * @param {string} lang
 */
function include_project(project, lang = 'en') {
    let skill_name = lang == 'es' ? 'Aptitudes' : 'Skills';

    let html_content = '<li class="mb-5"> \
        <h4>' + project.name + '</h4> \
        <span class="text-muted fs-5">' + project.date + '</span><br> \
        <br><span class="fs-5"><span class="fw-bold">' + skill_name + ': </span>' + project.skills + '</span><br> \
        <div class="fs-5"><p class="pt-3 mb-2 pe-4">' + project.description + '</p></div>';

    if (project.urls) {
        project.urls.forEach(url => {
            html_content += '<a class="btn btn-primary me-3 mb-3" href="' + url.value + '" \
            target="_blank" role="button"> \
            <span class="fw-bold">' + url.name + ' <i class="bi bi-box-arrow-up-right"></i></span> \
        </a>';
        });
    }

    html_content += '</li>';

    $("#project-list").append(html_content);
}

/**
 * Display temporal message on the screen
 *
 * @param {string} lang
 */
function include_temp_message(lang = 'en') {
    let message = lang == 'es' ? '¡En progreso! 😅' : 'Sorry, still in progress! 😅';

    $('body').append('<div class="background" id="background-color"> \
        <div class="d-inline-block"> \
            <img src="../../data/gif/loading.gif" /> \
            <span class="fs-1" style="color: white;">' + message + '</span> \
        </div> \
    </div>');
}