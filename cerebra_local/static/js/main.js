// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeLanguageDropdown();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeSwiper();
    initializeMap();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    // Smooth scroll to sections
    window.goTo = function(id) {
        const element = document.getElementById(id);
        if (element) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = element.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            closeMobileMenu();

            // Update active navigation item
            updateActiveNavItem(id);
        }
    };

    // Update active navigation item
    function updateActiveNavItem(activeId) {
        const navItems = document.querySelectorAll('.nav-text');
        navItems.forEach(item => {
            item.classList.remove('f-success');
            if (item.classList.contains(`nav-${activeId}`)) {
                item.classList.add('f-success');
            }
        });
    }
}

// Language dropdown functionality
function initializeLanguageDropdown() {
    window.myFunction = function() {
        const dropdown = document.getElementById("myDropdown");
        dropdown.classList.toggle("show");
    };

    window.pickLanguage = function(text, src) {
        const currentLangImg = document.getElementById("currentLanImg");
        const currentLangName = document.getElementById("currentLanName");

        if (currentLangImg && currentLangName) {
            currentLangImg.src = src;
            currentLangName.textContent = text;
        }

        const dropdown = document.getElementById("myDropdown");
        dropdown.classList.remove("show");

        // Update language-specific images
        updateLanguageImages(text);
    };

    // Close dropdown when clicking outside
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.currentLanName') &&
            !event.target.matches('.currentLanImg') &&
            !event.target.matches('.dropbtn')) {
            const dropdowns = document.getElementsByClassName("dropdown-content");
            Array.from(dropdowns).forEach(dropdown => {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            });
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const menuIcon = document.querySelector('.icon-menu');
    const menuWrapper = document.querySelector('.menu__wrapper');
    const body = document.body;

    if (menuIcon && menuWrapper) {
        menuIcon.addEventListener('click', function() {
            toggleMobileMenu();
        });

        // Close menu when clicking on menu links
        const menuLinks = document.querySelectorAll('.menu__link');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
    }

    function toggleMobileMenu() {
        const menuWrapper = document.querySelector('.menu__wrapper');
        const menuIcon = document.querySelector('.icon-menu');
        const body = document.body;

        menuWrapper.classList.toggle('showMenu');
        menuIcon.classList.toggle('active');
        body.classList.toggle('body-OH');

        const span = menuIcon.querySelector('span');
        if (span) {
            span.classList.toggle('invisible');
        }
    }

    window.closeMobileMenu = function() {
        const menuWrapper = document.querySelector('.menu__wrapper');
        const menuIcon = document.querySelector('.icon-menu');
        const body = document.body;

        menuWrapper.classList.remove('showMenu');
        menuIcon.classList.remove('active');
        body.classList.remove('body-OH');

        const span = menuIcon.querySelector('span');
        if (span) {
            span.classList.remove('invisible');
        }
    };
}

// Scroll effects
function initializeScrollEffects() {
    let ticking = false;

    function updateScrollEffects() {
        const scrollDistance = window.scrollY;
        const scrollItems = document.querySelectorAll('.scroll-item');
        const header = document.querySelector('.header');

        // Update header background opacity
        if (header) {
            const opacity = Math.min(scrollDistance / 100, 0.95);
            header.style.background = `rgba(10, 10, 10, ${opacity})`;
        }

        // Update active navigation based on scroll position
        scrollItems.forEach((elem, idx) => {
            const headerHeight = header ? header.clientHeight : 80;
            if (elem.offsetTop - headerHeight <= scrollDistance + 50) {
                const navItems = document.querySelectorAll('.nav-desktop');
                navItems.forEach(navItem => {
                    navItem.classList.remove('f-success');
                });

                if (navItems[idx]) {
                    navItems[idx].classList.add('f-success');
                }
            }
        });

        ticking = false;
    }

    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestScrollUpdate);

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.scroll-item, .problems__item, .statistic__item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// Swiper initialization
function initializeSwiper() {
    if (typeof Swiper !== 'undefined') {
        const swipers = document.querySelectorAll('.swiper');

        swipers.forEach(swiperElement => {
            new Swiper(swiperElement, {
                direction: 'horizontal',
                loop: true,
                speed: 500,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 40,
                    }
                },
                on: {
                    init: function() {
                        // Add custom styling after initialization
                        this.el.style.opacity = '1';
                    }
                }
            });
        });
    }
}

// Map initialization
function initializeMap() {
    if (typeof DG !== 'undefined') {
        DG.then(function() {
            const mapElement = document.getElementById('map');
            if (mapElement) {
                const map = DG.map('map', {
                    center: [43.2296, 76.960774],
                    zoom: 18,
                    scrollWheelZoom: false,
                });

                const marker = DG.marker([43.2296, 76.960774])
                    .addTo(map)
                    .bindPopup('CEREBRA.AI Ltd');

                // Custom map styling
                map.on('load', function() {
                    mapElement.style.filter = 'grayscale(0.3) contrast(1.2)';
                });
            }
        });
    }
}

// Language-specific image updates
function updateLanguageImages(language) {
    const imageMap = {
        'ENG': 'en',
        'РУС': 'ru',
        'ҚАЗ': 'kz'
    };

    const langCode = imageMap[language];
    if (!langCode) return;

    // Update gender statistics images
    const genderImages = {
        web: document.querySelectorAll('[class*="gender-web-img"]'),
        mobile: document.querySelectorAll('[class*="gender-img"]')
    };

    Object.values(genderImages).forEach(imageGroup => {
        imageGroup.forEach(img => {
            img.style.display = 'none';
        });
    });

    // Show appropriate language images
    const activeImages = document.querySelectorAll(`[class*="gender-web-img-${langCode}"], [class*="gender-img-${langCode}"]`);
    activeImages.forEach(img => {
        img.style.display = 'block';
    });

    // Update language item active states
    const langItems = document.querySelectorAll('.lang__item');
    langItems.forEach(item => {
        item.classList.remove('active');
    });

    const activeLangItem = document.querySelector(`.lang-${langCode.toLowerCase()}`);
    if (activeLangItem) {
        activeLangItem.classList.add('active');
    }
}

// Additional animations and effects
function initializeAnimations() {
    // Parallax effect for hero section
    const heroImage = document.querySelector('.welcome--img img');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }

    // Hover effects for problem items
    const problemItems = document.querySelectorAll('.problems__item');
    problemItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Statistics counter animation
    const statisticNumbers = document.querySelectorAll('.f-40.bold');
    const observerOptions = {
        threshold: 0.5
    };

    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                numberObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statisticNumbers.forEach(number => {
        numberObserver.observe(number);
    });
}

// Number animation function
function animateNumber(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));

    if (isNaN(number)) return;

    const duration = 2000;
    const steps = 60;
    const increment = number / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }

        const displayValue = Math.floor(current);
        element.textContent = text.replace(/\d+/, displayValue);
    }, duration / steps);
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Service worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}