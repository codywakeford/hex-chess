<template>
	<div
		class="hexagon"
		:class="{
			selected: highlight === 'selected',
			highlightMove: highlight === 'move',
		}"
	>
		<div class="hex-piece"></div>
		<div class="hex-piece"></div>
		<div class="hex-piece"></div>
		<div class="piece-name">{{ props.position.x }}{{ props.position.y }}</div>
	</div>
</template>

<script setup lang="ts">
const game = useGameStore()

interface Props {
	color: string
	height: string
	position: BoardPosition
}

const highlight = computed(() => {
	return boardPiece.value?.highlight || null
})

const boardPiece = computed(() => {
	return game.getBoardPiece(props.position)
})

const props = defineProps<Props>()
</script>

<style lang="sass" scoped>
.hexagon
    position: absolute

    &.selected
        .hex-piece
            border-top: 2px solid #222
            border-bottom: 2px solid #222
            z-index: 2

    &.highlightMove

        &::before
            content: ""
            height: 10px
            width: 10px
            border-radius: 50%
            background: red
            position: absolute
            top: 46px
            left: 25px
            z-index: 5


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
