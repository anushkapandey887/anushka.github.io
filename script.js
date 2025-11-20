
// ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== LIGHTBOX FUNCTIONALITY =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;
let allImages = [];

// Get all image items
const imageItems = document.querySelectorAll('.image-item img');

// Convert NodeList to Array and store image data
allImages = Array.from(imageItems).map(img => ({
    src: img.src,
    alt: img.alt
}));

// Add click event to all images
imageItems.forEach((img, index) => {
    img.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox();
    });

    // Add loaded class when image loads
    img.addEventListener('load', () => {
        img.classList.add('loaded');
    });
});

function openLightbox() {
    lightbox.classList.add('active');
    updateLightboxImage();
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    const currentImage = allImages[currentImageIndex];
    lightboxImg.src = currentImage.src;
    lightboxCaption.textContent = currentImage.alt;
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    updateLightboxImage();
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % allImages.length;
    updateLightboxImage();
}

// Event listeners for lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrevImage);
lightboxNext.addEventListener('click', showNextImage);

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            showPrevImage();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
    }
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all project blocks
document.querySelectorAll('.project-block').forEach(block => {
    block.style.opacity = '0';
    block.style.transform = 'translateY(30px)';
    block.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(block);
});

// ===== LAZY LOADING IMAGES =====
if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== SCROLL PROGRESS INDICATOR =====
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light));
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

createScrollProgress();

// ===== PARALLAX EFFECT FOR HERO =====
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

// ===== IMAGE GRID HOVER EFFECTS =====
const imageGridItems = document.querySelectorAll('.image-item');

imageGridItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
        // Add subtle scale effect to neighboring items
        const siblings = Array.from(this.parentElement.children);
        siblings.forEach(sibling => {
            if (sibling !== this) {
                sibling.style.opacity = '0.7';
            }
        });
    });

    item.addEventListener('mouseleave', function () {
        // Reset siblings
        const siblings = Array.from(this.parentElement.children);
        siblings.forEach(sibling => {
            sibling.style.opacity = '1';
        });
    });
});

// ===== RESPONSIVE NAVIGATION FOR MOBILE =====
const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && !document.querySelector('.mobile-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'mobile-toggle';
            toggle.innerHTML = '☰';
            toggle.style.cssText = `
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--color-primary);
                cursor: pointer;
                display: block;
            `;

            const navContainer = document.querySelector('.nav-container');
            navContainer.appendChild(toggle);

            toggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // Add mobile menu styles
            navMenu.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 1rem;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                transform: translateY(-100%);
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s ease;
            `;

            // Add active state style
            const style = document.createElement('style');
            style.textContent = `
                .nav-menu.active {
                    transform: translateY(0) !important;
                    opacity: 1 !important;
                    pointer-events: all !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
};

// Check on load and resize
createMobileMenu();
window.addEventListener('resize', createMobileMenu);

// ===== CONSOLE LOG FOR DEVELOPERS =====
console.log('%cFashion Design Portfolio', 'font-size: 20px; font-weight: bold; color: #d4af37;');
console.log('%cBuilt with passion for design and attention to detail', 'font-size: 12px; color: #666;');

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy operations
const debouncedScroll = debounce(() => {
    // Additional scroll operations can go here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Create mailto link
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:anushkapandey887@gmail.com?subject=${subject}&body=${body}`;

        // Open email client
        window.location.href = mailtoLink;

        // Show success message
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '✓ Message Sent!';
        submitBtn.style.background = '#4CAF50';

        // Reset form
        setTimeout(() => {
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 3000);
    });
}

// ===== SLIDER NAVIGATION =====
const sliderContainer = document.querySelector('.image-slider');
const leftArrow = document.querySelector('.slider-arrow-left');
const rightArrow = document.querySelector('.slider-arrow-right');

if (sliderContainer && leftArrow && rightArrow) {
    const scrollAmount = 352; // 320px item width + 32px gap

    leftArrow.addEventListener('click', () => {
        sliderContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    rightArrow.addEventListener('click', () => {
        sliderContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
}
