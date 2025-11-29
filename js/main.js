// Main application functionality
class WarMedicineApp {
    constructor() {
        this.sections = [];
        this.currentSection = null;
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.initAnimations();
        this.loadData();
    }

    cacheElements() {
        this.sections = document.querySelectorAll('section');
        this.navLinks = document.querySelectorAll('a[href^="#"]');
    }

    bindEvents() {
        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Intersection Observer for section tracking
        this.initIntersectionObserver();

        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
    }

    scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    initIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.currentSection = entry.target.id;
                        this.onSectionEnter(entry.target);
                    }
                });
            },
            { 
                threshold: 0.3,
                rootMargin: '-10% 0px -10% 0px'
            }
        );

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    onSectionEnter(section) {
        // Add active class to current section
        this.sections.forEach(s => s.classList.remove('active'));
        section.classList.add('active');

        // Trigger section-specific animations
        this.triggerSectionAnimations(section.id);
    }

    triggerSectionAnimations(sectionId) {
        switch(sectionId) {
            case 'scale':
                this.animateCounters('.scale-section .stat-number');
                break;
            case 'map':
                this.animateMap();
                break;
            case 'journey':
                this.animateJourney();
                break;
            // Add more cases for other sections
        }
    }

    animateCounters(selector) {
        const counters = document.querySelectorAll(selector);
        counters.forEach(counter => {
            if (!counter.classList.contains('animated')) {
                this.animateCounter(counter);
                counter.classList.add('animated');
            }
        });
    }

    animateCounter(element, duration = 2000) {
        const target = parseInt(element.dataset.target);
        const isPercentage = target < 100;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                if (isPercentage) {
                    element.textContent = target + '%';
                } else if (target > 1000000) {
                    element.textContent = (target / 1000000).toFixed(1) + 'M';
                } else {
                    element.textContent = target.toLocaleString();
                }
                clearInterval(timer);
            } else {
                if (isPercentage) {
                    element.textContent = Math.floor(current) + '%';
                } else if (target > 1000000) {
                    element.textContent = Math.floor(current / 1000000) + 'M';
                } else {
                    element.textContent = Math.floor(current).toLocaleString();
                }
            }
        }, 16);
    }

    loadData() {
        // Load additional data if needed
        fetch('./assets/data/fronts-data.json')
            .then(response => response.json())
            .then(data => {
                window.frontsData = data;
                this.onDataLoaded(data);
            })
            .catch(error => {
                console.warn('Could not load fronts data:', error);
            });
    }

    onDataLoaded(data) {
        // Initialize components that depend on data
        if (typeof window.initTable === 'function') {
            window.initTable(data);
        }
    }

    handleScroll() {
        // Throttled scroll handling can be added here
    }

    handleResize() {
        // Handle responsive behavior
    }

    animateMap() {
        // Map-specific animations
        console.log('Animating map section');
    }

    animateJourney() {
        // Journey-specific animations
        console.log('Animating journey section');
    }
}

// Global utility functions
function scrollToSection(sectionId) {
    window.app.scrollToSection(sectionId);
}

function shareProject() {
    const shareText = 'Цена Победы: Раненый Солдат - интерактивный проект о подвиге военных медиков в Великой Отечественной войне';
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Цена Победы: Раненый Солдат',
            text: shareText,
            url: shareUrl,
        }).catch(() => {
            fallbackShare(shareUrl);
        });
    } else {
        fallbackShare(shareUrl);
    }
}

function fallbackShare(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('Ссылка скопирована в буфер обмена! Поделитесь ею с друзьями.');
    }).catch(() => {
        // Fallback for older browsers
        prompt('Скопируйте эту ссылку чтобы поделиться:', url);
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.app = new WarMedicineApp();
    
    // Initialize hero section counters
    const heroCounters = document.querySelectorAll('.hero-section .stat-number');
    heroCounters.forEach(counter => {
        window.app.animateCounter(counter, 2500);
    });
});