(function () {
    'use strict';

    var burger   = document.querySelector('.gm-burger');
    var navMenu  = document.querySelector('.gm-nav-menu');
    var navItems = document.querySelectorAll('.gm-nav-item[data-dropdown]');

    function isDesktop() { return window.innerWidth >= 768; }

    function closeAll() {
        navItems.forEach(function (item) { item.classList.remove('is-open'); });
    }

    /* Mobile burger toggle */
    if (burger && navMenu) {
        burger.addEventListener('click', function (e) {
            e.stopPropagation();
            navMenu.classList.toggle('is-open');
        });
    }

    navItems.forEach(function (item) {
        var trigger = item.querySelector('.gm-nav-trigger');
        if (!trigger) return;
        var closeTimer = null;

        /* Desktop: open on hover, close after a short delay so the cursor
           has time to travel from the trigger into the dropdown panel */
        item.addEventListener('mouseenter', function () {
            if (!isDesktop()) return;
            clearTimeout(closeTimer);
            closeAll();
            item.classList.add('is-open');
        });

        item.addEventListener('mouseleave', function () {
            if (!isDesktop()) return;
            closeTimer = setTimeout(function () {
                item.classList.remove('is-open');
            }, 150);
        });

        /* Mobile: open on click */
        trigger.addEventListener('click', function (e) {
            if (isDesktop()) return;
            e.stopPropagation();
            var alreadyOpen = item.classList.contains('is-open');
            closeAll();
            if (!alreadyOpen) { item.classList.add('is-open'); }
        });
    });

    /* Close on outside click (mobile) */
    document.addEventListener('click', function () {
        if (isDesktop()) return;
        closeAll();
        if (navMenu) navMenu.classList.remove('is-open');
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        closeAll();
        if (navMenu) navMenu.classList.remove('is-open');
    });

    /* Prevent dropdown panel clicks from closing on mobile */
    document.querySelectorAll('.gm-dropdown').forEach(function (panel) {
        panel.addEventListener('click', function (e) { e.stopPropagation(); });
    });

}());
