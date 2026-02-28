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
    const linkedInSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#0072B1"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
    const instagramSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#E4405F"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>';
    const youtubeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';

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
        <div class="nav-mobile-social">
            <a href="https://www.linkedin.com/in/zacharycortinovis/" class="contact-btn footer-social-btn" aria-label="LinkedIn">${linkedInSvg}</a>
            <a href="https://www.instagram.com/zacharycortinovis.design/" class="contact-btn footer-social-btn" aria-label="Instagram">${instagramSvg}</a>
            <a href="https://www.youtube.com/@zacharycortinovis" class="contact-btn footer-social-btn" aria-label="YouTube">${youtubeSvg}</a>
        </div>
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
            <div class="footer-social">
                <a href="https://www.linkedin.com/in/zacharycortinovis/" class="contact-btn footer-social-btn" aria-label="LinkedIn">${linkedInSvg}</a>
                <a href="https://www.instagram.com/zacharycortinovis.design/" class="contact-btn footer-social-btn" aria-label="Instagram">${instagramSvg}</a>
                <a href="https://www.youtube.com/@zacharycortinovis" class="contact-btn footer-social-btn" aria-label="YouTube">${youtubeSvg}</a>
            </div>
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
