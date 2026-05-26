document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".stat-number");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = Array.from(document.querySelectorAll(".project-card"));
    const revealItems = document.querySelectorAll(".reveal");
    const shapes = document.querySelectorAll(".bg-shape");

    const animateCounter = (element) => {
        const target = Number(element.dataset.target || "0");
        const duration = 1200;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            element.textContent = String(Math.floor(progress * target));
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                element.textContent = String(target);
            }
        };

        requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            const stat = entry.target.querySelector(".stat-number");
            if (stat) {
                animateCounter(stat);
            }
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.35 });

    document.querySelectorAll(".stat-card").forEach((card) => counterObserver.observe(card));

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter || "all";

            filterButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            cards.forEach((card) => {
                const categories = (card.dataset.category || "").split(" ");
                const show = filter === "all" || categories.includes(filter);
                card.classList.toggle("hidden", !show);
            });
        });
    });

    cards.forEach((card, index) => {
        card.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 90}ms`);
        card.style.setProperty("--reveal-rotate", index % 2 === 0 ? "-7deg" : "7deg");
        card.style.setProperty("--reveal-x", index % 3 === 0 ? "-18px" : index % 3 === 2 ? "18px" : "0px");
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px"
    });

    revealItems.forEach((item) => revealObserver.observe(item));

    cards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            card.style.setProperty("--mx", `${x}px`);
            card.style.setProperty("--my", `${y}px`);
        });
    });

    document.addEventListener("mousemove", (event) => {
        const xRatio = event.clientX / window.innerWidth;
        const yRatio = event.clientY / window.innerHeight;

        shapes.forEach((shape, index) => {
            const offsetX = (xRatio - 0.5) * (8 + index * 4);
            const offsetY = (yRatio - 0.5) * (8 + index * 4);
            shape.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    });

    // ==========================================
    // CINEMATIC FEATURED PROJECTS SYSTEM
    // ==========================================
    initCinematicFeatured();
});

function initCinematicFeatured() {
    // --- Featured Projects Data ---
    const featuredProjects = [
        {
            name: "FLOAT - AI Desktop Assistant",
            description: "Float above the busy work. A hands-free AI assistant with wake-word voice control, LLaMA 3.3 intelligence via Groq, bilingual support, desktop automation, and an animated dashboard — your personal digital co-pilot.",
            image: "images/project%20images/float%20ai%20image%20(1).png",
            imageAlt: "FLOAT AI Desktop Assistant interface with animated dashboard and voice control visualization",
            category: "AI",
            tech: ["Python", "Groq API", "LLaMA 3.3", "Voice AI", "Automation", "tkinter"],
            link: "#"
        },
        {
            name: "Smart Complaint Service Platform",
            description: "Enterprise-grade SaaS for intelligent complaint management. Real-time tracking, advanced analytics, role-based workflows, and a premium interface built for scale — where every issue finds resolution.",
            image: "images/project%20images/smart%20complaint%20image%20(1).png",
            imageAlt: "Smart Complaint Service Platform dashboard showing analytics and real-time complaint tracking",
            category: "Full-Stack",
            tech: ["React 19", "Node.js", "MongoDB", "Socket.IO", "JWT", "Tailwind CSS 4"],
            link: "https://github.com/COZYkrish/Smart-Complaint-Service-Platform#contributing"
        },
        {
            name: "LuminaBlog",
            description: "A production-grade MERN blogging engine with auth, rich publishing, comments, likes, bookmarks, analytics, and cloud image uploads — the full creator's toolkit wrapped in a cinematic dark UI.",
            image: "images/project%20images/luminablog%20image%20(1).png",
            imageAlt: "LuminaBlog blogging platform with dark theme showing blog posts and analytics dashboard",
            category: "Full-Stack",
            tech: ["React", "Node.js", "MongoDB", "Cloudinary", "JWT", "Framer Motion"],
            link: "https://github.com/COZYkrish/BLOG-PLATFORM"
        },
        {
            name: "ShopZone",
            description: "A complete e-commerce ecosystem — seamless shopping flows, secure checkout, order tracking, and a powerful admin dashboard. Built to real-world production standards with the MERN stack.",
            image: "images/project%20images/shopzone%20imge%20(1).png",
            imageAlt: "ShopZone e-commerce web application with product listings and shopping cart interface",
            category: "Full-Stack",
            tech: ["React 18", "Express.js", "MongoDB", "JWT", "bcryptjs", "Axios"],
            link: "https://github.com/COZYkrish/E-COMMERCE-WEB-APPLICATION"
        },
        {
            name: "Fitness Analyzer",
            description: "ML-powered fitness intelligence — predict outcomes, track health metrics, explore analytics dashboards, and unlock your data with a cinematic interface built for clarity.",
            image: "images/project%20images/fitness%20analyzer%20image%20(1).png",
            imageAlt: "Fitness Analyzer application showing health analytics dashboard with ML prediction charts",
            category: "AI",
            tech: ["Python", "Flask", "scikit-learn", "Chart.js", "GSAP", "pandas"],
            link: "https://github.com/COZYkrish/FITNESS-ANALYZER"
        }
    ];

    // --- DOM References ---
    const scrollSpacer = document.getElementById("featuredScrollSpacer");
    const featuredCard = document.getElementById("featuredCard");
    const dotsContainer = document.getElementById("featuredDots");
    const progressBar = document.getElementById("featuredProgressBar");
    const bgGlow = document.querySelector(".featured-bg-glow");

    if (!scrollSpacer || !featuredCard || !dotsContainer || !progressBar) return;

    const projectCount = featuredProjects.length;
    let currentIndex = 0;
    let transitionTimer = null;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const mobileQuery = window.matchMedia("(max-width: 600px)");
    const usePinnedScroll = !mobileQuery.matches;

    featuredProjects.forEach((project) => {
        const img = new Image();
        img.src = project.image;
    });

    // --- Render Card Content ---
    function renderCard(index) {
        const project = featuredProjects[index];
        featuredCard.innerHTML = `
            <div class="featured-card__glass-highlight"></div>
            <div class="featured-card__counter">${index + 1} / ${projectCount}</div>
            <div class="featured-card__image-wrap">
                <img
                    class="featured-card__image"
                    src="${project.image}"
                    alt="${project.imageAlt}"
                    loading="eager"
                    draggable="false"
                />
            </div>
            <div class="featured-card__body">
                <span class="featured-card__category">${project.category}</span>
                <h4 class="featured-card__name">${project.name}</h4>
                <p class="featured-card__desc">${project.description}</p>
                <div class="featured-card__tech">
                    ${project.tech.map(t => `<span>${t}</span>`).join("")}
                </div>
                <a class="featured-card__link" href="${project.link}" target="_blank" rel="noopener noreferrer">
                    View Source <i class="fas fa-arrow-up-right-from-square"></i>
                </a>
            </div>
        `;
    }

    // --- Generate Dots ---
    function generateDots() {
        dotsContainer.innerHTML = "";
        featuredProjects.forEach((project, i) => {
            const dot = document.createElement("button");
            dot.className = `featured-dot${i === 0 ? " is-active" : ""}`;
            dot.setAttribute("role", "tab");
            dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
            dot.setAttribute("aria-label", `View ${project.name}`);
            dot.setAttribute("tabindex", i === 0 ? "0" : "-1");
            dot.addEventListener("click", () => navigateToProject(i));
            dotsContainer.appendChild(dot);
        });
    }

    // --- Update Dots ---
    function updateDots(activeIdx) {
        const dots = dotsContainer.querySelectorAll(".featured-dot");
        dots.forEach((dot, i) => {
            const isActive = i === activeIdx;
            dot.classList.toggle("is-active", isActive);
            dot.setAttribute("aria-selected", isActive ? "true" : "false");
            dot.setAttribute("tabindex", isActive ? "0" : "-1");
        });
        if (!usePinnedScroll) {
            progressBar.style.width = `${projectCount > 1 ? (activeIdx / (projectCount - 1)) * 100 : 100}%`;
        }
    }

    // --- Navigate to a specific project via dot click ---
    function navigateToProject(targetIndex) {
        if (targetIndex === currentIndex || targetIndex < 0 || targetIndex >= projectCount) return;

        if (!usePinnedScroll) {
            transitionToProject(targetIndex);
            return;
        }

        const spacerRect = scrollSpacer.getBoundingClientRect();
        const spacerTop = window.scrollY + spacerRect.top;
        const scrollableHeight = scrollSpacer.offsetHeight - window.innerHeight;
        const targetScroll = spacerTop + (targetIndex / projectCount) * scrollableHeight + 10;

        window.scrollTo({
            top: targetScroll,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    }

    // --- Keyboard Navigation on Dots ---
    dotsContainer.addEventListener("keydown", (e) => {
        const dots = Array.from(dotsContainer.querySelectorAll(".featured-dot"));
        const focusedIdx = dots.indexOf(document.activeElement);
        if (focusedIdx === -1) return;

        let newIdx = focusedIdx;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            newIdx = Math.min(focusedIdx + 1, projectCount - 1);
            e.preventDefault();
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            newIdx = Math.max(focusedIdx - 1, 0);
            e.preventDefault();
        }

        if (newIdx !== focusedIdx) {
            dots[newIdx].focus();
            navigateToProject(newIdx);
        }
    });

    // --- Card Transition ---
    function transitionToProject(newIndex) {
        if (newIndex === currentIndex || newIndex < 0 || newIndex >= projectCount) return;

        window.clearTimeout(transitionTimer);

        const direction = newIndex > currentIndex ? "is-next" : "is-prev";

        if (prefersReducedMotion) {
            currentIndex = newIndex;
            renderCard(currentIndex);
            updateDots(currentIndex);
            featuredCard.style.transform = "";
            featuredCard.classList.remove("is-exiting", "is-entering", "is-next", "is-prev");
            featuredCard.classList.add("is-active");
            return;
        }

        const viewport = featuredCard.parentElement;
        const outgoingCard = featuredCard.cloneNode(true);
        outgoingCard.removeAttribute("id");
        outgoingCard.setAttribute("aria-hidden", "true");
        outgoingCard.classList.remove("is-active", "is-entering", "is-exiting", "is-next", "is-prev");
        outgoingCard.classList.add("featured-card--ghost", "is-exiting", direction);
        outgoingCard.style.transform = "";

        viewport.querySelectorAll(".featured-card--ghost").forEach((ghost) => ghost.remove());
        viewport.appendChild(outgoingCard);

        currentIndex = newIndex;
        renderCard(currentIndex);
        updateDots(currentIndex);

        featuredCard.style.transform = "";
        featuredCard.classList.remove("is-active", "is-exiting", "is-entering", "is-next", "is-prev");

        featuredCard.classList.add("is-entering", direction);
        void featuredCard.offsetHeight;

        requestAnimationFrame(() => {
            outgoingCard.classList.add("is-leaving");
            featuredCard.classList.remove("is-entering");
            featuredCard.classList.add("is-active");
        });

        transitionTimer = window.setTimeout(() => {
            featuredCard.classList.remove("is-next", "is-prev");
            outgoingCard.remove();
        }, 620);
    }

    // --- Scroll Engine ---
    let ticking = false;

    function onScroll() {
        if (!usePinnedScroll) return;
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const spacerRect = scrollSpacer.getBoundingClientRect();
            const spacerTop = -spacerRect.top;
            const scrollableHeight = scrollSpacer.offsetHeight - window.innerHeight;

            if (scrollableHeight <= 0) {
                ticking = false;
                return;
            }

            // Clamp progress 0–1
            const rawProgress = spacerTop / scrollableHeight;
            const progress = Math.max(0, Math.min(1, rawProgress));

            // Update progress bar
            progressBar.style.width = `${progress * 100}%`;

            // Calculate active index
            const newIndex = Math.round(progress * (projectCount - 1));

            if (newIndex !== currentIndex && newIndex >= 0) {
                transitionToProject(newIndex);
            }

            // Parallax on background glow
            if (!prefersReducedMotion && bgGlow) {
                const parallaxX = (progress - 0.5) * 120;
                const parallaxY = (progress - 0.5) * 60;
                bgGlow.style.transform = `translate(calc(-50% + ${parallaxX}px), calc(-50% + ${parallaxY}px))`;
            }

            // Parallax on project image
            if (!prefersReducedMotion) {
                const img = featuredCard.querySelector(".featured-card__image");
                if (img) {
                    const imgParallaxY = (progress - (currentIndex / projectCount)) * -20;
                    img.style.setProperty("--parallax-y", `${imgParallaxY}px`);
                }
            }

            ticking = false;
        });
    }

    // --- Mouse Tilt Effect (Desktop only) ---
    function initTilt() {
        if (prefersReducedMotion || isTouchDevice) return;

        featuredCard.addEventListener("mousemove", (e) => {
            if (featuredCard.classList.contains("is-entering")) return;

            const rect = featuredCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const rotateY = (x - 0.5) * 6;   // ±3 degrees
            const rotateX = (0.5 - y) * 4;    // ±2 degrees

            featuredCard.style.transform =
                `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(0) scale(1)`;
        });

        featuredCard.addEventListener("mouseleave", () => {
            featuredCard.style.transform = "";
        });
    }

    // --- 3D Interactive Background Orbs ---
    function init3DOrbs() {
        if (!usePinnedScroll || isTouchDevice) return;
        const bgContainer = document.querySelector(".featured-cinematic__bg");
        if (!bgContainer) return;

        // Create orbs container
        const orbsWrap = document.createElement("div");
        orbsWrap.className = "featured-3d-orbs";
        orbsWrap.setAttribute("aria-hidden", "true");

        // Orb definitions: variety of sizes, positions, colors, depths
        const orbDefs = [
            // Filled orbs — soft glowing spheres
            { type: "filled", size: 72, x: "10%", y: "18%", color: "rgba(94, 234, 212, 0.24)", depth: 1.9, z: -50, blur: 5, opacity: 0.26, speed: 16 },
            { type: "filled", size: 46, x: "82%", y: "24%", color: "rgba(96, 165, 250, 0.28)", depth: 1.4, z: -30, blur: 3, opacity: 0.3, speed: 20 },
            // Ring orbs — wireframe circles
            { type: "ring", size: 92, x: "74%", y: "13%", color: "rgba(94, 234, 212, 0.16)", depth: 1.2, z: -20, blur: 0, opacity: 0.14, speed: 24 },
            { type: "ring", size: 58, x: "20%", y: "48%", color: "rgba(96, 165, 250, 0.18)", depth: 2.0, z: -45, blur: 0, opacity: 0.12, speed: 22 },
            // Glow orbs — large soft ambient lights
            { type: "glow", size: 150, x: "32%", y: "28%", color: "rgba(94, 234, 212, 0.09)", depth: 0.7, z: -10, blur: 36, opacity: 0.1, speed: 30 },
            { type: "glow", size: 130, x: "70%", y: "64%", color: "rgba(96, 165, 250, 0.08)", depth: 0.6, z: -5, blur: 34, opacity: 0.09, speed: 26 },
        ];

        orbDefs.forEach((def) => {
            const orb = document.createElement("div");
            orb.className = `featured-orb featured-orb--${def.type}`;
            orb.style.cssText = `
                width: ${def.size}px;
                height: ${def.size}px;
                left: ${def.x};
                top: ${def.y};
                background: ${def.color};
                ${def.type === "ring" ? `border-color: ${def.color};` : ""}
                --orb-depth: ${def.depth};
                --orb-z: ${def.z};
                --orb-blur: ${def.blur}px;
                --orb-opacity: ${def.opacity};
                --orb-speed: ${def.speed}s;
            `;
            orbsWrap.appendChild(orb);
        });

        bgContainer.appendChild(orbsWrap);

        // Mouse-driven parallax for orbs
        if (!prefersReducedMotion && !isTouchDevice) {
            const cinematicSection = document.getElementById("featuredCinematic");
            cinematicSection.addEventListener("mousemove", (e) => {
                const rect = cinematicSection.getBoundingClientRect();
                const xRatio = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
                const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

                const parallaxX = xRatio * 40;
                const parallaxY = yRatio * 30;

                orbsWrap.style.setProperty("--orb-parallax-x", parallaxX);
                orbsWrap.style.setProperty("--orb-parallax-y", parallaxY);

                // Apply to each orb individually for depth-based movement
                const orbs = orbsWrap.querySelectorAll(".featured-orb");
                orbs.forEach((orb) => {
                    const depth = parseFloat(orb.style.getPropertyValue("--orb-depth")) || 1;
                    orb.style.setProperty("--orb-parallax-x", parallaxX * depth);
                    orb.style.setProperty("--orb-parallax-y", parallaxY * depth);
                });
            });

            cinematicSection.addEventListener("mouseleave", () => {
                const orbs = orbsWrap.querySelectorAll(".featured-orb");
                orbs.forEach((orb) => {
                    orb.style.setProperty("--orb-parallax-x", 0);
                    orb.style.setProperty("--orb-parallax-y", 0);
                });
            });
        }
    }

    // --- Initialize ---
    renderCard(0);
    generateDots();
    featuredCard.classList.add("is-active");
    init3DOrbs();

    if (usePinnedScroll) {
        window.addEventListener("scroll", onScroll, { passive: true });
    }
    initTilt();

    if (!usePinnedScroll) {
        let touchStartX = 0;

        featuredCard.addEventListener("touchstart", (event) => {
            touchStartX = event.changedTouches[0].clientX;
        }, { passive: true });

        featuredCard.addEventListener("touchend", (event) => {
            const swipeDistance = event.changedTouches[0].clientX - touchStartX;
            if (Math.abs(swipeDistance) < 45) return;

            const nextIndex = swipeDistance < 0
                ? Math.min(currentIndex + 1, projectCount - 1)
                : Math.max(currentIndex - 1, 0);

            transitionToProject(nextIndex);
        }, { passive: true });
    }

    // Run once on load in case page is already scrolled
    onScroll();
}
