$(document).ready(function() {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                var currentLocation = window.location.href;
                $('#toplinks .nav-link').each(function() {
                    var linkHref = $(this).attr('href');
                    if (linkHref === currentLocation) {
                        $(this).addClass('active');
                    } else {
                        $(this).removeClass('active');
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});