$(document).ready(function() {
    var currentLocation = window.location.href;
    $('header a').each(function() {
        var linkHref = $(this).attr('href');
        if (linkHref === currentLocation || 
            (linkHref === 'https://www.gitchegumi.com' && currentLocation === 'https://www.gitchegumi.com/')) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });
});