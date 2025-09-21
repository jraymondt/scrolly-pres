        // Simple but effective parallax controller
        class SimpleParallaxController {
            constructor() {
                this.scrollY = 0;
                this.ticking = false;
                this.elements = this.initElements();
                this.bindEvents();
            }

            initElements() {
                return [
                    // Background layers with different speeds for depth
                    { el: document.querySelector('.stars1'), speed: 0.1, blur: false },
                    { el: document.querySelector('.stars2'), speed: 0.15, blur: false },
                    { el: document.querySelector('.stars3'), speed: 0.08, blur: true },
                    { el: document.querySelector('.twinkling'), speed: 0.25, blur: false },
                    { el: document.querySelector('.nebula'), speed: 0.12, blur: true },
                    
                    // Header content
                    { el: document.querySelector('.header-content'), speed: 0.4, fade: true },
                    
                    // Section elements
                    ...Array.from(document.querySelectorAll('section > div')).map((div, index) => ({
                        el: div,
                        speed: 0.05 + (index * 0.02),
                        direction: index % 2 === 0 ? 1 : -1
                    })),
                    
                    // Images get special treatment
                    ...Array.from(document.querySelectorAll('section img')).map(img => ({
                        el: img,
                        speed: 0.2,
                        scale: true
                    }))
                ].filter(item => item.el); // Remove null elements
            }

            updateElements() {
                const scrollPercent = Math.min(this.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
                
                this.elements.forEach(({ el, speed, direction = 1, fade, blur, scale }) => {
                    const offset = this.scrollY * speed * direction;
                    
                    // Base transform
                    let transform = `translateY(${offset}px)`;
                    
                    // Add scaling for images
                    if (scale) {
                        const scaleValue = 1 + (scrollPercent * 0.05);
                        transform += ` scale(${Math.min(scaleValue, 1.1)})`;
                    }
                    
                    el.style.transform = transform;
                    
                    // Fade effect for header
                    if (fade) {
                        el.style.opacity = Math.max(0.2, 1 - scrollPercent * 1.5);
                    }
                    
                    // Depth of field blur
                    if (blur) {
                        const blurAmount = Math.min(scrollPercent * 3, 2);
                        el.style.filter = `blur(${blurAmount}px)`;
                    }
                });
            }

            handleScroll() {
                this.scrollY = window.pageYOffset;
                
                if (!this.ticking) {
                    requestAnimationFrame(() => {
                        this.updateElements();
                        this.ticking = false;
                    });
                    this.ticking = true;
                }
            }

            bindEvents() {
                // Throttled scroll handler
                let lastTime = 0;
                const throttledScroll = () => {
                    const now = performance.now();
                    if (now - lastTime > 16) { // ~60fps
                        this.handleScroll();
                        lastTime = now;
                    }
                };

                window.addEventListener('scroll', throttledScroll, { passive: true });
                
                // Handle visibility change for performance
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible') {
                        this.handleScroll();
                    }
                });

                // Respect reduced motion preference
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    this.elements.forEach(item => item.speed *= 0.1);
                }
            }
        }

        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            new SimpleParallaxController();
            console.log('Simple parallax scrolling with depth of field initialized!');
        });