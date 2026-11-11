import { get_page_url, lang } from './localization.js'

// Navigation
// ==========================

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

    // Highlight the selector that represents the current language
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
 * Respect the user's operating-system motion preference
 *
 * @returns {'auto'|'smooth'}
 */
function get_scroll_behavior() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

/**
 * Smoothly scroll to the selected page section
 */
function set_section_shortcuts() {
    // Delegation keeps links inserted by render_content() smooth-scrollable
    $(document).on('click', '.section-shortcut[href^="#"], .featured-link[href^="#"]', event => {
        event.preventDefault();

        // Prevent Bootstrap's focus-triggered tooltip from remaining visible
        bootstrap.Tooltip.getInstance(event.currentTarget)?.hide();
        event.currentTarget.blur();

        const target_id = event.currentTarget.getAttribute('href');

        // The page needs to scroll to the beginning of the page
        // rather than the home section
        if (target_id === '#home') {
            document.querySelector('.background').scrollTo({
                top: 0,
                behavior: get_scroll_behavior()
            });

            return;
        }

        const target = document.querySelector(target_id);

        if (!target) {
            return;
        }

        const scroll_to_target = () => target.scrollIntoView({
            behavior: get_scroll_behavior(),
            block: 'start'
        });

        // Reveal targets inside a folded card before trying to scroll to them
        const collapsed_parent = target.closest('.collapse, .collapsing');

        if (collapsed_parent && !collapsed_parent.classList.contains('show')) {
            collapsed_parent.addEventListener('shown.bs.collapse', scroll_to_target, { once: true });

            const collapse = bootstrap.Collapse.getInstance(collapsed_parent)
                ?? new bootstrap.Collapse(collapsed_parent, { toggle: false });

            collapse.show();
            return;
        }

        scroll_to_target();
    });
}

/**
 * Highlight the navigation link for the section currently in view
 */
function set_active_section() {
    const scroll_container = document.querySelector('.background');
    const links = [...document.querySelectorAll('.section-shortcut[href^="#"]')];

    // Keep one ordered entry per section even when desktop and mobile links coexist
    const entries = [...new Map(links.map(link => [
        link.hash,
        { hash: link.hash, section: document.querySelector(link.hash) }
    ])).values()];

    if (!scroll_container || entries.length === 0) {
        return;
    }

    const update_active = () => {
        // Use a line near the top of the viewport to determine the current section
        const reference_line = scroll_container.getBoundingClientRect().top
            + (scroll_container.scrollTop > 1 ? scroll_container.clientHeight * 0.2 : 0);
        let current = entries[0];

        for (const entry of entries) {
            if (entry.section?.getBoundingClientRect().top <= reference_line) {
                current = entry;
            }
        }

        // Select the final section when the page reaches the bottom
        if (scroll_container.scrollTop + scroll_container.clientHeight >= scroll_container.scrollHeight - 1) {
            current = entries.at(-1);
        }

        // Update both the visual state and its accessible equivalent
        for (const link of links) {
            const is_active = link.hash === current.hash;
            link.classList.toggle('active', is_active);

            if (is_active) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        }
    };

    // Keep the active section synchronised with scrolling and viewport changes
    scroll_container.addEventListener('scroll', update_active, { passive: true });
    window.addEventListener('resize', update_active);
    update_active();
}

// Page localization
// ==========================

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

    // Keep canonical and alternate language URLs aligned with the current environment
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
    $('#mobile-nav-button').attr('aria-label', site.openNavigation);
    $('#mobile-section-nav-title').text(site.navigationTitle);
    $('#mobile-section-nav .btn-close').attr('aria-label', site.closeNavigation);
    $('#mobile-section-nav nav').attr('aria-label', site.navigationLabel);
    $('.home-section').text(site.homeLabel);
    $('a.bi-envelope-fill').attr({ title: site.mailLabel, 'aria-label': site.mailLabel });
}

/**
 * Set home page content
 *
 * @param {object} home
 */
function set_home_content(home) {
    $('.home-link').attr({ title: home.homeTooltip, 'aria-label': home.homeTooltip });
    $('.about-me-link').attr({ title: home.aboutTooltip, 'aria-label': home.aboutTooltip });
    $('.featured-link-nav').attr({ title: home.featuredTooltip, 'aria-label': home.featuredTooltip });
    $('.experience-link').attr({ title: home.experienceTooltip, 'aria-label': home.experienceTooltip });
    $('.studies-link').attr({ title: home.studiesTooltip, 'aria-label': home.studiesTooltip });
    $('.skills-link').attr({ title: home.skillsTooltip, 'aria-label': home.skillsTooltip });
    $('.projects-link').attr({ title: home.projectsTooltip, 'aria-label': home.projectsTooltip });
    $('.courses-certificates-link').attr({ title: home.coursesTooltip, 'aria-label': home.coursesTooltip });

    const mobile_labels = {
        '#home': home.homeTooltip,
        '#about-me': home.aboutTooltip,
        '#featured': home.featuredTooltip,
        '#jobs-studies': home.experienceTooltip,
        '#studies': home.studiesTooltip,
        '#skills': home.skillsTooltip,
        '#projects': home.projectsTooltip,
        '#courses': home.coursesTooltip
    };

    for (const [target, label] of Object.entries(mobile_labels)) {
        $(`#mobile-section-nav a[href="${target}"] span`).text(label);
    }

    $('.about-me-header').text(home.aboutTitle);
    $('.featured-header').text(home.featuredTitle);
    $('.introduction-title').text(home.introductionTitle);

    // Rebuild the introduction so every localized paragraph remains separate
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
    // Initialise navigation before applying the translated page content
    set_lang_selector();
    set_navbar_links();
    set_section_shortcuts();
    set_active_section();
    set_page_metadata(locale.site);
    set_common_content(locale.site);
    set_home_content(locale.home);
}

/**
 * Initialize Bootstrap tooltips.
 */
export function init_tooltips() {
    // Tooltip elements include content inserted dynamically by render_content()
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(element => {
        new bootstrap.Tooltip(element);
    });
}

// Loader
// ==========================

/**
 * Hide and remove the loader screen
 */
export function hide_loader() {
    // Remove the element after its fade-out transition finishes
    $('#loader').removeClass('show').one('transitionend', function () {
        $(this).remove();
    });
}
