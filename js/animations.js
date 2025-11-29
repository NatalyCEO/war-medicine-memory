// Advanced animations and transitions
class AnimationManager {
    constructor() {
        this.animatedElements = new Set();
        this.intersectionObserver = null;
        this.init();
    }

    init() {
        this.initIntersectionObserver();
        this.initScrollAnimations();
    }

    initIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateOnScroll(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '-50px 0px -50px 0px'
            }
        );
    }

    observeElement(element) {
        this.intersectionObserver.observe(element);
        this.animatedElements.add(element);
    }

    animateOnScroll(element) {
        if (element.classList.contains('animated')) return;

        const animationType = element.dataset.animation || 'fadeUp';
        const delay = parseInt(element.dataset.delay) || 0;

        setTimeout(() => {
            element.classList.add('animated', animationType);
            
            // Remove animation class after completion for potential re-use
            if (element.dataset.animateOnce !== 'false') {
                setTimeout(() => {
                    element.classList.remove(animationType);
                }, 1000);
            }
        }, delay);
    }

    initScrollAnimations() {
        // Observe all elements with data-animation attribute
        document.querySelectorAll('[data-animation]').forEach(element => {
            this.observeElement(element);
        });

        // Observe journey steps
        document.querySelectorAll('.journey-step').forEach((step, index) => {
            step.dataset.animation = 'fadeInLeft';
            step.dataset.delay = index * 200;
            this.observeElement(step);
        });

        // Observe front cards
        document.querySelectorAll('.front-card').forEach((card, index) => {
            card.dataset.animation = 'fadeUp';
            card.dataset.delay = index * 100;
            this.observeElement(card);
        });

        // Observe stat cards
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            card.dataset.animation = 'fadeUp';
            card.dataset.delay = index * 150;
            this.observeElement(card);
        });
    }

    // Parallax effects
    initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // Counter animations
    animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const change = end - start;

        function updateValue(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = start + change * easeOutQuart;

            element.textContent = Math.floor(currentValue).toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateValue);
            } else {
                element.textContent = end.toLocaleString();
            }
        }

        requestAnimationFrame(updateValue);
    }
}

// CSS animation classes
const animationStyles = `
@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(100%);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animated {
    animation-fill-mode: both;
}

.fadeUp {
    animation: fadeUp 0.6s ease-out;
}

.fadeInLeft {
    animation: fadeInLeft 0.6s ease-out;
}

.fadeInRight {
    animation: fadeInRight 0.6s ease-out;
}

.scaleIn {
    animation: scaleIn 0.5s ease-out;
}

.slideInUp {
    animation: slideInUp 0.6s ease-out;
}
`;

// Add animation styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize animation manager
document.addEventListener('DOMContentLoaded', function() {
    window.animationManager = new AnimationManager();
});