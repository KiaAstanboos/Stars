/* ============================================
   VALENTINE'S DAY PROPOSAL - MAIN SCRIPT
   Song: "Unintended" by Muse
   ============================================ */

// ============================================
// DOM ELEMENTS
// ============================================
const overlay = document.getElementById('overlay');
const enterBtn = document.getElementById('enter-btn');
const mainText = document.getElementById('main-text');
const lyricsText = document.getElementById('lyrics-text');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const yesWrapper = document.getElementById('yes-wrapper');
const noWrapper = document.getElementById('no-wrapper');
const videoContainer = document.getElementById('video-container');
const successVideo = document.getElementById('success-video');
const bgMusic = document.getElementById('bg-music');
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');

// ============================================
// LYRICS CONFIGURATION
// ============================================
// "Unintended" by Muse
// 
// HOW TO CUSTOMIZE:
// 1. Each object has a "time" (in seconds) and "text" (the lyric line)
// 2. Listen to your song and note the timestamps for each line
// 3. Edit the time values to match when each lyric should appear
// 4. The lyrics will fade in at the specified time and fade out 
//    when the next lyric appears
// ============================================
const lyrics = [
    { time: 0, text: "" },
    { time: 12, text: "♪ You could be my unintended ♪" },
    { time: 19, text: "♪ Choice to live my life extended ♪" },
    { time: 26, text: "♪ You could be the one I'll always love ♪" },
    { time: 39, text: "♪ You could be the one who listens ♪" },
    { time: 47, text: "♪ To my deepest inquisitions ♪" },
    { time: 53, text: "♪ You could be the one I'll always love ♪" },
    { time: 67, text: "♪ I'll be there, as soon as I can ♪" },
    { time: 74, text: "♪ But I'm busy mending broken  ♪" },
    { time: 80, text: "♪ Pieces of the life I had before ♪" },
    { time: 95, text: "♪ First there was the one who challenged ♪" },
    { time: 101, text: "♪ All my dreams and all my balance ♪" },
    { time: 108, text: "♪ She could never be as good as you ♪" },
    { time: 122, text: "♪ You could be my unintended ♪" },
    { time: 129, text: "♪ Choice to live my life extended ♪" },
    { time: 136, text: "♪ You should be the one I'll always love ♪" },
    { time: 149, text: "♪ I'll be there, as soon as I can ♪" },
    { time: 156, text: "♪ But I'm busy mending broken  ♪" },
    { time: 163, text: "♪ Pieces of the life I had before ♪" },
    { time: 177, text: "♪ I'll be there, as soon as I can ♪" },
    { time: 184, text: "♪ But I'm busy mending broken  ♪" },
    { time: 191, text: "♪ Pieces of the life I had before ♪" },
    { time: 199, text: "♪ Before you ♪" },
    { time: 214, text: "کلیک کن دیگه💕" },
    // Add more lyrics as needed...
    // { time: SECONDS, text: "Your lyric line here" },
];

let currentLyricIndex = -1;
const LYRIC_FADE_DURATION = 1600; // Match CSS transition for longer fade

// ============================================
// SHOOTING STARS ANIMATION (Canvas)
// ============================================
class ShootingStar {
    constructor() {
        this.reset();
    }
    
    reset() {
        // Start from random position at top-left area
        this.x = Math.random() * canvas.width * 0.7;
        this.y = Math.random() * canvas.height * 0.3;
        
        // Speed and direction (diagonal, moving right and down)
        this.speed = Math.random() * 8 + 4;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3; // ~45 degrees with variation
        
        // Trail properties
        this.length = Math.random() * 80 + 40;
        this.opacity = 1;
        this.size = Math.random() * 2 + 1;
        
        // Fade out speed
        this.fadeSpeed = Math.random() * 0.02 + 0.005;
    }
    
