<template>
    <section class="cta">
        <p>Vi hjælper dig på vej til dit næste frivillige job</p>
    <a href="/login">
        <button class="cta__button">Log in eller opret dig</button>
    </a>
</section>
</template>

<script setup>


</script>

<style scoped lang="scss">
.cta {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: var(--font-size-l);
    padding-top: var(--space-2);
    padding-bottom: var(--space-2);
    padding: var(--space-2) var(--space-6);
    &__button {
        text-decoration: none;
        border-radius: var(--radius-pill);
        background-color: var(--color-accent-dark);
        color: var(--color-accent-text);
        padding: var(--space-2) var(--space-6);
        font-size: var(--font-size-l);
        border: none;
        cursor: pointer;
    }
}
</style>
