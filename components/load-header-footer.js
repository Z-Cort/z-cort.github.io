(function () {
    'use strict';

    const path = window.location.pathname;
    const basePath = (path.includes('/projects/') || path.includes('/websites/')) ? '../' : '';
    const imgPath = basePath + 'images/';

    // Services link: from root = websites/services.html, from projects = ../websites/services.html, from websites = services.html
    const servicesHref = path.includes('/websites/') ? 'services.html' : basePath + 'websites/services.html';
    const contactHref = basePath + 'contact.html';

    const headerHtml = `
<header class="header">
    <div class="container">
        <div class="header-content">
            <div class="logo">
                <a href="${basePath}index.html">
                    <img src="${imgPath}logo-zacharycortinovis.svg" class="logo" alt="Zac's Logo">
                </a>
            </div>
            <button class="hamburger" aria-label="Open menu" aria-expanded="false" type="button">
                <span class="hamburger-bar"></span>
                <span class="hamburger-bar"></span>
                <span class="hamburger-bar"></span>
            </button>
            <nav class="nav nav-desktop">
                <a href="${basePath}index.html">Home</a>
                <a href="${servicesHref}">Services</a>
                <a href="${contactHref}">Contact</a>
            </nav>
        </div>
    </div>
    <nav class="nav-mobile" aria-hidden="true">
        <a href="${basePath}index.html">Home</a>
        <a href="${servicesHref}">Services</a>
        <a href="${contactHref}">Contact</a>
    </nav>
    <div class="nav-mobile-overlay" aria-hidden="true"></div>
</header>`;

    const footerHtml = `
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-logo"><img src="${imgPath}logo-vulpine-white.svg" class="logo" alt="Vulpine Logo"></div>
            <nav class="footer-nav">
                <a href="${basePath}index.html">Home</a>
                <a href="${contactHref}">Contact</a>
                <a href="${servicesHref}">Services</a>
            </nav>
        </div>
    </div>
</footer>`;

    function loadComponents() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');

        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = headerHtml;
            initHamburger();
        }
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerHtml;
        }
    }

    function initHamburger() {
        const hamburger = document.querySelector('.hamburger');
        const navMobile = document.querySelector('.nav-mobile');

        if (!hamburger || !navMobile) return;

        function closeMenu() {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open menu');
            navMobile.setAttribute('aria-hidden', 'true');
            navMobile.classList.remove('nav-mobile-open');
            hamburger.classList.remove('hamburger-open');
            document.body.classList.remove('menu-open');
        }

        hamburger.addEventListener('click', function () {
            const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isOpen);
            hamburger.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
            navMobile.setAttribute('aria-hidden', isOpen);
            navMobile.classList.toggle('nav-mobile-open');
            hamburger.classList.toggle('hamburger-open');
            document.body.classList.toggle('menu-open', !isOpen);
        });

        var overlay = document.querySelector('.nav-mobile-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        navMobile.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadComponents);
    } else {
        loadComponents();
    }
})();
