<template>
	<div
		class="hexagon"
		:class="{ selected: props.selected }"
	>
		<div class="hex-piece"></div>
		<div class="hex-piece"></div>
		<div class="hex-piece"></div>
		<div class="piece-name">{{ props.position }}</div>
	</div>
</template>

<script setup lang="ts">
const game = useGameStore()

interface Props {
	color: string
	height: string
	selected: boolean
	position: string
}
const selected = computed(() => {
	return props.selected
})

const boardPiece = computed(() => {
	return game.getBoardPiece(props.position)
})

const props = defineProps<Props>()
console.log(boardPiece.value)
</script>

<style lang="sass" scoped>
.hexagon
    position: absolute

    &.selected
        .hex-piece
            border-top: 2px solid #222
            border-bottom: 2px solid #222
            z-index: 2


    .piece-name
        position: relative
        z-index: 10

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
