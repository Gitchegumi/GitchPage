$(document).ready(function() {
    var currentLocation = window.location.pathname;
    $('header-component a').each(function() {
        var linkPath = $(this).attr('href');
        if ((linkPath === currentLocation) || (linkPath === 'index.html' && currentLocation === '/')) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });
});