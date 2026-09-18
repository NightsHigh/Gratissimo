<template>
    <section v-if="!isLoggedIn"  class="cta">
        <p>Vi hjælper dig på vej til dit næste frivillige job</p>
    <a href="/login">
        <button class="cta__button">Log in eller opret dig</button>
    </a>
</section>
</template>

<script setup>
import { isLoggedIn } from '@/auth'

</script>

<style scoped lang="scss">
.cta {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: var(--font-size-lg);
    font-weight: 200;
    padding-top: var(--space-2);
    padding-bottom: var(--space-2);
    padding: var(--space-2) var(--space-6);
    margin: var(--space-3) 0rem;
    
    &__button {
        text-decoration: none;
        border-radius: var(--radius-pill);
        background-color: var(--color-accent-dark);
        color: var(--color-accent-text);
        padding: var(--space-2) var(--space-8);
        font-size: var(--font-size-l);
        border: none;
        cursor: pointer;
    }
}
</style>