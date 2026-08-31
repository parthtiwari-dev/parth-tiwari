const query = new URLSearchParams(window.location.search);
if (query.get("motion") === "reduce") document.documentElement.dataset.motion = "reduce";

const world = document.querySelector("[data-world]");
const scenes = [...document.querySelectorAll("[data-scene]")];
const progress = document.querySelector("[data-world-progress]");
const count = document.querySelector("[data-scene-count]");
const label = document.querySelector("[data-scene-label]");
const concept = document.querySelector(".concept-image");

if (world && scenes.length && progress && count && label && concept) {
  let activeIndex = 0;
  let lastFrame = 0;
  let ticking = false;

  const setActiveScene = (nextIndex) => {
    activeIndex = nextIndex;
    scenes.forEach((scene, index) => scene.classList.toggle("is-active", index === nextIndex));

    const active = scenes[nextIndex];
    document.body.dataset.focus = active.dataset.focus ?? "script";
    count.textContent = `${String(nextIndex + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;
    label.textContent = active.dataset.scene ?? "";
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const index = scenes.indexOf(visible.target);
      if (index >= 0 && index !== activeIndex) setActiveScene(index);
    },
    { rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.1, 0.5] },
  );

  scenes.forEach((scene) => observer.observe(scene));
  setActiveScene(0);

  const updateScroll = (time) => {
    ticking = false;
    if (time - lastFrame < 32) return;
    lastFrame = time;

    const start = world.offsetTop;
    const distance = Math.max(1, world.offsetHeight - window.innerHeight);
    const worldProgress = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
    progress.style.transform = `scaleX(${worldProgress})`;

    const travel = window.matchMedia("(max-width: 820px)").matches ? -76 : -92;
    const offset = 26 + worldProgress * travel;
    concept.style.setProperty("--loom-y", `${offset}vh`);
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScroll);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  requestUpdate();
}
