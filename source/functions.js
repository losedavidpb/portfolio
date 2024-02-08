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
    if (json_data.general_json) {
        let general = json_data.general_json.general;

        if (general.meta) {
            let meta = general.meta;
            set_meta(meta, lang);
        }

        if (general.person &&  general.location && general.current_rol) {
            let person = general.person;
            let location = general.location;
            let current_rol = general.current_rol;
            set_author(person, location, current_rol, lang);
        }

        if (general.sections) {
            let sections = general.sections;
            set_sections(sections, lang);
        }

        if (general.headers) {
            let headers = general.headers;
            set_headers(headers, lang);
        }
    }

    prepare_portfolio_json(json_data, lang);
}

/**
 * Prepare all data extracted from JSON files
 * for the portfolio main website
 *
 * @param {json} json_data
 * @param {string} lang
 */
function prepare_portfolio_json(json_data, lang = 'en') {
    if (json_data.general_json) {
        let general = json_data.general_json.general;

        if (general.introduction) {
            let introduction = {
                title: general.introduction.title,
                content: general.introduction.content
            };

            set_introduction(introduction, lang);
        }
    }

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
 * Set meta
 *
 * @param {*} meta
 * @param {*} lang
 */
function set_meta(meta, lang = 'en') {
    $("title").html(meta.title);
    $('meta[name=author]').attr('content', meta.author);
    $('meta[name=description]').attr('content', meta.description);
    $('meta[name=keywords]').attr('content', meta.keywords);
}


/**
 * Set person and current rol
 *
 * @param {*} person
 * @param {*} location
 * @param {*} current_rol
 * @param {*} lang
 */
function set_author(person, location, current_rol, lang = 'en') {
    $(".person-header").append(person);
    $(".location-header").append(location);
    $(".current-rol-header").append(current_rol);
}

/**
 * Set the sections
 *
 * @param {*} sections
 * @param {*} lang
 */
function set_sections(sections, lang = 'en') {
    $(".home-section").append(sections.home);
    $(".contact-section").append(sections.contact);

    $(".home-link").prop("title", sections.home);
    $(".about-me-link").prop("title", sections.about_me);
    $(".experience-studies-link").prop("title", sections.experience_studies);
    $(".skills-link").prop("title", sections.skills);
    $(".projects-link").prop("title", sections.projects);
    $(".courses-certificates-link").prop("title", sections.courses_certificates);
}

/**
 * Set the headers
 *
 * @param {*} headers
 * @param {*} lang
 */
function set_headers(headers, lang = 'en') {
    $(".home-header").append(headers.home);
    $(".contact-header").append(headers.contact);
    $(".about-me-header").append(headers.about_me);
    $(".experience-header").append(headers.experience);
    $(".studies-header").append(headers.studies);
    $(".skills-header").append(headers.skills);
    $(".projects-header").append(headers.projects);
    $(".courses-certificates-header").append(headers.courses_certificates);
}

/**
 * Set the introduction section
 *
 * @param {*} introduction
 * @param {*} lang
 */
function set_introduction(introduction, lang = 'en') {
    if (introduction.title) {
        $(".introduction-title").append(introduction.title);
    }

    if (introduction.content) {
        $(".introduction-content").append(introduction.content);
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