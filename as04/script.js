document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbar = document.querySelector('.navbar');
    const imageWrappers = document.querySelectorAll('.image-content-wrapper');

    // Function to check which image should be visible
    function updateVisibleImages() {
        const scrollPos = window.scrollY;
        const navbarHeight = navbar.offsetHeight;

        imageWrappers.forEach((wrapper, index) => {
            const section = wrapper.parentElement;
            const sectionTop = section.offsetTop - navbarHeight;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            // Add visible class when section is in view
            if (scrollPos >= sectionTop - 100 && scrollPos < sectionBottom) {
                wrapper.classList.add('visible');
            } else {
                wrapper.classList.remove('visible');
            }
        });
    }

    // Initial check
    updateVisibleImages();

    // Update on scroll
    window.addEventListener('scroll', updateVisibleImages);

    // Navigation smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });

                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarToggler && !navbarToggler.classList.contains('collapsed')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
                    bsCollapse.hide();
                }
            }
        });
    });
});