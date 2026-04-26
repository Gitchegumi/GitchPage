(function () {
    'use strict';

    var burger   = document.querySelector('.gm-burger');
    var navMenu  = document.querySelector('.gm-nav-menu');
    var navItems = document.querySelectorAll('.gm-nav-item[data-dropdown]');

    /* Mobile burger toggle */
    if (burger && navMenu) {
        burger.addEventListener('click', function (e) {
            e.stopPropagation();
            navMenu.classList.toggle('is-open');
        });
    }

    /* Dropdown toggle on click */
    navItems.forEach(function (item) {
        var trigger = item.querySelector('.gm-nav-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            var alreadyOpen = item.classList.contains('is-open');

            /* Close all */
            navItems.forEach(function (other) {
                other.classList.remove('is-open');
            });

            /* Toggle this one */
            if (!alreadyOpen) {
                item.classList.add('is-open');
            }
        });
    });

    /* Close everything on outside click */
    document.addEventListener('click', function () {
        navItems.forEach(function (item) {
            item.classList.remove('is-open');
        });
        if (navMenu) navMenu.classList.remove('is-open');
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        navItems.forEach(function (item) {
            item.classList.remove('is-open');
        });
        if (navMenu) navMenu.classList.remove('is-open');
    });

    /* Prevent dropdown panel clicks from closing the dropdown */
    document.querySelectorAll('.gm-dropdown').forEach(function (panel) {
        panel.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

}());
