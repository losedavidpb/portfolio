/**
 * Render jobs
 *
 * @param {object[]} jobs
 * @param {string} skill_name
 * @returns {string}
 */
export function render_jobs(jobs, skill_name) {
    return jobs.map(job => `
        <li class="card border-0 bg-light rounded-4 p-4 mb-3">
            <h4 class="fw-bold mb-2">${job.job}</h4>
            <p class="text-primary fw-semibold mb-2">${job.company} · ${job.type}</p>
            <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="badge rounded-pill bg-white text-dark border text-wrap text-break">
                    ${job.date}
                </span>
                <span class="badge rounded-pill bg-white text-dark border text-wrap text-break">
                    <i class="bi bi-geo-alt-fill me-1"></i>${job.location}
                </span>
            </div>
            <div class="text-secondary mb-3">${job.description}</div>
            <div class="bg-white border rounded-3 p-3">
                <span class="fw-bold">${skill_name}: </span>${job.skills}
            </div>
        </li>
    `).join('');
}

/**
 * Render studies
 *
 * @param {object[]} studies
 * @returns {string}
 */
export function render_studies(studies) {
    return studies.map(study => {
        const extra_html = study.extra
            ? `
                <ul class="text-secondary ps-4 mb-0">
                    ${study.extra.map(element => `
                        <li class="mb-1">
                            <span class="text-dark fw-semibold">${element.name}: </span>${element.value}
                        </li>
                    `).join('')}
                </ul>
            `
            : '';

        return `
            <li class="card border-0 bg-light rounded-4 p-4 mb-3">
                <h4 class="fw-bold mb-2">${study.title}</h4>
                <div>
                    <p class="text-primary fw-semibold mb-2">${study.institution}</p>
                    <span class="badge rounded-pill bg-white text-dark border mb-3">${study.date}</span>
                    ${extra_html}
                </div>
            </li>
        `;
    }).join('');
}

/**
 * Render skills
 *
 * @param {object[]} skills
 * @param {string} asset_prefix
 * @returns {string}
 */
export function render_skills(skills, asset_prefix = '') {
    return skills.map(skill => {
        const values_html = skill.values.map(value => {
            const image = `
                <img src="${asset_prefix}${value.src}" class="lang-image img-fluid" alt="${value.alt}"
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="${value.tooltip}" />`;

            const image_container = value.href
                ? `<a class="d-flex align-items-center justify-content-center bg-white border rounded-3 shadow-sm p-3"
                        href="${value.href}" target="_blank" rel="noopener noreferrer">${image}</a>`
                : `<div class="d-flex align-items-center justify-content-center bg-white border rounded-3 shadow-sm p-3">${image}</div>`;

            return `
                <div class="row align-items-center g-3 mb-4">
                    <div class="col-auto">
                        ${image_container}
                    </div>

                    <div class="col">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="fw-semibold mb-0">${value.tooltip}</h5>
                            <span class="badge rounded-pill text-bg-primary">${value.value * 2}%</span>
                        </div>
                        <div class="progress rounded-pill bg-white" style="height: 0.75rem">
                            <div class="progress-bar bg-primary bg-gradient rounded-pill" role="progressbar"
                                style="width: ${value.value * 2}%" aria-valuenow="${value.value * 2}"
                                aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <li class="bg-light rounded-4 p-4 mb-4">
                <h3 class="h4 fw-bold mb-4">${skill.title}</h3>
                <div>${values_html}</div>
            </li>
        `;
    }).join('');
}

/**
 * Render courses
 *
 * @param {object[]} courses
 * @returns {string}
 */
export function render_courses(courses) {
    return courses.map(course => `
        <li class="bg-light border-start border-primary border-4 rounded-3 p-3 mb-3">
            <h4 class="h5 fw-bold mb-1">${course.title}</h4>
            <span class="text-secondary">${course.subtitle}</span>
        </li>
    `).join('');
}

/**
 * Render projects
 *
 * @param {object[]} projects
 * @param {string} skill_name
 * @returns {string}
 */
export function render_projects(projects, skill_name) {
    return projects.map(project => {
        const urls_html = project.urls
            ? project.urls.map(url => `
                <a class="btn btn-primary rounded-pill px-4 me-2 mb-2" href="${url.value}"
                    target="_blank" role="button">
                    <span class="fw-bold">
                        ${url.name} <i class="bi bi-box-arrow-up-right"></i>
                    </span>
                </a>
            `).join('')
            : '';

        return `
            <li class="card border-0 bg-light rounded-4 p-4 mb-4">
                <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                    <h4 class="fw-bold mb-0">${project.name}</h4>
                    <span class="badge rounded-pill bg-white text-dark border">${project.date}</span>
                </div>

                <div class="bg-white border rounded-3 p-3 mb-3">
                    <span class="fw-bold">${skill_name}: </span>${project.skills}
                </div>

                <div class="text-secondary lh-lg mb-3">
                    <p class="mb-0">${project.description}</p>
                </div>

                <div>${urls_html}</div>
            </li>
        `;
    }).join('');
}

/**
 * Render localized portfolio content
 *
 * @param {object} locale
 * @param {string} asset_prefix
 */
export function render_content(locale, asset_prefix = '') {
    const skill_name = locale.site.skillsLabel;

    $('#job-list').html(render_jobs(locale.jobs ?? [], skill_name));
    $('#study-list').html(render_studies(locale.studies ?? []));
    $('#skill-list').html(render_skills(locale.skills ?? [], asset_prefix));
    $('#course-list').html(render_courses(locale.courses ?? []));
    $('#project-list').html(render_projects(locale.projects ?? [], skill_name));
}
