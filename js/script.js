document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Animation
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 1000);
        });
    }

    // 2. Animated Statistics Counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const animatedStats = document.querySelector('.animated-stats');
    if (animatedStats) {
        counterObserver.observe(animatedStats);
    }

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 20);
    }

    // 3. Interactive Timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            timelineItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            
            // Animate timeline line
            const timelineLine = document.querySelector('.timeline-line');
            if (timelineLine) {
                const progress = ((index + 1) / timelineItems.length) * 100;
                timelineLine.style.setProperty('--progress', `${progress}%`);
            }
        });
    });

    // 4. Floating Action Button
    const fabContainer = document.querySelector('.fab-container');
    const fabMain = document.getElementById('fab-main');
    
    if (fabMain) {
        fabMain.addEventListener('click', () => {
            fabContainer.classList.toggle('active');
        });

        // Close FAB when clicking outside
        document.addEventListener('click', (e) => {
            if (!fabContainer.contains(e.target)) {
                fabContainer.classList.remove('active');
            }
        });
    }

    // FAB Navigation Functions
    window.scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        fabContainer.classList.remove('active');
    };

    window.scrollToContact = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        fabContainer.classList.remove('active');
    };

    window.scrollToSkills = () => {
        const skillsSection = document.querySelector('a[href="skills.html"]');
        if (skillsSection) {
            window.location.href = 'skills.html';
        }
        fabContainer.classList.remove('active');
    };

    // 6. Enhanced Scroll Effects
    let scrollProgress = 0;
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollProgress = scrolled;
        
        // Update CSS custom property for scroll progress
        document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}%`);
    });

    // 7. Contact Form - Open Gmail Compose
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Construct Gmail compose URL
            const subject = `Portfolio Contact from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=cozykrish2916@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Open Gmail in new tab
            window.open(gmailUrl, '_blank');
            
            // Reset form
            contactForm.reset();
            
            // Optional: Show success message
            alert('Opening Gmail compose with your message...');
        });
    }

    // 8. Advanced Hover Effects
    const glassCards = document.querySelectorAll('.glass-card, .project-card, .skill-card');
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
            
            // 3D tilt effect
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // 8. Dynamic Background Effects
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
        const ctx = bgCanvas.getContext('2d');
        let particles = [];
        
        function createParticles() {
            particles = [];
            for (let i = 0; i < 10; i++) {
                particles.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 3 + 1,
                    color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        }
        
        // function animateParticles() {
        //     ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            
        //     particles.forEach(particle => {
        //         particle.x += particle.vx;
        //         particle.y += particle.vy;
                
        //         if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
        //         if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
                
        //         ctx.beginPath();
        //         ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        //         ctx.fillStyle = particle.color;
        //         ctx.globalAlpha = particle.opacity;
        //         ctx.fill();
        //     });
            
        //     requestAnimationFrame(animateParticles);
        // }
        
        window.addEventListener('resize', () => {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
            createParticles();
        });
        
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        createParticles();
        animateParticles();
    }

    // 9. Interactive Project Cards with Lightbox
    const projectCardsLightbox = document.querySelectorAll('.project-card');
    projectCardsLightbox.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const title = card.querySelector('h3');
            const desc = card.querySelector('p');
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img src="${img.src}" alt="${img.alt}">
                    <div class="lightbox-info">
                        <h3>${title.textContent}</h3>
                        <p>${desc.textContent}</p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            
            // Animate in
            setTimeout(() => lightbox.classList.add('active'), 10);
            
            // Close lightbox
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                    lightbox.classList.remove('active');
                    setTimeout(() => lightbox.remove(), 300);
                }
            });
        });
    });

    // 10. Dynamic Theme Color Updates
    const updateThemeColors = () => {
        const root = document.documentElement;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            root.style.setProperty('--primary-color', '#6C63FF');
            root.style.setProperty('--secondary-color', '#FF6B6B');
            root.style.setProperty('--bg-color', '#0a0a0a');
            root.style.setProperty('--text-color', '#ffffff');
        } else {
            root.style.setProperty('--primary-color', '#4F46E5');
            root.style.setProperty('--secondary-color', '#EC4899');
            root.style.setProperty('--bg-color', '#ffffff');
            root.style.setProperty('--text-color', '#1f2937');
        }
    };
    
    updateThemeColors();
    
    // Watch for theme changes
    const observer = new MutationObserver(updateThemeColors);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
    const textElement = document.querySelector('.typewriter');
    const words = ["Cloud Computing Engineer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 200;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 100;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 200;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    if (textElement) type();

    // Typing effect for name "Krish Sharma"
    const nameElement = document.querySelector('.typing-name');
    const nameWords = ["Krish Sharma"];
    let nameWordIndex = 0;
    let nameCharIndex = 0;
    let nameIsDeleting = false;
    let nameTypeSpeed = 200;

    function typeName() {
        const currentNameWord = nameWords[nameWordIndex];

        if (nameIsDeleting) {
            nameElement.textContent = currentNameWord.substring(0, nameCharIndex - 1);
            nameCharIndex--;
            nameTypeSpeed = 100;
        } else {
            nameElement.textContent = currentNameWord.substring(0, nameCharIndex + 1);
            nameCharIndex++;
            nameTypeSpeed = 200;
        }

        if (!nameIsDeleting && nameCharIndex === currentNameWord.length) {
            nameIsDeleting = true;
            nameTypeSpeed = 2000; // Pause at end
        } else if (nameIsDeleting && nameCharIndex === 0) {
            nameIsDeleting = false;
            nameWordIndex = (nameWordIndex + 1) % nameWords.length;
            nameTypeSpeed = 500;
        }

        setTimeout(typeName, nameTypeSpeed);
    }

    // Start typing the name after a short delay
    if (nameElement) {
        setTimeout(typeName, 1000);
    }

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const bars = document.querySelectorAll('.bar');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // Animate Hamburger
            if (mobileMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // 3. Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add delay if specified
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 5. Theme Toggler
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Check local storage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    } else {
        // Default to dark mode
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        let theme = 'light';
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            theme = 'dark';
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
        localStorage.setItem('theme', theme);
    });

    // 6. Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 7. Canvas Particle Animation
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            const numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                const size = (Math.random() * 2) + 1; // Random size
                const x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                const y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                const directionX = (Math.random() * 0.4) - 0.2;
                const directionY = (Math.random() * 0.4) - 0.2;
                const color = '#6C63FF';

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    const distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                                     ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        opacityValue = 1 - (distance/20000);
                        ctx.strokeStyle = 'rgba(108, 99, 255,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        init();
        animate();
    }
});

