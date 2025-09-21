// Scrollytelling Implementation
class ScrollytellingPresentation {
    constructor() {
        this.scroller = scrollama();
        this.currentStep = 0;
        this.totalSteps = document.querySelectorAll('.step').length;

        this.init();
    }

    init() {
        this.setupScrollama();
        this.setupProgressBar();
        this.addSmoothScrolling();
        this.handleReducedMotion();

        // Initialize first step
        this.activateStep(0);
    }

    setupScrollama() {
        this.scroller
            .setup({
                container: '.scroll-container',
                step: '.step',
                offset: 0.5,
                debug: false
            })
            .onStepEnter(this.handleStepEnter.bind(this))
            .onStepExit(this.handleStepExit.bind(this));
    }

    handleStepEnter(response) {
        const { element, index } = response;
        this.currentStep = index;
        this.activateStep(index);
        this.updateProgressBar();
    }

    handleStepExit(response) {
        const { element, direction } = response;

        if (direction === 'up') {
            this.deactivateStep(element);
        }
    }

    activateStep(stepIndex) {
        // Remove active class from all steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });

        // Add active class to current step
        const currentStep = document.querySelector(`[data-step="${stepIndex}"]`);
        if (currentStep) {
            currentStep.classList.add('active');
        }

        // Animate fade-in elements
        const fadeElements = currentStep?.querySelectorAll('.fade-in');
        fadeElements?.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('active');
            }, index * 200);
        });
    }

    deactivateStep(element) {
        element.classList.remove('active');
        const fadeElements = element.querySelectorAll('.fade-in');
        fadeElements.forEach(el => el.classList.remove('active'));
    }

    setupProgressBar() {
        window.addEventListener('scroll', () => {
            this.updateProgressBar();
        });
    }

    updateProgressBar() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${Math.min(scrollPercent, 100)}%`;
        }
    }

    addSmoothScrolling() {
        // Add smooth scrolling for better UX
        if ('scrollBehavior' in document.documentElement.style) {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    }

    handleReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
            // Disable animations for users who prefer reduced motion
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Resize handler for responsive behavior
    handleResize() {
        this.scroller.resize();
    }
}

// Basic animation styles
const animationStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Inject animation styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);

    // Initialize scrollytelling
    const presentation = new ScrollytellingPresentation();

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            presentation.handleResize();
        }, 250);
    });
});

// Utility function for smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
}