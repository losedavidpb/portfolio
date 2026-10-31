import { render_content } from './content.js'
import { base_path, load_localization } from './localization.js'
import { hide_loader, init_page, init_tooltips } from './page.js'

// Application entry point
// ==========================

/**
 * Main procedure
 */
async function main() {
    // Load locale data before updating any visible page content
    const locale = await load_localization();

    init_page(locale);
    render_content(locale, base_path);

    // Dynamic content must exist before Bootstrap scans for tooltip elements
    init_tooltips();

    // Reveal the page only after localization and component setup are complete
    hide_loader();
}

main();
