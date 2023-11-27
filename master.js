$(document).ready(function() {
    var observer = new MutationObserver(function(mutations) {
        console.log('MutationObserver triggered'); // Check if MutationObserver is triggered
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                var currentPath = new URL(window.location.href).pathname;
                console.log('Current path:', currentPath); // Print the current path
                $("#listedlinks .nav-link, #listedlinks .dropdown-item").each(function() {
                    try {
                        var linkHref = new URL($(this).attr('href')).pathname;
                        if (window.location.pathname.endsWith(linkHref)) {
                            $(this).addClass('active');
                        } else {
                            $(this).removeClass('active');
                        }
                    } catch (error) {
                        console.error(`Failed to create URL from href "${$(this).attr('href')}": ${error}`);
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