<template>
  <h1 class="hero-name type-display">
    PARTH TIWARI
  </h1>
</template>

<style scoped>
.hero-name {
  max-width: 11ch;
  margin: 0;
  font-size: clamp(3.3rem, 8.5vw, 8rem);
  line-height: 0.88;
  letter-spacing: 0.08em;
  text-shadow:
    0 0 2.6rem rgb(216 234 240 / 0.12),
    0 0 5rem rgb(11 182 214 / 0.08);
}

@media (max-width: 720px) {
  .hero-name {
    font-size: clamp(3rem, 17vw, 5.2rem);
  }
}
</style>
