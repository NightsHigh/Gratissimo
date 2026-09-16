<template>
    <header class="header">
        <a href="/" >
            <img src="@/assets/logo/logo-white.png" alt="Logo" class="header__logo">
        </a>
    </header>

</template>

<script setup>


</script>

<style scoped lang="scss">
.header {
    background-color: var(--color-accent);
    color: var(--color-accent-text);
    padding: var(--space-4);

    &__logo {
        width:20rem;
        display: block;
        margin-right: auto;
        padding-left: var(--space-8);
    }
}
</style>
