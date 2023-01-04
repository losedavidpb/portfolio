/****************************************************************
 * Functions for losedavidpb.github.io
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 * @release 1.0.0
 ***************************************************************/

import jobs_json from './data/json/jobs.json' assert { type: 'json' }
import studies_json from './data/json/studies.json' assert { type: 'json' }
import courses_json from './data/json/courses.json' assert { type: 'json' }
import projects_json from './data/json/projects.json' assert { type: 'json' }

// --- JSON loading ...
// -------------------------

if (jobs_json.jobs) {
    let jobs = jobs_json.jobs;

    jobs.forEach(job => {
        include_job(job);
    })
}

if (studies_json.studies) {
    let studies = studies_json.studies;

    studies.forEach(study => {
        include_study(study);
    });
}

if (courses_json.courses) {
    let courses = courses_json.courses;

    courses.forEach(course => {
        include_course(course);
    });
}

if (projects_json.projects) {
    let projects = projects_json.projects;

    projects.forEach(project => {
        include_project(project);
    });
}

// --- Language Charts ...
// -------------------------

// Global settings for each chart

if ($('#language-chart-1') && $('#language-chart-2')) {
    const options = {
        indexAxis: 'y',
        scales: {
            x: {
                stacked: true,
                ticks: { display: false },
                grid: { display: false },
                border: { display: false }
            },
            y: {
                stacked: true,
                grid: { display: false },
                border: { display: false },
                ticks: {
                    color: '#1d1814',
                    font: {
                        size: 15,
                        weight: 'bold',
                    }
                }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        }
    };

    create_programming_langs_chart(
        '#language-chart-1', options,
        ["Java", "Python", "C#", "Unity"],
        [95, 95, 80, 60], ['#e76f00', '#3571a3', '#9a4993', '#110b09']
    );

    create_programming_langs_chart(
        '#language-chart-2', options,
        ["PHP", "PL/SQL", "JavaScript", "ASP .NET MVC"],
        [100, 80, 75, 70], ['#617cbe', '#e00022', '#f8dc3e', '#48b2e6']
    );
}

/**
 * Create a new bar chart for programming languages.
 *
 * @param {string} id_chart
 * @param {object} options
 * @param {Array} labels
 * @param {Array} data
 * @param {Array} background_color
 */
function create_programming_langs_chart(id_chart, options, labels, data, background_color) {
    let data_2 = data.map((x) => 100 - x);
    let background_color_2 = background_color.map((x) => '#e0e0e0');

    new Chart($(id_chart).get(0).getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    categoryPercentage: 1.0,
                    barPercentage: 0.5,
                    data: data,
                    backgroundColor: background_color,
                    borderRadius: 4,
                },
                {
                    categoryPercentage: 1.0,
                    barPercentage: 0.5,
                    data: data_2,
                    backgroundColor: background_color_2,
                    borderRadius: 4,
                }
            ]
        },
        options: options
    });
}

/**
 * Include a new job at the current job list
 *
 * @param {object} job
 */
function include_job(job) {
    let html_content = '<li class="mb-3 pb-3"> \
        <h4>' + job.job + '</h4> \
        <div class="fs-5"><span><i>' + job.company + ' - ' + job.type + '</i></span><br> \
        <span class="text-muted">' + job.date + '</span><br> \
        <p class="text-muted">' + job.location + '</p> \
        <p>' + job.description + '</p> \
        <span><span class="fw-bold">Aptitudes</span> ' + job.skills + '</span></div> \
    </li>';

    $("#job-list").append(html_content);
}

/**
 * Include a new study at the current study list
 *
 * @param {object} study
 */
function include_study(study) {
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
 * Include a new course at the current course list.
 *
 * @param {object} course
 */
function include_course(course) {
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
 */
function include_project(project) {
    let html_content = '<li class="mb-5"> \
        <h4>' + project.name + '</h4> \
        <span class="text-muted fs-5">' + project.date + '</span><br> \
        <div class="fs-5"><p class="pt-3 mb-2 pe-4">' + project.description + '</p></div>';

    project.urls.forEach(url => {
        html_content += '<span class="fs-5"><span class="fw-bold">' + url.name + ': </span>';
        html_content += '<a class="link-primary">' + url.value + '</a></span><br>';
    });

    html_content += '</li>';

    $("#project-list").append(html_content);
}
