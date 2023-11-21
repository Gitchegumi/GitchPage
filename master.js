$(document).ready(function() {
    var currentLocation = window.location.href;
    $('#toplinks .nav-link').each(function() {
        var linkHref = $(this).attr('href');
        if (linkHref === currentLocation) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });
});