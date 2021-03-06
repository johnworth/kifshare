(function () {
    "use strict";

    function trimURLPath(pathname) {
        var split_paths = pathname.split("/"),
            new_path_array = split_paths.slice(0, split_paths.length - 1);
        return new_path_array.join("/");
    }

    function curlableURL() {
        var a = document.createElement('a'),
            retval = "";

        a.href = document.URL;
        retval = retval + a.protocol + "//";
        retval = retval + a.hostname;

        if (a.port !== 'undefined' && a.port !== '80' && a.port !== null && a.port !== '') {
            retval = retval + ":" + a.port;
        }

        retval = retval + trimURLPath(a.pathname);

        return retval;
    }

    function get_ticket_info() {
        var info = JSON.parse($('#ticket-info-map').text());
        info.url = curlableURL();
        return info;
    }

    //Taken from StackOverflow because I'm lazy: http://stackoverflow.com/a/1912522
    function htmlDecode(input) {
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

    function enableCopy(wrapperId, selectionId) {
        var wrapperElement = document.getElementById(wrapperId),
            selectionElement = document.getElementById(selectionId);
        wrapperElement.addEventListener('click', function() {
            selectionElement.select();
            document.execCommand('copy');
        });
    }

    $(document).ready(function() {
        var ticket_info = get_ticket_info(),
            last_mod_date = new Date(Number($('#lastmod').text())),
            wget_template = ticket_info.wget_template,
            curl_template = ticket_info.curl_template,
            iget_template = ticket_info.iget_template,
            wget_command = htmlDecode(Mustache.render(wget_template, ticket_info)),
            curl_command = htmlDecode(Mustache.render(curl_template, ticket_info)),
            iget_command = htmlDecode(Mustache.render(iget_template, ticket_info));

        $('#lastmod').text(last_mod_date.toString());
        $('#irods-command-line').val(iget_command);
        $('#curl-command-line').val(curl_command);
        $('#wget-command-line').val(wget_command);

        enableCopy('irods-copy', 'irods-command-line');
        enableCopy('curl-copy', 'curl-command-line');
        enableCopy('wget-copy', 'wget-command-line');
    });

}());
