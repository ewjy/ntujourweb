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

        // Crossfade backgrounds between sec-1-2 and sec-2-1
        const s12Bg = document.querySelector('#sec-1-2 .background-visual');
        const s21Bg = document.querySelector('#sec-2-1 .background-visual');
        const s21Section = document.getElementById('sec-2-1');
        if (s12Bg && s21Bg && s21Section) {
            const rect = s21Section.getBoundingClientRect();
            const vh = window.innerHeight;
            // progress = 0 when sec-2-1 is just below the viewport (top at vh)
            // progress = 1 when sec-2-1 reaches the top of the viewport (top at 0)
            let progress = 1 - (rect.top / vh);
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            const minOverlayOpacity = 0.2; // keep a floor so the header collage never shows through
            const s12Opacity = 1 - progress * (1 - minOverlayOpacity);
            s21Bg.style.opacity = progress.toString();
            s12Bg.style.opacity = s12Opacity.toString();
        }

        // Lift sec-2-1 title as sec-2-2 enters
        const s21Title = document.querySelector('#sec-2-1 .overlay-title');
        const s22Section = document.getElementById('sec-2-2');
        if (s21Title && s22Section) {
            const rect = s22Section.getBoundingClientRect();
            const vh = window.innerHeight;
            // progress: 0 when sec-2-2 top is at viewport bottom; 1 when it reaches the top
            let progress = 1 - (rect.top / vh);
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;
            const liftPx = 140; // how far to move up at full progress
            s21Title.style.transform = `translateY(-${liftPx * progress}px)`;
        }
    });

    // Optional: Resize observer to handle window resizing
    window.addEventListener('resize', () => {
        // Trigger scroll event to update positions
        window.dispatchEvent(new Event('scroll'));
    });

    // Before/After parallax wipe effect for sec-3-1
    window.addEventListener('scroll', () => {
        // Fade out header collage when scrolling past sec-0-1
        const headerBg = document.getElementById('header-bg-container');
        const sec01 = document.getElementById('sec-0-1');
        if (headerBg && sec01) {
            const rect = sec01.getBoundingClientRect();
            const sectionHeight = sec01.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            // We want to fade out as we reach the end of sec-0-1
            // rect.bottom is the distance from the viewport top to the bottom of the section
            // When rect.bottom <= viewportHeight, the section is leaving the screen
            
            // Let's start fading out when the bottom of the section is 1 viewport height away from the top
            // i.e., when we are scrolling the last screen of the section.
            
            // Actually, simpler: Fade out based on scroll position relative to section end.
            // When rect.bottom is large (positive), we are seeing the section.
            // When rect.bottom approaches 0 (or viewportHeight), we are leaving it.
            
            // Let's fade out in the last 100vh of the section.
            const fadeStart = viewportHeight * 2; // Start fading when bottom is 2vh away? No.
            
            // Let's use a simple logic:
            // Opacity = 1 when we are at the top.
            // Opacity = 0 when we scroll past the section.
            
            // Calculate how much of the section is left below the viewport top
            // rect.bottom
            
            // If rect.bottom < viewportHeight, we are scrolling out of it.
            // Let's fade out over the last viewportHeight distance.
            
            let opacity = 1;
            if (rect.bottom < viewportHeight) {
                opacity = rect.bottom / viewportHeight;
            }
            
            if (opacity < 0) opacity = 0;
            if (opacity > 1) opacity = 1;
            
            headerBg.style.opacity = opacity;
            
            // Also hide it completely if opacity is 0 to avoid painting
            headerBg.style.visibility = opacity <= 0 ? 'hidden' : 'visible';
        }

        const wipeOverlay = document.getElementById('sec-3-1-wipe');
        const s31Section = document.getElementById('sec-3-1');
        if (wipeOverlay && s31Section) {
            const rect = s31Section.getBoundingClientRect();
            const sectionHeight = s31Section.offsetHeight;
            const viewportHeight = window.innerHeight;
            const scrollDistance = sectionHeight - viewportHeight;
            
            // rect.top is 0 when the section hits the top of the viewport.
            // It becomes negative as we scroll down.
            // We want the wipe to finish relatively quickly, e.g., after scrolling 1 viewport height.
            // This allows the rest of the section (which is taller) to be used for scrolling the content overlay.
            
            const wipeDistance = viewportHeight; // Wipe completes after 100vh of scrolling
            let progress = 0;
            
            // Calculate progress based on how far we've scrolled past the top
            // rect.top is positive before we reach it, 0 at top, negative as we scroll past
            if (rect.top <= 0) {
                progress = Math.abs(rect.top) / wipeDistance;
            }

            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            // Reveal effect: ch2_now is revealed from right to left using clip-path.
            // inset(0 0 0 X%) -> X goes from 100% (fully hidden) to 0% (fully visible)
            const clipValue = 100 - (progress * 100); 
            wipeOverlay.style.clipPath = `inset(0 0 0 ${clipValue}%)`;
        }
    });

    // Initialize positions on load
    window.dispatchEvent(new Event('scroll'));
});
