import { get_page_url, lang } from './localization.js'

//////// NAVIGATION

/**
 * Set the current language selector
 */
function set_lang_selector() {
    const urls = {
        en: get_page_url('en'),
        es: get_page_url('es')
    };

    $('#language-div').children().eq(0).attr('href', urls.es);
    $('#language-div').children().eq(1).attr('href', urls.en);

    const lang_index = lang === 'es' ? 0 : 1;
    const other_lang_index = lang_index === 0 ? 1 : 0;

    $('#language-div').children().eq(lang_index).addClass('active');
    $('#language-div').children().eq(other_lang_index).removeClass('active');
}

/**
 * Set navbar links
 */
function set_navbar_links() {
    $('#index-nav-link').attr('href', get_page_url(lang));
}

/**
 * Smoothly scroll to the selected page section
 */
function set_section_shortcuts() {
    $('#navbar-vertical a[href^="#"]').on('click', event => {
        event.preventDefault();

        const target_id = event.currentTarget.getAttribute('href');

        // The page needs to scroll to the beginning of the page
        // rather than the home section
        if (target_id === '#home') {
            document.querySelector('.background').scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            return;
        }

        document.querySelector(target_id)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
}

//////// PAGE

/**
 * Set localized page metadata
 *
 * @param {object} site
 */
function set_page_metadata(site) {
    document.documentElement.lang = lang;
    document.title = site.title;

    $('meta[name="description"]').attr('content', site.description);
    $('meta[name="author"]').attr('content', site.author);
    $('link[rel="canonical"]').attr('href', get_page_url(lang));
    $('link[rel="alternate"][hreflang="en"]').attr('href', get_page_url('en'));
    $('link[rel="alternate"][hreflang="es"]').attr('href', get_page_url('es'));
    $('link[rel="alternate"][hreflang="x-default"]').attr('href', get_page_url());
}

/**
 * Set content shared by all pages
 *
 * @param {object} site
 */
function set_common_content(site) {
    $('.person-header, [id="person-header"]').text(site.name);
    $('#current-rol-header').text(site.role);
    $('img[id="profile-image"]').attr('alt', site.profileImageAlt);
    $('#loading-text').text(site.loading);
    $('#offcanvas-button').attr('aria-label', site.openNavigation);
    $('.btn-close').attr('aria-label', site.closeNavigation);
    $('.home-section').text(site.homeLabel);
    $('a.bi-envelope-fill').attr('title', site.mailLabel);
}

/**
 * Set home page content
 *
 * @param {object} home
 */
function set_home_content(home) {
    $('.home-link').attr('title', home.homeTooltip);
    $('.about-me-link').attr('title', home.aboutTooltip);
    $('.experience-studies-link').attr('title', home.experienceStudiesTooltip);
    $('.skills-link').attr('title', home.skillsTooltip);
    $('.projects-link').attr('title', home.projectsTooltip);
    $('.courses-certificates-link').attr('title', home.coursesTooltip);

    $('.about-me-header').text(home.aboutTitle);
    $('.introduction-title').text(home.introductionTitle);

    const introduction = $('.introduction-content').empty();
    home.introduction.forEach(paragraph => {
        introduction.append($('<p>').text(paragraph));
    });

    $('.experience-header').text(home.experienceTitle);
    $('.studies-header').text(home.studiesTitle);
    $('.skills-header').text(home.skillsTitle);
    $('.projects-header').text(home.projectsTitle);
    $('.courses-certificates-header').text(home.coursesTitle);
}

/**
 * Initialize localized page content
 *
 * @param {object} locale
 */
export function init_page(locale) {
    set_lang_selector();
    set_navbar_links();
    set_section_shortcuts();
    set_page_metadata(locale.site);
    set_common_content(locale.site);
    set_home_content(locale.home);
}

/**
 * Initialize Bootstrap tooltips.
 */
export function init_tooltips() {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(element => {
        new bootstrap.Tooltip(element);
    });
}

//////// LOADER

/**
 * Hide and remove the loader screen
 */
export function hide_loader() {
    $('#loader').removeClass('show').one('transitionend', function () {
        $(this).remove();
    });
}