// Global function for Modals (to be called from HTML onclick)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

// Close Modal event delegation
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal')) {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
        document.body.style.overflow = 'auto';
    }
});
/* Scroll reveal (non-breaking) */
const revealElements = document.querySelectorAll(
  "section, .project, .project-card, .timeline-item"
);

revealElements.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = "translateY(30px)";
});

function revealOnScroll() {
  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
      el.style.transition = "all 0.8s ease";
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

// Reveal elements that are already in view on page load
revealOnScroll();
document.querySelectorAll(".btn, button").forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0,0)";
  });
});
document.querySelectorAll(".glass-card, .project-card, .review-card")
.forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--y", `${e.clientY - rect.top}px`);
  });
});
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const height = document.body.scrollHeight - window.innerHeight;
  const percent = (scrollTop / height) * 100;
  document.documentElement.style.setProperty("--scroll", percent + "%");
});
document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("click", () => {
    card.classList.toggle("active");
  });
});
let offset = 0;
setInterval(() => {
  const track = document.querySelector(".reviews-track");
  offset -= 300;
  if (Math.abs(offset) > track.scrollWidth / 2) offset = 0;
  track.style.transform = `translateX(${offset}px)`;
}, 3000);
const cursor = document.querySelector(".cursor");

if (cursor) {
  window.addEventListener("mousemove", e => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });
}
const magneticCards = document.querySelectorAll(
  ".project-card, .skill-card, .glass-card"
);

