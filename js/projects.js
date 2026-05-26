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
    let featuredCard = document.getElementById("featuredCard");
    const dotsContainer = document.getElementById("featuredDots");
    const progressBar = document.getElementById("featuredProgressBar");
    const bgGlow = document.querySelector(".featured-bg-glow");
    const viewport = featuredCard.parentElement;

    if (!scrollSpacer || !featuredCard || !dotsContainer || !progressBar || !viewport) return;

    const projectCount = featuredProjects.length;
    let currentIndex = 0;
    let transitionTimer = null;
    let featuredCards = [];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const mobileQuery = window.matchMedia("(max-width: 600px)");
    const useMobileRail = mobileQuery.matches;
    const usePinnedScroll = !useMobileRail;
    const useLightMotion = prefersReducedMotion;
    const useHeavyScrollEffects = !mobileQuery.matches && !prefersReducedMotion;

    featuredProjects.forEach((project) => {
        const img = new Image();
        img.src = project.image;
    });

    function getCardMarkup(project, index, extraClasses = "", attributes = "") {
        return `
            <article class="featured-card ${extraClasses}" data-featured-index="${index}" aria-label="${project.name}" ${attributes}>
                <div class="featured-card__glass-highlight"></div>
                <div class="featured-card__counter">${index + 1} / ${projectCount}</div>
                <div class="featured-card__image-wrap">
                    <img
                        class="featured-card__image"
                        src="${project.image}"
                        alt="${project.imageAlt}"
                        loading="${index === 0 ? "eager" : "lazy"}"
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
            </article>
        `;
    }

    function renderDesktopDeck() {
        viewport.innerHTML = featuredProjects
            .map((project, index) => getCardMarkup(
                project,
                index,
                index === 0 ? "is-active" : "is-exiting",
                index === 0 ? 'role="region" aria-live="polite"' : 'aria-hidden="true"'
            ))
            .join("");
        featuredCards = Array.from(viewport.querySelectorAll(".featured-card"));
        featuredCard = featuredCards[0];
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

    function renderMobileRail() {
        viewport.innerHTML = featuredProjects
            .map((project, index) => getCardMarkup(project, index, "is-active"))
            .join("");
        featuredCards = Array.from(viewport.querySelectorAll(".featured-card"));
        featuredCard = featuredCards[0];
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
            const targetCard = viewport.querySelector(`[data-featured-index="${targetIndex}"]`);
            targetCard?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
            currentIndex = targetIndex;
            updateDots(currentIndex);
            return;
        }

        const spacerRect = scrollSpacer.getBoundingClientRect();
        const spacerTop = window.scrollY + spacerRect.top;
        const scrollableHeight = scrollSpacer.offsetHeight - window.innerHeight;
        const targetProgress = projectCount > 1 ? targetIndex / (projectCount - 1) : 0;
        const targetScroll = spacerTop + targetProgress * scrollableHeight + 10;

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

        if (useLightMotion) {
            const previousCard = featuredCards[currentIndex];
            const nextCard = featuredCards[newIndex];
            previousCard?.classList.remove("is-active", "is-entering", "is-next", "is-prev");
            previousCard?.classList.add("is-exiting");
            previousCard?.setAttribute("aria-hidden", "true");
            currentIndex = newIndex;
            if (nextCard) {
                featuredCard = nextCard;
                featuredCard.classList.remove("is-exiting", "is-entering", "is-next", "is-prev");
                featuredCard.classList.add("is-active");
                featuredCard.removeAttribute("aria-hidden");
                featuredCard.setAttribute("role", "region");
                featuredCard.setAttribute("aria-live", "polite");
            }
            updateDots(currentIndex);
            featuredCard.style.transform = "";
            return;
        }

        const previousCard = featuredCards[currentIndex];
        const nextCard = featuredCards[newIndex];
        if (!previousCard || !nextCard) return;

        previousCard.classList.remove("is-active", "is-entering", "is-next", "is-prev");
        previousCard.classList.add("is-exiting", direction);
        previousCard.setAttribute("aria-hidden", "true");
        previousCard.removeAttribute("role");
        previousCard.removeAttribute("aria-live");

        currentIndex = newIndex;
        updateDots(currentIndex);

        featuredCard = nextCard;
        featuredCard.style.transform = "";
        featuredCard.classList.remove("is-active", "is-exiting", "is-next", "is-prev");
        featuredCard.removeAttribute("aria-hidden");
        featuredCard.setAttribute("role", "region");
        featuredCard.setAttribute("aria-live", "polite");

        featuredCard.classList.add("is-entering", direction);
        void featuredCard.offsetHeight;

        requestAnimationFrame(() => {
            featuredCard.classList.remove("is-entering");
            featuredCard.classList.add("is-active");
        });

        transitionTimer = window.setTimeout(() => {
            previousCard.classList.remove("is-next", "is-prev");
            featuredCard.classList.remove("is-next", "is-prev");
        }, 420);
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
            if (useHeavyScrollEffects && bgGlow) {
                const parallaxX = (progress - 0.5) * 120;
                const parallaxY = (progress - 0.5) * 60;
                bgGlow.style.transform = `translate(calc(-50% + ${parallaxX}px), calc(-50% + ${parallaxY}px))`;
            }

            // Parallax on project image
            if (useHeavyScrollEffects) {
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
        if (!useHeavyScrollEffects || isTouchDevice) return;

        viewport.addEventListener("mousemove", (e) => {
            const activeCard = featuredCards[currentIndex] || featuredCard;
            if (!activeCard || activeCard.classList.contains("is-entering")) return;

            const rect = activeCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const rotateY = (x - 0.5) * 6;   // ±3 degrees
            const rotateX = (0.5 - y) * 4;    // ±2 degrees

            activeCard.style.transform =
                `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(0) scale(1)`;
        });

        viewport.addEventListener("mouseleave", () => {
            const activeCard = featuredCards[currentIndex] || featuredCard;
            if (activeCard) activeCard.style.transform = "";
        });
    }

    // --- 3D Interactive Background Orbs ---
    function init3DOrbs() {
        if (!usePinnedScroll || !useHeavyScrollEffects || isTouchDevice) return;
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
    generateDots();
    if (useMobileRail) {
        renderMobileRail();

        const mobileCards = Array.from(viewport.querySelectorAll(".featured-card"));
        const mobileRailObserver = new IntersectionObserver((entries) => {
            const visibleEntry = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!visibleEntry) return;

            currentIndex = Number(visibleEntry.target.dataset.featuredIndex || "0");
            updateDots(currentIndex);
        }, {
            root: viewport,
            threshold: [0.55, 0.75]
        });

        mobileCards.forEach((card) => mobileRailObserver.observe(card));
        updateDots(0);
    } else {
        renderDesktopDeck();
        init3DOrbs();
    }

    if (usePinnedScroll) {
        window.addEventListener("scroll", onScroll, { passive: true });
    }
    initTilt();

    // Run once on load in case page is already scrolled
    onScroll();
}