    update() {
        // Move the star
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // Fade out
        this.opacity -= this.fadeSpeed;
        
        // Reset when faded or off screen
        if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) {
            this.reset();
            // Random delay before next appearance
            this.opacity = Math.random() > 0.7 ? 1 : 0;
        }
    }
    
    draw() {
        if (this.opacity <= 0) return;
        
        ctx.save();
        
        // Create gradient for the trail
        const gradient = ctx.createLinearGradient(
            this.x, this.y,
            this.x - Math.cos(this.angle) * this.length,
            this.y - Math.sin(this.angle) * this.length
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.3, `rgba(255, 200, 220, ${this.opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(255, 150, 200, 0)`);
        
        // Draw the trail
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - Math.cos(this.angle) * this.length,
            this.y - Math.sin(this.angle) * this.length
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Draw the star head (bright point)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        
        ctx.restore();
    }
}

// Background stars (static twinkling)
class BackgroundStar {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random();
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinkleDirection = 1;
    }
    
    update() {
        // Twinkling effect
        this.opacity += this.twinkleSpeed * this.twinkleDirection;
        
        if (this.opacity >= 1) {
            this.twinkleDirection = -1;
        } else if (this.opacity <= 0.2) {
            this.twinkleDirection = 1;
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// Initialize stars
let shootingStars = [];
let backgroundStars = [];

function initStars() {
    // Resize canvas to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create shooting stars
    shootingStars = [];
    for (let i = 0; i < 5; i++) {
        shootingStars.push(new ShootingStar());
    }
    
    // Create background stars
    backgroundStars = [];
    const starCount = Math.floor((canvas.width * canvas.height) / 5000);
    for (let i = 0; i < starCount; i++) {
        backgroundStars.push(new BackgroundStar());
    }
}

function animateStars() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw background stars
    backgroundStars.forEach(star => {
        star.update();
        star.draw();
    });
    
    // Update and draw shooting stars
    shootingStars.forEach(star => {
        star.update();
        star.draw();
    });
    
    requestAnimationFrame(animateStars);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reposition background stars
    backgroundStars.forEach(star => {
        star.x = Math.random() * canvas.width;
        star.y = Math.random() * canvas.height;
    });

    // Keep the No button inside the viewport if it has escaped
    clampNoButtonToViewport();
});

// ============================================
// LYRICS SYNCHRONIZATION (Single line, longer fade)
// ============================================
function updateLyrics() {
    const currentTime = bgMusic.currentTime;
    
    // Find the current lyric based on time
    for (let i = lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= lyrics[i].time) {
            if (i !== currentLyricIndex) {
                currentLyricIndex = i;
                
                // Fade out current lyric
                lyricsText.classList.remove('visible');
                
                // After fade out, update text and fade in (longer effect)
                setTimeout(() => {
                    lyricsText.textContent = lyrics[currentLyricIndex].text;
                    if (lyrics[currentLyricIndex].text) {
                        lyricsText.classList.add('visible');
                    }
                }, LYRIC_FADE_DURATION);
            }
            break;
        }
    }
}

// ============================================
// "NO" BUTTON - ESCAPE LOGIC (Smooth Animation)
// Button starts in normal layout, becomes fixed and runs away on hover
// ============================================
let isNoButtonMoving = false;
let noButtonEscaped = false; // Track if button has started escaping

function moveNoButton() {
    if (isNoButtonMoving) return; // Prevent multiple triggers
    isNoButtonMoving = true;
    
    // First time hover: switch to fixed positioning
    if (!noButtonEscaped) {
        const rect = noBtn.getBoundingClientRect();

        // Detach the button from its wrapper before hiding the wrapper
        if (noWrapper && noWrapper.contains(noBtn)) {
            noWrapper.removeChild(noBtn);
            document.body.appendChild(noBtn);
        }

        noBtn.style.position = 'fixed';
        noBtn.style.left = rect.left + 'px';
        noBtn.style.top = rect.top + 'px';
        noBtn.style.right = 'auto';
        noBtn.style.bottom = 'auto';
        noBtn.classList.add('escaping');
        noButtonEscaped = true;

        if (noWrapper) {
            noWrapper.classList.add('hidden');
        }
        
        // Small delay before moving to allow position: fixed to take effect
        setTimeout(() => {
            moveToRandomPosition();
        }, 50);
    } else {
        moveToRandomPosition();
    }
}

