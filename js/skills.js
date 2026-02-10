document.addEventListener('DOMContentLoaded', () => {
    // Counter Animation
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 1);
        } else {
            counter.innerText = target;
        }
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => animateCounter(counter));
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.hero-stats').forEach(stats => {
        counterObserver.observe(stats);
    });

    // Skill Filtering
    const tabBtns = document.querySelectorAll('.tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            skillCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category').split(' ');

                if (category === 'all' || cardCategories.includes(category)) {
                    card.style.display = 'block';
                    card.style.animation = 'skill-appear 0.6s ease-out forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Skill Card Hover Effects
    // skillCards.forEach(card => {
    //     card.addEventListener('mouseenter', () => {
    //         card.style.transform = 'translateY(-15px) scale(1.02) rotateX(5deg)';
    //         card.style.boxShadow = '0 30px 60px rgba(102, 126, 234, 0.4)';
    //     });

    //     card.addEventListener('mouseleave', () => {
    //         card.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
    //         card.style.boxShadow = '';
    //     });
    // });

    // Level Bar Animation on Scroll
    const levelBars = document.querySelectorAll('.level-fill');

    const levelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.style.width;
                fill.style.width = '0%';
                setTimeout(() => {
                    fill.style.width = width;
                }, 300);
                levelObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    levelBars.forEach(bar => levelObserver.observe(bar));

    // Floating Background Shapes
    const shapes = document.querySelectorAll('.bg-shape');

    shapes.forEach((shape, index) => {
        shape.style.animation = `float ${15 + index * 5}s ease-in-out infinite`;
        shape.style.animationDelay = `${index * 2}s`;
    });

    // Matrix Code Animation
    const matrixLines = document.querySelectorAll('.matrix-line');

    matrixLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.3}s`;
    });

    // Demo Code Animation
    const demoCards = document.querySelectorAll('.demo-card');

    demoCards.forEach(card => {
        const runBtn = card.querySelector('.run-btn');
        const code = card.querySelector('.demo-code');

        runBtn.addEventListener('click', () => {
            // Add running animation
            runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
            runBtn.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';

            // Simulate code execution
            setTimeout(() => {
                runBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                runBtn.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';

                // Add glow effect to code
                code.style.boxShadow = '0 0 30px rgba(67, 233, 123, 0.5)';
                code.style.animation = 'code-success 1s ease-out';

                setTimeout(() => {
                    runBtn.innerHTML = '<i class="fas fa-play"></i> Run';
                    runBtn.style.background = '';
                    code.style.boxShadow = '';
                    code.style.animation = '';
                }, 2000);
            }, 1500);
        });
    });

    // Particle System
    const createParticles = () => {
        const particlesContainer = document.querySelector('.floating-particles');

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';

            const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            particlesContainer.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 20000);
        }
    };

    // Create particles every 5 seconds
    createParticles();
    setInterval(createParticles, 5000);

    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all skill cards
    skillCards.forEach(card => observer.observe(card));

    // Typing effect for hero text
    const heroTitle = document.querySelector('.hero-title');
    const originalText = heroTitle.innerHTML;
    heroTitle.innerHTML = '';

    let charIndex = 0;
    const typeText = () => {
        if (charIndex < originalText.length) {
            if (originalText.charAt(charIndex) === '<') {
                // Skip HTML tags
                while (originalText.charAt(charIndex) !== '>') {
                    heroTitle.innerHTML += originalText.charAt(charIndex);
                    charIndex++;
                }
                heroTitle.innerHTML += originalText.charAt(charIndex);
                charIndex++;
            } else {
                heroTitle.innerHTML += originalText.charAt(charIndex);
            }
            charIndex++;
            setTimeout(typeText, 50);
        }
    };

    setTimeout(typeText, 1000);

    // Magnetic effect for skill icons
    document.addEventListener('mousemove', (e) => {
        const icons = document.querySelectorAll('.skill-icon');

        icons.forEach(icon => {
            const rect = icon.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 100;

            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                const moveX = (x / distance) * force * 10;
                const moveY = (y / distance) * force * 10;

                icon.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + force * 0.1})`;
            } else {
                icon.style.transform = 'translate(0, 0) scale(1)';
            }
        });
    });

    // Rainbow text animation for section titles
    const sectionTitles = document.querySelectorAll('.section-title');

    sectionTitles.forEach(title => {
        title.style.background = 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe, #43e97b, #38f9d7)';
        title.style.backgroundSize = '400% 400%';
        title.style.animation = 'rainbow-text 3s ease infinite';
        title.style.webkitBackgroundClip = 'text';
        title.style.webkitTextFillColor = 'transparent';
        title.style.backgroundClip = 'text';
    });

    // Add CSS for rainbow text animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow-text {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        @keyframes code-success {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            pointer-events: none;
            animation: particle-float linear infinite;
        }

        .animate-in {
            animation: slide-up 0.8s ease-out forwards;
        }

        @keyframes slide-up {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Back button hover effect
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('mouseenter', () => {
            backBtn.style.transform = 'translateX(-10px) scale(1.05)';
        });

        backBtn.addEventListener('mouseleave', () => {
            backBtn.style.transform = 'translateX(0) scale(1)';
        });
    }
});