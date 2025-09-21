document.addEventListener('DOMContentLoaded', () => {
  // --- Part 1: Fade-in elements on scroll using IntersectionObserver ---
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // If the element is in the viewport, add the 'visible' class
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // Optional: remove class if you want the effect to repeat
        entry.target.classList.remove('visible');
      }
    });
  }, {
    root: null, // observes intersections relative to the viewport
    threshold: 0.1 // trigger when 10% of the element is visible
  });

  // Observe each element
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  // --- Part 2: Simple Parallax Effect on Scroll ---
  const parallaxElements = document.querySelectorAll('[data-speed]');
  let ticking = false;

  function applyParallax() {
    const scrollTop = window.pageYOffset;

    parallaxElements.forEach(el => {
      // Get the speed from the data-speed attribute
      const speed = parseFloat(el.dataset.speed);
      
      // Calculate the vertical movement
      // A negative value moves the element up as you scroll down
      const yPos = -(scrollTop * speed);

      // Apply the transform using CSS
      el.style.transform = `translateY(${yPos}px)`;
    });
    ticking = false;
  }

  // Use requestAnimationFrame for smooth performance
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  });

  // Apply initial parallax position on load
  applyParallax();
});