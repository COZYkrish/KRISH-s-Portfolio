// document.addEventListener("DOMContentLoaded", () => {
//     const counters = document.querySelectorAll(".stat-number");
//     const filterButtons = document.querySelectorAll(".filter-btn");
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

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
            }
        });
    }, { threshold: 0.16 });

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
});
