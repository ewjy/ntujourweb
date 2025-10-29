// 翻卡效果
        function handleFlipCards() {
            const cards = document.querySelectorAll('.flip-card');
            
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const cardTop = rect.top;
                
                // 當卡片進入視窗時顯示
                if (rect.top < windowHeight && rect.bottom > 0) {
                    card.classList.add('active');
                }
                
                // 當卡片頂部到達視窗70%位置時翻轉(即翻到30%時翻開)
                if (cardTop < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3) {
                    card.classList.add('flipped');
                } else {
                    // 當卡片離開這個區域時翻回去
                    card.classList.remove('flipped');
                }
            });
        }

        // Focus Mode 效果
        function handleFocusMode() {
            const chapterContainers = document.querySelectorAll('.chapter-container');
            
            chapterContainers.forEach(container => {
                const section = container.querySelector('.content-section');
                const rect = container.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // 當章節容器底部即將離開畫面時(底部在視窗頂部上方30%處)
                if (rect.bottom < windowHeight * 0.3) {
                    section.classList.add('focus-out');
                } else {
                    section.classList.remove('focus-out');
                }
            });
        }

        // 第三章圖片彩色化效果
        function handleImageColorize() {
            const imageSection = document.querySelector('.image-section');
            const imageWrapper = document.querySelector('.image-wrapper');
            if (!imageWrapper || !imageSection) return;
            
            const rect = imageSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // 當第三章區域進入視窗(頂部在視窗底部以上)
            if (rect.top < windowHeight && rect.bottom > 0) {
                // 計算滾動進度 (0 到 1)
                const scrollProgress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
                
                // 當滾動進度超過 20% 時開始彩色化
                if (scrollProgress > 0.2) {
                    imageWrapper.classList.remove('grayscale');
                    imageWrapper.classList.add('colorized');
                } else {
                    imageWrapper.classList.add('grayscale');
                    imageWrapper.classList.remove('colorized');
                }
            } else {
                // 區域不在視窗中時保持黑白
                imageWrapper.classList.add('grayscale');
                imageWrapper.classList.remove('colorized');
            }
        }

        // 文字底線效果
        function handleTextHighlights() {
            const highlights = document.querySelectorAll('.highlight');
            
            highlights.forEach(highlight => {
                const rect = highlight.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // 當文字進入視窗中間50%區域時顯示底線
                if (rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3) {
                    highlight.classList.add('underlined');
                }
            });
        }

        // 滾動事件監聽
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleFlipCards();
                    handleFocusMode();
                    handleTextHighlights();
                    handleImageColorize();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // 初始化檢查
        handleFlipCards();
        handleFocusMode();
        handleTextHighlights();
        handleImageColorize();