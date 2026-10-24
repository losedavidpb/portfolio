import { render_content } from './content.js'
import { base_path, load_localization } from './localization.js'
import { hide_loader, init_page, init_tooltips } from './page.js'

/**
 * Main procedure
 */
async function main() {
    const locale = await load_localization();

    init_page(locale);
    render_content(locale, base_path);
    init_tooltips();
    hide_loader();
}

main();
