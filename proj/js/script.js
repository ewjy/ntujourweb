document.addEventListener('DOMContentLoaded', () => {
    // Random Header Background Collage
    const headerBgContainer = document.getElementById('header-bg-container');
    if (headerBgContainer) {
        const totalImages = 51; // Total number of images in ch0_banner
        // Duplicate the images multiple times to ensure we fill the screen and more
        const numberOfSets = 4; 
        
        // Create an array of indices [1, 2, ..., 51]
        let indices = [];
        for (let s = 0; s < numberOfSets; s++) {
            const set = Array.from({ length: totalImages }, (_, i) => i + 1);
            indices = indices.concat(set);
        }

        // Shuffle the array (Fisher-Yates shuffle)
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // Select all indices (now duplicated)
        const selectedIndices = indices;

        // Append images to the container
        selectedIndices.forEach(index => {
            const img = document.createElement('img');
            img.src = `img/ch0_banner/ch0_banner_${index}.jpg`;
            img.alt = ""; // Decorative
            headerBgContainer.appendChild(img);
        });
    }

    const horizontalSections = document.querySelectorAll('.horizontal-scroll');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        horizontalSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const track = section.querySelector('.horizontal-track');
            
            // Calculate how far we've scrolled into the section
            // We want the animation to start when the section hits the top of the viewport
            // and end when the bottom of the section hits the bottom of the viewport (or top, depending on sticky behavior)
            
            // Since the wrapper is sticky top:0, it stays fixed while we scroll through the sectionHeight.
            // The scrollable distance is sectionHeight - viewportHeight.
            
            const scrollDistance = sectionHeight - viewportHeight;
            let scrollTopInSection = scrollY - sectionTop;
            
            // Clamp the value
            if (scrollTopInSection < 0) scrollTopInSection = 0;
            if (scrollTopInSection > scrollDistance) scrollTopInSection = scrollDistance;

            // Calculate percentage
            const scrollPercentage = scrollTopInSection / scrollDistance;

            // Calculate horizontal move
            // We want to move the track to the left, so negative translateX
            // Max move is track.scrollWidth - viewportWidth
            const maxTranslate = track.scrollWidth - window.innerWidth;
            const translateX = -1 * scrollPercentage * maxTranslate;

            // Apply transform
            track.style.transform = `translateX(${translateX}px)`;
        });
    });

    // Optional: Resize observer to handle window resizing
    window.addEventListener('resize', () => {
        // Trigger scroll event to update positions
        window.dispatchEvent(new Event('scroll'));
    });
});
