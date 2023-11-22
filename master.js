$(document).ready(function() {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                var currentPath = new URL(window.location.href).pathname;
                $('#listedlinks .nav-link').each(function() {
                    var linkHref = new URL($(this).attr('href')).pathname;
                    if (currentPath.endsWith(linkHref)) {
                        $(this).addClass('active');
                    } else {
                        $(this).removeClass('active');
                    }
                });
            }
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
});