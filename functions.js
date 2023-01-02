/****************************************************************
 * Functions for losedavidpb.github.io
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 ***************************************************************/

/**
 * Load HTML content when current page is not finished
 */
function still_in_progress() {
    var html_content = '<div class="d-inline-block"> \
        <img src="https://media4.giphy.com/media/l3q2IYN87QjIg51kc/giphy.gif? cid=ecf05e47ttl6fayrd4iv1305oy6h7jjyq48xd6t5kxuu33hr&rid=giphy.gif&ct=g"/> \
        <span class="fs-1">Sorry, still in progress! 😅</span> \
    </div>';

    $("#in-progress").html(html_content);
}