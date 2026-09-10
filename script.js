/* ============================================
   ROMANTIC BIRTHDAY WEBSITE - SCRIPT.JS
   All interactive features & animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== CONFIGURATION =====
    const CONFIG = {
        name: "OKSANA KHOIRUNNIDA",        // Nama tercinta
        date: "~ 10 September 2026 ~",     // Tanggal ulang tahun
        // Tanggal mulai bersama (20 Agustus 2022, 20:00 WIB)
        togetherSince: new Date('2022-08-20T20:00:00'),
    };

    // Apply config
    const nameEl = document.getElementById('birthday-name');
    const dateEl = document.getElementById('birthday-date');
    if (nameEl) nameEl.textContent = CONFIG.name;
    if (dateEl) dateEl.textContent = CONFIG.date;


    // ===== OPENING ENVELOPE =====
    const openBtn = document.getElementById('open-btn');
    const openingSection = document.getElementById('opening');
    const mainContent = document.getElementById('main-content');

    openBtn.addEventListener('click', () => {
        openingSection.classList.add('fade-out');
        setTimeout(() => {
            openingSection.style.display = 'none';
            mainContent.classList.remove('hidden');
            mainContent.style.opacity = '0';
            requestAnimationFrame(() => {
                mainContent.style.opacity = '1';
            });
            initPetals();
            initSparkles();
            initScrollReveal();
            initFlowerInteractions();
            initPolaroidGallery();
            startCountdown();
        }, 800);
    });


    // ===== BACKGROUND MUSIC =====
    const musicBtn = document.getElementById('music-btn');
    const musicText = musicBtn.querySelector('.music-text');
    let audioContext = null;
    let isPlaying = false;
    let audioElement = null;

    // Create a romantic melody using Web Audio API
    function createMelody() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const notes = [
            // "Happy Birthday" melody - simplified romantic version
            { freq: 264, dur: 0.4 },  // C
            { freq: 264, dur: 0.2 },  // C
            { freq: 297, dur: 0.6 },  // D
            { freq: 264, dur: 0.6 },  // C
            { freq: 352, dur: 0.6 },  // F
            { freq: 330, dur: 1.0 },  // E
            
            { freq: 264, dur: 0.4 },  // C
            { freq: 264, dur: 0.2 },  // C
            { freq: 297, dur: 0.6 },  // D
            { freq: 264, dur: 0.6 },  // C
            { freq: 396, dur: 0.6 },  // G
            { freq: 352, dur: 1.0 },  // F
            
            { freq: 264, dur: 0.4 },  // C
            { freq: 264, dur: 0.2 },  // C
            { freq: 528, dur: 0.6 },  // C5
            { freq: 440, dur: 0.6 },  // A
            { freq: 352, dur: 0.6 },  // F
            { freq: 330, dur: 0.6 },  // E
            { freq: 297, dur: 0.8 },  // D
            
            { freq: 466, dur: 0.4 },  // Bb
            { freq: 466, dur: 0.2 },  // Bb
            { freq: 440, dur: 0.6 },  // A
            { freq: 352, dur: 0.6 },  // F
            { freq: 396, dur: 0.6 },  // G
            { freq: 352, dur: 1.2 },  // F
        ];

        let time = audioContext.currentTime + 0.1;
        const totalDuration = notes.reduce((sum, n) => sum + n.dur, 0);

        function playSequence(startTime) {
            let t = startTime;
            notes.forEach(note => {
                // Main oscillator (sine - soft)
                const osc1 = audioContext.createOscillator();
                const gain1 = audioContext.createGain();
                osc1.type = 'sine';
                osc1.frequency.value = note.freq;
                gain1.gain.setValueAtTime(0, t);
                gain1.gain.linearRampToValueAtTime(0.12, t + 0.05);
                gain1.gain.exponentialRampToValueAtTime(0.001, t + note.dur - 0.02);
                osc1.connect(gain1);
                gain1.connect(audioContext.destination);
                osc1.start(t);
                osc1.stop(t + note.dur);

                // Harmony (triangle - warm)
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.type = 'triangle';
                osc2.frequency.value = note.freq * 1.5; // perfect fifth
                gain2.gain.setValueAtTime(0, t);
                gain2.gain.linearRampToValueAtTime(0.04, t + 0.05);
                gain2.gain.exponentialRampToValueAtTime(0.001, t + note.dur - 0.02);
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.start(t);
                osc2.stop(t + note.dur);

                t += note.dur;
            });
            return t;
        }

        // Play the melody 3 times with gaps
        let currentTime = time;
        for (let i = 0; i < 3; i++) {
            currentTime = playSequence(currentTime);
            currentTime += 1.5; // gap between repeats
        }

        // Stop after all repeats
        setTimeout(() => {
            if (isPlaying) {
                isPlaying = false;
                musicBtn.classList.remove('playing');
                musicText.textContent = 'Play Music';
            }
        }, (totalDuration * 3 + 4.5) * 1000);
    }

    musicBtn.addEventListener('click', () => {
        if (!isPlaying) {
            createMelody();
            isPlaying = true;
            musicBtn.classList.add('playing');
            musicText.textContent = 'Playing...';
        } else {
            if (audioContext) {
                audioContext.close();
                audioContext = null;
            }
            isPlaying = false;
            musicBtn.classList.remove('playing');
            musicText.textContent = 'Play Music';
        }
    });


    // ===== FALLING PETALS =====
    function initPetals() {
        const container = document.getElementById('petals-container');
        const petalSymbols = ['🌸', '🩷', '💮', '🌺', '✿', '❀', '🏵️', '💗'];
        
        function createPetal() {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
            
            const size = Math.random() * 20 + 14;
            const startX = Math.random() * 100;
            const drift = (Math.random() - 0.5) * 200;
            const duration = Math.random() * 6 + 6;
            const spin = Math.random() * 720 - 360;
            
            petal.style.cssText = `
                left: ${startX}%;
                font-size: ${size}px;
                --drift: ${drift}px;
                --spin: ${spin}deg;
                animation-duration: ${duration}s;
                animation-delay: 0s;
            `;
            
            container.appendChild(petal);
            
            setTimeout(() => {
                petal.remove();
            }, duration * 1000);
        }

        // Create petals periodically
        setInterval(createPetal, 400);
        // Create initial batch
        for (let i = 0; i < 8; i++) {
            setTimeout(createPetal, i * 200);
        }
    }


    // ===== SPARKLE PARTICLES =====
    function initSparkles() {
        const canvas = document.getElementById('sparkle-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.6 + 0.2;
                this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
                this.hue = Math.random() * 40 + 330; // pink-ish hues
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.fadeDirection * 0.005;
                if (this.opacity <= 0.1 || this.opacity >= 0.8) {
                    this.fadeDirection *= -1;
                }
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 80%, 75%, ${this.opacity})`;
                ctx.fill();
                // Glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 80%, 75%, ${this.opacity * 0.2})`;
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < 60; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }


    // ===== SCROLL REVEAL =====
    function initScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.letter-card, .flower-stage, .polaroid-card, .cake-wrapper, .wish-card, .countdown-card'
        );
        
        revealElements.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }


    // ===== AESTHETIC LINE-ART FLOWER INTERACTIONS =====
    function initFlowerInteractions() {
        const roseSvg = document.getElementById('rose-svg');
        const rebloomBtn = document.getElementById('rebloom-btn');
        const flowerWrapper = document.getElementById('flower-svg-wrapper');
        const flowerStage = document.querySelector('.flower-stage');
        let isAnimating = false;

        function triggerBloom() {
            if (isAnimating || !roseSvg) return;
            isAnimating = true;

            // Reset SVG stroke animations by toggling class
            roseSvg.classList.add('is-reblooming');
            void roseSvg.offsetWidth; // Trigger DOM reflow
            roseSvg.classList.remove('is-reblooming');

            // Burst fairy dust sparkles around flower
            burstFlowerSparkles();

            // Re-enable after animation
            setTimeout(() => {
                isAnimating = false;
            }, 3000);
        }

        // Click on re-bloom button or flower itself
        if (rebloomBtn) {
            rebloomBtn.addEventListener('click', triggerBloom);
        }
        if (flowerWrapper) {
            flowerWrapper.addEventListener('click', triggerBloom);
        }

        // Trigger bloom automatically when scrolled into view
        if (flowerStage) {
            let hasBloomedOnce = false;
            const flowerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasBloomedOnce) {
                        hasBloomedOnce = true;
                        triggerBloom();
                    }
                });
            }, { threshold: 0.3 });
            flowerObserver.observe(flowerStage);
        }

        // Fairy dust sparkle burst
        function burstFlowerSparkles() {
            if (!flowerWrapper) return;
            const rect = flowerWrapper.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height * 0.45;

            const icons = ['✨', '🌸', '💫', '💖', '💮', '⭐'];
            for (let i = 0; i < 24; i++) {
                setTimeout(() => {
                    const spark = document.createElement('div');
                    spark.textContent = icons[Math.floor(Math.random() * icons.length)];
                    spark.style.cssText = `
                        position: fixed;
                        left: ${centerX}px;
                        top: ${centerY}px;
                        font-size: ${Math.random() * 16 + 12}px;
                        pointer-events: none;
                        z-index: 9999;
                        opacity: 1;
                        transition: all ${Math.random() * 1.2 + 0.8}s cubic-bezier(0.2, 0.8, 0.3, 1);
                        transform: translate(-50%, -50%) scale(0.5);
                    `;
                    document.body.appendChild(spark);

                    const angle = Math.random() * Math.PI * 2;
                    const dist = Math.random() * 140 + 50;
                    const targetX = Math.cos(angle) * dist;
                    const targetY = Math.sin(angle) * dist - 30;

                    requestAnimationFrame(() => {
                        spark.style.opacity = '0';
                        spark.style.transform = `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(${Math.random() * 0.8 + 0.8}) rotate(${Math.random() * 360}deg)`;
                    });

                    setTimeout(() => spark.remove(), 2000);
                }, i * 35);
            }
        }
    }


    // ===== POLAROID SCRAPBOOK GALLERY & LIGHTBOX =====
    function initPolaroidGallery() {
        const GALLERY_ITEMS = [
            {
                src: 'images/1.jpeg',
                title: 'Senyum Terindah',
                desc: 'Senyum manismu yang selalu meluluhkan hatiku dan menjadi alasan terbesarku bahagia setiap hari 💕',
                tag: '#MyFavoriteSmile'
            },
            {
                src: 'images/2.jpeg',
                title: 'Selalu Bersamamu',
                desc: 'Setiap detik yang kita lalui bersama selalu terasa begitu berharga dan penuh arti 💑',
                tag: '#TogetherForever'
            },
            {
                src: 'images/3.jpeg',
                title: 'Tatapan Paling Hangat',
                desc: 'Tatapan matamu adalah tempat ternyaman dan terindah di dunia tempat hatiku ingin selalu pulang 🌟',
                tag: '#MySafeHaven'
            },
            {
                src: 'images/4.jpeg',
                title: 'Momen Bahagia Kita',
                desc: 'Melangkah bergandengan tangan denganmu adalah hal terbaik yang pernah terjadi dalam hidupku ✨',
                tag: '#HappyMoments'
            },
            {
                src: 'images/5.jpeg',
                title: 'Cinta Abadi',
                desc: 'Cintaku padamu takkan pernah berkurang sedikit pun, hari ini, esok, dan sampai selamanya 💍',
                tag: '#EndlessLove'
            }
        ];

        let currentIndex = 0;
        let loveCount = 99;

        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDesc = document.getElementById('lightbox-desc');
        const lightboxCounter = document.getElementById('lightbox-counter');
        const lightboxTag = document.getElementById('lightbox-tag');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxBackdrop = document.getElementById('lightbox-backdrop');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        const lightboxLoveBtn = document.getElementById('lightbox-love-btn');
        const lightboxLoveCount = document.getElementById('lightbox-love-count');

        function updateLightbox(index) {
            currentIndex = (index + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
            const item = GALLERY_ITEMS[currentIndex];

            if (lightboxImg) {
                lightboxImg.style.opacity = '0';
                setTimeout(() => {
                    lightboxImg.src = item.src;
                    lightboxImg.style.opacity = '1';
                }, 150);
            }
            if (lightboxTitle) lightboxTitle.textContent = item.title;
            if (lightboxDesc) lightboxDesc.textContent = item.desc;
            if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${GALLERY_ITEMS.length}`;
            if (lightboxTag) lightboxTag.textContent = item.tag;
        }

        function openLightbox(index) {
            updateLightbox(index);
            if (lightbox) {
                lightbox.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent scroll while in modal
            }
        }

        function closeLightbox() {
            if (lightbox) {
                lightbox.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }

        // Attach click listeners to polaroid cards
        document.querySelectorAll('.polaroid-card').forEach((card, idx) => {
            card.addEventListener('click', () => {
                const cardIdx = parseInt(card.getAttribute('data-index')) || idx;
                openLightbox(cardIdx);
            });
        });

        // Navigation buttons
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', () => updateLightbox(currentIndex - 1));
        if (lightboxNext) lightboxNext.addEventListener('click', () => updateLightbox(currentIndex + 1));

        // Keyboard arrows & escape
        document.addEventListener('keydown', (e) => {
            if (!lightbox || lightbox.classList.contains('hidden')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') updateLightbox(currentIndex - 1);
            if (e.key === 'ArrowRight') updateLightbox(currentIndex + 1);
        });

        // Love reaction button in lightbox
        if (lightboxLoveBtn) {
            lightboxLoveBtn.addEventListener('click', (e) => {
                loveCount++;
                if (lightboxLoveCount) lightboxLoveCount.textContent = loveCount + '+';

                // Heart particle burst
                const rect = lightboxLoveBtn.getBoundingClientRect();
                const heartIcons = ['❤️', '💖', '💗', '💕', '🥰', '✨'];
                for (let i = 0; i < 8; i++) {
                    const heart = document.createElement('div');
                    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
                    heart.style.cssText = `
                        position: fixed;
                        left: ${rect.left + rect.width / 2}px;
                        top: ${rect.top + rect.height / 2}px;
                        font-size: ${Math.random() * 14 + 16}px;
                        pointer-events: none;
                        z-index: 9999;
                        opacity: 1;
                        transition: all 0.9s cubic-bezier(0.2, 0.8, 0.3, 1);
                        transform: translate(-50%, -50%);
                    `;
                    document.body.appendChild(heart);

                    const offsetX = (Math.random() - 0.5) * 120;
                    const offsetY = -(Math.random() * 90 + 40);

                    requestAnimationFrame(() => {
                        heart.style.opacity = '0';
                        heart.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(1.4)`;
                    });

                    setTimeout(() => heart.remove(), 1000);
                }
            });
        }
    }


    // ===== COUNTDOWN (Time Together) =====
    function startCountdown() {
        function updateCountdown() {
            const now = new Date();
            const diff = now - CONFIG.togetherSince;

            if (diff < 0) {
                // If togetherSince is in the future, show countdown to it
                const absDiff = Math.abs(diff);
                const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((absDiff / (1000 * 60)) % 60);
                const seconds = Math.floor((absDiff / 1000) % 60);

                document.getElementById('cd-days').textContent = days;
                document.getElementById('cd-hours').textContent = hours;
                document.getElementById('cd-minutes').textContent = minutes;
                document.getElementById('cd-seconds').textContent = seconds;
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);

                document.getElementById('cd-days').textContent = days;
                document.getElementById('cd-hours').textContent = hours;
                document.getElementById('cd-minutes').textContent = minutes;
                document.getElementById('cd-seconds').textContent = seconds;
            }
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }


    // ===== PARALLAX EFFECT ON HERO =====
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero-bg-img');
        if (hero) {
            const scrollY = window.scrollY;
            hero.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
        }
    });


    // ===== MOUSE TRAIL HEARTS (subtle) =====
    let lastHeartTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastHeartTime < 150) return;
        lastHeartTime = now;

        const heart = document.createElement('div');
        heart.textContent = ['💕', '💗', '✨', '💖'][Math.floor(Math.random() * 4)];
        heart.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            pointer-events: none;
            z-index: 9999;
            font-size: ${Math.random() * 12 + 10}px;
            opacity: 1;
            transition: all 1s ease;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(heart);

        requestAnimationFrame(() => {
            heart.style.opacity = '0';
            heart.style.transform = `translate(-50%, -50%) translateY(-40px) scale(0.3)`;
        });

        setTimeout(() => heart.remove(), 1000);
    });


    // ===== CONFETTI BURST ON CAKE SECTION =====
    const cakeSection = document.getElementById('cake');
    let confettiFired = false;

    const cakeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !confettiFired) {
                confettiFired = true;
                fireConfetti();
            }
        });
    }, { threshold: 0.5 });

    if (cakeSection) cakeObserver.observe(cakeSection);

    function fireConfetti() {
        const emojis = ['🎉', '🎊', '🥳', '🎈', '🎁', '🎂', '✨', '💖', '🌟'];
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                const startX = 50 + (Math.random() - 0.5) * 40;
                const endX = startX + (Math.random() - 0.5) * 60;
                confetti.style.cssText = `
                    position: fixed;
                    left: ${startX}%;
                    top: 40%;
                    font-size: ${Math.random() * 20 + 16}px;
                    pointer-events: none;
                    z-index: 9999;
                    opacity: 1;
                    transition: all ${Math.random() * 1.5 + 1}s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    transform: translateY(0) rotate(0deg);
                `;
                document.body.appendChild(confetti);

                requestAnimationFrame(() => {
                    confetti.style.opacity = '0';
                    confetti.style.transform = `
                        translateY(${Math.random() * 400 - 300}px) 
                        translateX(${(Math.random() - 0.5) * 300}px) 
                        rotate(${Math.random() * 720}deg)
                        scale(${Math.random() * 0.5 + 0.3})
                    `;
                    confetti.style.left = `${endX}%`;
                });

                setTimeout(() => confetti.remove(), 2500);
            }, i * 60);
        }
    }

});
