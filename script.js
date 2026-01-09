// Z-Index Management
let highestZ = 10;

function bringToFront(element) {
    highestZ++;
    element.style.zIndex = highestZ;

    // Remove active class from all windows
    document.querySelectorAll('.window').forEach(win => win.classList.remove('active'));
    // Add active class to current window
    element.classList.add('active');
}

function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.style.display = 'flex';
    bringToFront(win);

    // Animation reset
    win.style.animation = 'none';
    win.offsetHeight; /* trigger reflow */
    win.style.animation = 'openWindow 0.3s forwards';
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        // Clear previous inline animation to allow CSS class animation to work
        win.style.animation = '';

        // Add closing class to trigger animation
        win.classList.add('closing');

        // Play close sound
        const closeSound = document.getElementById('ui-close-sound');
        if (closeSound) {
            closeSound.currentTime = 0;
            closeSound.play().catch(e => console.log('Close audio play failed:', e));
        }

        // Wait for animation to finish (0.4s = 400ms)
        setTimeout(() => {
            win.style.display = 'none';
            win.classList.remove('closing');
        }, 400);
    }
}

// Draggable Logic
function makeDraggable(element) {
    const titleBar = element.querySelector('.title-bar');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    titleBar.addEventListener('mousedown', startDrag);
    titleBar.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
        // Prevent drag when clicking buttons
        if (e.target.classList.contains('close') ||
            e.target.classList.contains('minimize') ||
            e.target.classList.contains('maximize')) return;

        isDragging = true;
        bringToFront(element);

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        startX = clientX;
        startY = clientY;

        const rect = element.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const dx = clientX - startX;
        const dy = clientY - startY;

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // Boundary checks
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const elRect = element.getBoundingClientRect();

        // Horizontal bounds (keep some part visible)
        if (newLeft < -elRect.width + 50) newLeft = -elRect.width + 50;
        if (newLeft > windowWidth - 50) newLeft = windowWidth - 50;

        // Vertical bounds
        // Top bar height is approx 30px
        if (newTop < 30) newTop = 30;

        // Bottom bound - avoid dock (approx 100px height)
        const dockHeight = 100;
        if (newTop + elRect.height > windowHeight - dockHeight) {
            newTop = windowHeight - dockHeight - elRect.height;
        }

        element.style.left = `${newLeft}px`;
        element.style.top = `${newTop}px`;
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }

    // Bring to front on click anywhere
    element.addEventListener('mousedown', () => bringToFront(element));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Make all windows draggable
    document.querySelectorAll('.window').forEach(win => {
        makeDraggable(win);
    });

    // Loading Screen Sequence
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    const loadingContent = document.querySelector('.loading-content');
    const welcomeText = document.getElementById('welcome-text');
    let progress = 0;

    // Sequence: Welcome -> Loading -> Done
    setTimeout(() => {
        // Welcome text animation finishes around 2.5s
        if (welcomeText) welcomeText.style.display = 'none';
        if (loadingContent) {
            loadingContent.classList.remove('hidden-initially');
            loadingContent.classList.add('visible');
        }

        // Start Loading Counter
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 5) + 1; // Random increment 1-5%
            if (progress > 100) progress = 100;

            if (loadingText) loadingText.textContent = `${progress}%`;

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    document.body.classList.add('loaded');

                    // Remove loading screen after fade out
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 500);
            }
        }, 50); // Speed of loading
    }, 2000); // Wait for welcome

    // --- Music Auto-Play Logic (Starts immediately) ---
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const muteSound = document.getElementById('ui-mute-sound');
    let isPlaying = false; // Declare isPlaying here for global scope within DOMContentLoaded

    const enableMusic = () => {
        if (!bgMusic) return;
        bgMusic.volume = 1.0;
        bgMusic.play().then(() => {
            if (musicBtn) {
                musicBtn.classList.add('playing');
                musicBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            }
            isPlaying = true;
        }).catch(e => console.log('Music play failed:', e));
    };

    if (bgMusic) {
        // Try auto-play immediately during Welcome screen
        enableMusic();

        // Fallback: If browser blocked it (bgMusic.paused is true), wait for first interaction
        setTimeout(() => {
            if (bgMusic.paused) {
                console.log('Autoplay blocked. Waiting for interaction...');
                document.addEventListener('click', function onFirstClick() {
                    enableMusic();
                    document.removeEventListener('click', onFirstClick);
                }, { once: true });
            }
        }, 500);
    }

    // Clock
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('clock').textContent = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeBtn.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Play Sound Effect on UI Interaction Only
    const clickSound = document.getElementById('ui-click-sound');

    function playSound() {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    // Attach sound to specific interactive elements
    const interactiveSelectors = [
        'button',
        '.dock-item',
        '.traffic-lights span',
        '.folder-item'
    ];

    interactiveSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            if (element.classList.contains('close')) return;
            element.addEventListener('mousedown', playSound);
        });
    });

    // Hover Sound
    const hoverSound = document.getElementById('ui-hover-sound');
    if (hoverSound) {
        hoverSound.volume = 0.5; // Lower volume for hover
        document.querySelectorAll('.dock-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                hoverSound.currentTime = 0;
                hoverSound.play().catch(() => { });
            });
        });
    }

    // Music Toggle Logic (Uses variables from top of scope)
    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                // Muting
                if (bgMusic) bgMusic.pause();
                musicBtn.classList.remove('playing');
                musicBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                // Play Mute Sound
                if (muteSound) {
                    muteSound.currentTime = 0;
                    muteSound.play().catch(() => { });
                }
            } else {
                // Playing
                if (bgMusic) bgMusic.play().catch(e => console.log('BGM play failed:', e));
                musicBtn.classList.add('playing');
                musicBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            }
            isPlaying = !isPlaying;
        });
    }
});