function moveToRandomPosition() {
    const rect = noBtn.getBoundingClientRect();
    const btnWidth = rect.width || noBtn.offsetWidth;
    const btnHeight = rect.height || noBtn.offsetHeight;
    
    // Calculate safe boundaries (keep button fully visible)
    const maxX = Math.max(20, window.innerWidth - btnWidth - 20);
    const maxY = Math.max(20, window.innerHeight - btnHeight - 20);
    
    // Generate random position within safe bounds
    const randomX = maxX === 20 ? 20 : Math.random() * (maxX - 20) + 20;
    const randomY = maxY === 20 ? 20 : Math.random() * (maxY - 20) + 20;
    
    // Move the button with smooth animation (CSS transition handles it)
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';

    // Clamp after moving to ensure it stays fully visible
    requestAnimationFrame(() => {
        clampNoButtonToViewport();
    });
    
    // Reset flag after animation completes
    setTimeout(() => {
        isNoButtonMoving = false;
    }, 450);
}

function clampNoButtonToViewport() {
    if (!noButtonEscaped) return;
    const rect = noBtn.getBoundingClientRect();
    const padding = 20;
    
    const maxLeft = Math.max(padding, window.innerWidth - rect.width - padding);
    const maxTop = Math.max(padding, window.innerHeight - rect.height - padding);
    
    const clampedLeft = Math.min(Math.max(rect.left, padding), maxLeft);
    const clampedTop = Math.min(Math.max(rect.top, padding), maxTop);
    
    if (clampedLeft !== rect.left || clampedTop !== rect.top) {
        noBtn.style.left = clampedLeft + 'px';
        noBtn.style.top = clampedTop + 'px';
    }
}

// ============================================
// "YES" BUTTON - SUCCESS STATE
// ============================================
function handleYesClick() {
    // Change the main text
    mainText.textContent = "Knew it! 😛💕";
    mainText.style.animation = 'none';
    mainText.style.transform = 'scale(1.2)';
    
    // Hide the buttons
    yesWrapper.classList.add('hidden');
    noWrapper.classList.add('hidden');
    noBtn.style.display = 'none';
    
    // Show and play the video
    videoContainer.classList.add('visible');
    successVideo.play();
    
    // Optional: Create celebration effect
    createHearts();
}

// ============================================
// CELEBRATION HEARTS (Bonus Effect)
// ============================================
function createHearts() {
    const heartsContainer = document.createElement('div');
    heartsContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 5;
        overflow: hidden;
    `;
    document.body.appendChild(heartsContainer);
    
    // Create floating hearts
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = ['💕', '❤️', '💖', '💗', '💓'][Math.floor(Math.random() * 5)];
            heart.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 2 + 1}rem;
                left: ${Math.random() * 100}%;
                top: 100%;
                animation: floatUp ${Math.random() * 3 + 4}s ease-out forwards;
                opacity: ${Math.random() * 0.5 + 0.5};
            `;
            heartsContainer.appendChild(heart);
        }, i * 200);
    }
    
    // Add the floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-120vh) rotate(${Math.random() > 0.5 ? '' : '-'}360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// OVERLAY - CLICK TO ENTER
// ============================================
enterBtn.addEventListener('click', () => {
    // Hide the overlay with fade animation
    overlay.classList.add('hidden');
    
    // Start the background music
    bgMusic.play().catch(err => {
        console.log('Audio playback failed:', err);
    });
});

// ============================================
// EVENT LISTENERS
// ============================================

// No button runs away on hover
noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('touchstart', moveNoButton);

// Yes button triggers success state
yesBtn.addEventListener('click', handleYesClick);

// Update lyrics as music plays
bgMusic.addEventListener('timeupdate', updateLyrics);

// Reset lyrics when music loops
bgMusic.addEventListener('ended', () => {
    currentLyricIndex = -1;
    lyricsText.classList.remove('visible');
    lyricsText.textContent = '';
});

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initStars();
    animateStars();
});

// Start animation immediately as well (backup)
initStars();
animateStars();
