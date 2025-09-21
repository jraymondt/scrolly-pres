// Enhanced Parallax Scrolling JavaScript with Performance Optimizations
class ParallaxController {
    constructor() {
        this.scrollY = 0;
        this.ticking = false;
        this.isVisible = true;
        this.parallaxElements = [];
        
        this.init();
        this.bindEvents();
    }

    init() {
        // Initialize parallax elements with different speeds and effects
        this.parallaxElements = [
            // Background stars - slowest movement for depth
            {
                element: document.querySelector('.stars1'),
                speed: 0.1,
                type: 'translateY',
                direction: 1
            },
            {
                element: document.querySelector('.stars2'),
                speed: 0.2,
                type: 'translateY',
                direction: -1
            },
            {
                element: document.querySelector('.stars3'),
                speed: 0.15,
                type: 'translateY',
                direction: 1
            },
            {
                element: document.querySelector('.twinkling'),
                speed: 0.3,
                type: 'translateY',
                direction: 1
            },
            {
                element: document.querySelector('.nebula'),
                speed: 0.25,
                type: 'translateY',
                direction: -1
            },
            // Header content - medium speed
            {
                element: document.querySelector('.header-content'),
                speed: 0.5,
                type: 'translateY',
                direction: 1,
                fade: true
            }
        ];

        // Add section elements with different parallax speeds
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            const divs = section.querySelectorAll('div');
            divs.forEach((div, divIndex) => {
                this.parallaxElements.push({
                    element: div,
                    speed: 0.1 + (divIndex * 0.1), // Varying speeds for depth
                    type: 'translateY',
                    direction: index % 2 === 0 ? 1 : -1,
                    threshold: section.offsetTop - window.innerHeight,
                    maxOffset: section.offsetTop + section.offsetHeight
                });
            });

            // Special handling for images
            const images = section.querySelectorAll('img');
            images.forEach(img => {
                this.parallaxElements.push({
                    element: img,
                    speed: 0.3,
                    type: 'both', // Both translate and scale
                    direction: 1,
                    threshold: section.offsetTop - window.innerHeight,
                    maxOffset: section.offsetTop + section.offsetHeight
                });
            });
        });

        // Filter out null elements
        this.parallaxElements = this.parallaxElements.filter(item => item.element !== null);
    }

    updateElements() {
        const scrollPercent = this.scrollY / (document.body.scrollHeight - window.innerHeight);
        
        this.parallaxElements.forEach(item => {
            if (!item.element) return;

            const { element, speed, type, direction, fade, threshold, maxOffset } = item;
            
            // Check if element is in viewport range
            if (threshold && maxOffset) {
                if (this.scrollY < threshold || this.scrollY > maxOffset) {
                    return; // Skip elements outside their active range
                }
            }

            const offset = this.scrollY * speed * direction;
            
            let transform = '';
            
            switch (type) {
                case 'translateY':
                    transform = `translateY(${offset}px)`;
                    break;
                case 'translateX':
                    transform = `translateX(${offset}px)`;
                    break;
                case 'both':
                    const scale = 1 + (scrollPercent * 0.1);
                    transform = `translateY(${offset}px) scale(${Math.min(scale, 1.2)})`;
                    break;
                case 'rotate':
                    transform = `rotate(${offset * 0.1}deg)`;
                    break;
                default:
                    transform = `translateY(${offset}px)`;
            }
            
            element.style.transform = transform;
            
            // Add fade effect if specified
            if (fade) {
                const opacity = Math.max(0, 1 - scrollPercent * 2);
                element.style.opacity = opacity;
            }
        });
    }

    handleScroll() {
        this.scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        if (!this.ticking && this.isVisible) {
            requestAnimationFrame(() => {
                this.updateElements();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    handleVisibilityChange() {
        this.isVisible = document.visibilityState === 'visible';
        if (this.isVisible) {
            this.handleScroll(); // Update when tab becomes visible
        }
    }

    handleResize() {
        // Debounced resize handler
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.init(); // Re-initialize elements after resize
            this.handleScroll(); // Update positions
        }, 250);
    }

    bindEvents() {
        // Optimized scroll event handling
        let lastScrollTime = 0;
        const scrollHandler = () => {
            const now = performance.now();
            if (now - lastScrollTime > 16) { // Throttle to ~60fps
                this.handleScroll();
                lastScrollTime = now;
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
        window.addEventListener('resize', () => this.handleResize(), { passive: true });
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // Handle reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            this.parallaxElements.forEach(item => {
                if (item.element) {
                    item.speed *= 0.1; // Drastically reduce parallax speed
                }
            });
        }
    }
}

// Additional utility functions for enhanced effects
class DepthOfFieldController {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        // Add depth of field blur effect to background elements
        const backgroundElements = [
            { selector: '.stars1', maxBlur: 2, distance: 1 },
            { selector: '.stars2', maxBlur: 1, distance: 0.8 },
            { selector: '.stars3', maxBlur: 3, distance: 1.2 },
            { selector: '.nebula', maxBlur: 4, distance: 1.5 }
        ];

        backgroundElements.forEach(config => {
            const element = document.querySelector(config.selector);
            if (element) {
                this.elements.push({
                    element,
                    maxBlur: config.maxBlur,
                    distance: config.distance
                });
            }
        });
    }

    updateDepth(scrollPercent) {
        this.elements.forEach(({ element, maxBlur, distance }) => {
            const blur = Math.min(maxBlur * scrollPercent * distance, maxBlur);
            element.style.filter = `blur(${blur}px)`;
        });
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
    }

    measureFPS() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Adjust quality based on performance
            if (this.fps < 30) {
                console.warn('Low FPS detected, consider reducing parallax complexity');
            }
        }
        
        requestAnimationFrame(() => this.measureFPS());
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check for browser support
    if (!window.requestAnimationFrame) {
        console.warn('requestAnimationFrame not supported, parallax effects may be choppy');
        return;
    }

    // Initialize controllers
    const parallax = new ParallaxController();
    const depthOfField = new DepthOfFieldController();
    
    // Optional performance monitoring (remove in production)
    if (typeof console !== 'undefined' && console.log) {
        const perfMonitor = new PerformanceMonitor();
        perfMonitor.measureFPS();
    }

    // Enhanced scroll handler that includes depth of field
    let lastScrollY = 0;
    const enhancedScrollHandler = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = scrollY / (document.body.scrollHeight - window.innerHeight);
        
        // Update depth of field based on scroll
        depthOfField.updateDepth(scrollPercent);
        
        lastScrollY = scrollY;
    };

    window.addEventListener('scroll', enhancedScrollHandler, { passive: true });

    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    console.log('Parallax scrolling initialized successfully!');
});