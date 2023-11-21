$(document).ready(function() {
    var currentLocation = window.location.pathname;
    $('header-component a').each(function() {
        if ($(this).attr('href') === currentLocation) {
            $(this).addClass('active');
        }
    });
});