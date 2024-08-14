$(document).ready(function() {
    var observer = new MutationObserver(function(mutations) {
        console.log('MutationObserver triggered'); // Check if MutationObserver is triggered
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                var currentPath = new URL(window.location.href).pathname;
                console.log('Current path:', currentPath); // Print the current path
                $('#listedlinks .nav-link').each(function() {
                    var linkHref = new URL(window.location.origin + $(this).attr('href')).pathname;
                    console.log('Link href:', linkHref); // Print the href of each link
                    if (currentPath === linkHref) {
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