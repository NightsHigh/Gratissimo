<template>
    <Slider v-if="slides.length" :items="slides" :label="label" :interval="5000">
        <template #default="{ item }">
        <div class="testimonives-slider__slide">
            <p class="testimonives-slider__text">{{ item.content }}</p>
            <p class="testimonives-slider__author">{{ item.name }}</p>
        </div>
        </template>
    </Slider>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Slider } from '@/kit'
import { getTestimonies } from '@/api'

const props = defineProps({ label: { type: String, default: 'Udtalelser' } })
const slides = ref([])

onMounted(async () => {
    slides.value = await getTestimonies()
})

const { label } = props
</script>

<style scoped lang="scss">
.testimonives-slider {
    &__slide {
        padding: var(--space-4);
        text-align: center;
        background-color: rgb(179, 255, 0)
    }
}

</style>
