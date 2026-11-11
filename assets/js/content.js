// Content rendering
// ==========================

/**
 * Render pinned portfolio entries
 *
 * @param {object} locale
 * @returns {string}
 */
export function render_featured(locale) {
    return (locale.projects ?? [])
        .filter(project => project.featured)
        .map(project => ({
            ...project.featured,
            href: project.id ? `#${project.id}` : '#projects',
            title: project.featured.title ?? project.name
        }))
        .sort((first, second) => first.order - second.order)
        .map(item => `
            <article class="featured-item col-12 col-md-4">
                <div class="h-100 d-flex flex-column bg-light border rounded-4 p-4">
                    <h3 class="h5 fw-bold mb-2">${item.title}</h3>
                    <p class="text-secondary mb-4">${item.summary}</p>
                    <a class="featured-link fw-bold mt-auto" href="${item.href}">
                        ${locale.home.featuredView} <i class="bi bi-arrow-right"></i>
                    </a>
                </div>
            </article>
        `).join('');
}

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
            <h3 class="h4 fw-bold mb-2">${job.job}</h3>
            <p class="text-primary fw-semibold mb-2">${job.company} · ${job.type}</p>
            <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="badge rounded-pill bg-white text-dark border text-wrap text-break">
                    ${job.date}
                </span>
                <span class="badge rounded-pill bg-white text-dark border text-wrap text-break">
                    <i class="bi bi-geo-alt-fill me-1"></i>${job.location}
                </span>
            </div>
            <div class="text-secondary text-justify mb-3">${job.description}</div>
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
        // Some studies include an optional list of results or qualifications
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
                <h3 class="h4 fw-bold mb-2">${study.title}</h3>
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
 * @param {object} skill_levels
 * @param {string} asset_prefix
 * @returns {string}
 */
export function render_skills(skills, skill_levels, asset_prefix = '') {
    return skills.map(skill => {
        const values_html = skill.values.map(value => {
            const image = `
                <img src="${asset_prefix}${value.src}" class="lang-image img-fluid" alt="${value.alt}"
                    width="56" height="56" loading="lazy" decoding="async"
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="${value.tooltip}" />`;

            // Wrap skills with a source URL in a link while keeping the same layout
            const image_container = value.href
                ? `<a class="skill-logo d-flex align-items-center justify-content-center bg-white border rounded-3 shadow-sm p-3"
                        href="${value.href}" target="_blank" rel="noopener noreferrer">${image}</a>`
                : `<div class="skill-logo d-flex align-items-center justify-content-center bg-white border rounded-3 shadow-sm p-3">${image}</div>`;

            return `
                <div class="skill-row row align-items-center g-3 mb-4">
                    <div class="col-auto">
                        ${image_container}
                    </div>
                    <div class="skill-details col">
                        <div class="skill-heading d-flex justify-content-between align-items-center mb-2">
                            <h4 class="skill-name h5 fw-semibold mb-0">${value.tooltip}</h4>
                            <span class="skill-level badge rounded-pill text-bg-primary">
                                ${skill_levels[value.level] ?? value.level}
                            </span>
                        </div>
                        <div class="progress rounded-pill bg-white" style="height: 0.75rem">
                            <div class="progress-bar bg-primary bg-gradient rounded-pill" role="progressbar"
                                style="width: ${value.value * 2}%" aria-valuenow="${value.value * 2}"
                                aria-valuemin="0" aria-valuemax="100"
                                aria-label="${value.tooltip}: ${skill_levels[value.level] ?? value.level}">
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <li class="skill-group bg-light rounded-4 p-4 mb-4">
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
            <h3 class="h5 fw-bold mb-1">${course.title}</h3>
            <span class="text-secondary">${course.subtitle}</span>
        </li>
    `).join('');
}

/**
 * Render projects
 *
 * @param {object[]} projects
 * @param {string} skill_name
 * @param {string} asset_prefix
 * @returns {string}
 */
export function render_projects(projects, skill_name, asset_prefix = '') {
    return projects.map(project => {
        const id_attribute = project.id ? ` id="${project.id}"` : '';

        // Some projects include an optional image
        let image_html = '';

        if (project.image) {
            const image = `
                <img src="${asset_prefix}${project.image.src}" class="project-image"
                    alt="${project.image.alt}" loading="lazy" decoding="async"
                    width="1920" height="1080"
                    style="object-position: ${project.image.position ?? 'center'}" />
            `;

            // Wrap linked project images while leaving unlinked images unchanged
            image_html = project.image.href
                ? `<a class="project-image-link" href="${project.image.href}"
                    target="_blank" rel="noopener noreferrer">${image}</a>`
                : image;
        }

        // Projects may expose one or more external links
        const urls_html = project.urls
            ? project.urls.map(url => `
                <a class="btn btn-primary rounded-pill px-4 me-2 mb-2" href="${url.value}"
                    target="_blank" rel="noopener noreferrer" role="button">
                    <span class="fw-bold">
                        ${url.name} <i class="bi bi-box-arrow-up-right"></i>
                    </span>
                </a>
            `).join('')
            : '';

        return `
            <li class="card project-card border-0 bg-light rounded-4 overflow-hidden mb-4"${id_attribute}>
                ${image_html}
                <div class="p-4">
                    <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                        <h3 class="h4 fw-bold mb-0">${project.name}</h3>
                        <span class="project-date badge rounded-pill bg-white text-dark border">${project.date}</span>
                    </div>
                    <div class="bg-white border rounded-3 p-3 mb-3">
                        <span class="fw-bold">${skill_name}: </span>${project.skills}
                    </div>
                    <div class="text-secondary text-justify lh-lg mb-3">
                        ${project.description}
                    </div>
                    <div>${urls_html}</div>
                </div>
            </li>
        `;
    }).join('');
}

// Browser integration
// ==========================

/**
 * Render localized portfolio content
 *
 * @param {object} locale
 * @param {string} asset_prefix
 */
export function render_content(locale, asset_prefix = '') {
    const skill_name = locale.site.skillsLabel;

    // Empty arrays keep optional sections renderable when locale data is absent
    $('#featured-list').html(render_featured(locale));
    $('#job-list').html(render_jobs(locale.jobs ?? [], skill_name));
    $('#study-list').html(render_studies(locale.studies ?? []));
    $('#skill-list').html(render_skills(locale.skills ?? [], locale.home.skillLevels, asset_prefix));
    $('#course-list').html(render_courses(locale.courses ?? []));
    $('#project-list').html(render_projects(locale.projects ?? [], skill_name, asset_prefix));
}
