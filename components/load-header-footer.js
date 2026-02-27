(function () {
    'use strict';

    const path = window.location.pathname;
    const basePath = (path.includes('/projects/') || path.includes('/websites/')) ? '../' : '';
    const imgPath = basePath + 'images/';

    // Services link: from root = websites/services.html, from projects = ../websites/services.html, from websites = services.html
    const servicesHref = path.includes('/websites/') ? 'services.html' : basePath + 'websites/services.html';
    const contactHref = basePath + 'contact.html';
    const projectsHref = basePath + 'projects.html';
    const aboutHref = basePath + 'about.html';

    const sunIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    const moonIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

    const headerHtml = `
<header class="header">
    <div class="container">
        <div class="header-content">
            <div class="logo">
                <a href="${basePath}index.html">
                    <img src="${imgPath}logo-zacharycortinovis.svg" class="logo logo-light" alt="Zac's Logo">
                    <img src="${imgPath}logo-zacharycortinovis-white.svg" class="logo logo-dark" alt="Zac's Logo">
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
                <a href="${projectsHref}">Projects</a>
                <a href="${aboutHref}">About</a>
                <a href="${contactHref}">Contact</a>
                <button class="theme-toggle" aria-label="Toggle dark mode" type="button"></button>
            </nav>
        </div>
    </div>
    <nav class="nav-mobile" aria-hidden="true">
        <a href="${basePath}index.html">Home</a>
        <a href="${servicesHref}">Services</a>
        <a href="${projectsHref}">Projects</a>
        <a href="${aboutHref}">About</a>
        <a href="${contactHref}">Contact</a>
        <button class="theme-toggle theme-toggle-mobile" aria-label="Toggle dark mode" type="button"></button>
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
                <a href="${servicesHref}">Services</a>
                <a href="${projectsHref}">Projects</a>
                <a href="${aboutHref}">About</a>
                <a href="${contactHref}">Contact</a>
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
            initThemeToggle();
            initFloatingHeader();
        }
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerHtml;
        }
    }

    function getActiveTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }

    function updateToggleIcons() {
        var isDark = getActiveTheme() === 'dark';
        document.querySelectorAll('.theme-toggle').forEach(function(btn) {
            btn.innerHTML = isDark ? sunIcon : moonIcon;
            btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        });
    }

    function initThemeToggle() {
        updateToggleIcons();
        document.querySelectorAll('.theme-toggle').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var next = getActiveTheme() === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
                updateToggleIcons();
            });
        });
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

    function initFloatingHeader() {
        var header = document.querySelector('.header');
        var placeholder = document.getElementById('header-placeholder');
        if (!header) return;

        var threshold = 10;
        var isFloating = false;
        var ticking = false;

        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function() {
                var scrollY = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollY > threshold && !isFloating) {
                    isFloating = true;
                    if (placeholder) {
                        placeholder.style.minHeight = header.offsetHeight + 'px';
                    }
                    header.classList.add('header-floating');
                } else if (scrollY <= threshold && isFloating) {
                    isFloating = false;
                    header.classList.add('header-returning');
                    header.classList.remove('header-floating');
                    if (placeholder) {
                        placeholder.style.minHeight = '';
                    }
                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            header.classList.remove('header-returning');
                        });
                    });
                }
                ticking = false;
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadComponents);
    } else {
        loadComponents();
    }
})();
