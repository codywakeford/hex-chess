<template>
	<div class="hexagon">
		<div class="hex-piece"></div>
		<div class="hex-piece"></div>
		<div class="hex-piece"></div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	color: string
	height: string
}

const props = defineProps<Props>()
</script>

<style lang="sass" scoped>
.hexagon
    position: absolute

    .hex-piece
        position: absolute
        background: v-bind(color)
        height: v-bind(height)
        width: 58px

        &:first-child
            rotate: 120deg

        &:nth-child(2)
            rotate: 240deg
</style>