magneticCards.forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform = `
      translate(${x * 0.12}px, ${y * 0.12}px)
      rotateX(${-(y / 10)}deg)
      rotateY(${x / 10}deg)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translate(0,0) rotateX(0) rotateY(0)";
  });
});
const aboutImg = document.querySelector(".about-img img");

// Prevent image tilt while the page is scrolling
let isScrolling = false;
let _scrollTimer = null;
window.addEventListener('scroll', () => {
  isScrolling = true;
  clearTimeout(_scrollTimer);
  _scrollTimer = setTimeout(() => { isScrolling = false; }, 150);
});

if (aboutImg) {
  aboutImg.addEventListener("mousemove", (e) => {
    if (isScrolling) return; // ignore mousemove events fired during scroll
    const rect = aboutImg.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    aboutImg.style.transform = `
      perspective(600px)
      rotateX(${-(y / 15)}deg)
      rotateY(${x / 15}deg)
      scale(1.04)
    `;
  });

  aboutImg.addEventListener("mouseleave", () => {
    aboutImg.style.transform = "perspective(600px) rotateX(0) rotateY(0) scale(1)";
  });
}
const rippleCards = document.querySelectorAll(
  ".project-card, .skill-card, .glass-card, .review-card"
);

rippleCards.forEach(card => {
  card.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";

    card.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Skills Details Section Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll to skills details
    const skillsDetailsLink = document.querySelector('a[href="#skills-details"]');
    if (skillsDetailsLink) {
        skillsDetailsLink.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.getElementById('skills-details');
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Code typing animation
    const codeElements = document.querySelectorAll('.code-content');
    codeElements.forEach((codeElement, index) => {
        const originalHTML = codeElement.innerHTML;
        const lines = Array.from(codeElement.querySelectorAll('.code-line'));

        // Clear content and add typing cursor
        codeElement.innerHTML = '<span class="typing-cursor"></span>';
        const cursor = codeElement.querySelector('.typing-cursor');

        let lineIndex = 0;
        let charIndex = 0;
        let currentLineElement = null;

        function typeWriter() {
            if (lineIndex < lines.length) {
                if (!currentLineElement) {
                    currentLineElement = document.createElement('div');
                    currentLineElement.className = 'code-line';
                    codeElement.insertBefore(currentLineElement, cursor);
                }

                const currentLine = lines[lineIndex];
                const lineText = currentLine.textContent || currentLine.innerText;

                if (charIndex < lineText.length) {
                    const char = lineText.charAt(charIndex);
                    const span = document.createElement('span');
                    span.className = 'code-char';
                    span.textContent = char;

                    // Apply syntax highlighting
                    if (/\b(def|class|if|else|for|while|return|import|from|const|let|var|function)\b/.test(lineText.substring(0, charIndex + 1))) {
                        span.className += ' code-keyword';
                    } else if (char === '"' || char === "'" || (char === ' ' && lineText.substring(charIndex - 1, charIndex + 1) === ' "')) {
                        span.className += ' code-string';
                    } else if (lineText.substring(charIndex - 1, charIndex + 1) === '//') {
                        span.className += ' code-comment';
                    }

                    currentLineElement.appendChild(span);
                    charIndex++;

                    // Random typing speed for realism
                    const speed = Math.random() * 100 + 50;
                    setTimeout(typeWriter, speed);
                } else {
                    // Move to next line
                    currentLineElement = null;
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(typeWriter, 300);
                }
            } else {
                // Remove cursor when done
                cursor.remove();
            }
        }

        // Start typing animation after card is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        typeWriter();
                    }, index * 500);
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(codeElement.closest('.skill-detail-card'));
    });

    // Skill card hover effects
    const skillCards = document.querySelectorAll('.skill-detail-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add glow effect
            card.style.boxShadow = '0 20px 40px rgba(108, 99, 255, 0.4), 0 0 30px rgba(0, 210, 255, 0.3)';
        });

        card.addEventListener('mouseleave', () => {
            // Reset glow effect
            card.style.boxShadow = '';
        });

        // Mac button interactions
        const macBtns = card.querySelectorAll('.mac-btn');
        macBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                btn.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            });
        });
    });

    // Rainbow button animation
    const rainbowBtn = document.querySelector('.rainbow-btn');
    if (rainbowBtn) {
        let hue = 0;
        setInterval(() => {
            hue = (hue + 1) % 360;
            rainbowBtn.style.filter = `hue-rotate(${hue}deg)`;
        }, 50);
    }

    // Code window interactions
    const codeWindows = document.querySelectorAll('.code-window');
    codeWindows.forEach(window => {
        window.addEventListener('click', () => {
            window.style.transform = 'scale(1.02)';
            setTimeout(() => {
                window.style.transform = '';
            }, 200);
        });
    });

    // Particle effect for skills section
    const skillsSection = document.querySelector('.skills-details');
    if (skillsSection) {
        const canvas = document.createElement('canvas');
        canvas.id = 'skills-particles';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        skillsSection.style.position = 'relative';
        skillsSection.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = skillsSection.offsetWidth;
            canvas.height = skillsSection.offsetHeight;
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < 15; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
                });
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });

            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        createParticles();
        animateParticles();
    }
});