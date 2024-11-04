<template>
	<div
		class="hexagon"
		:class="{
			selected: highlight === 'selected',
			highlightMove: highlight === 'move',
			attack: highlight === 'attack',
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
	height: number
	position: BoardPosition
}

const highlight = computed(() => {
	return boardPiece.value?.highlight || null
})

const boardPiece = computed(() => {
	return game.getBoardPiece(props.position)
})

const hexHeight = computed(() => {
	return `${props.height}px`
})

const hexWidth = computed(() => {
	return `${(2 / Math.sqrt(3)) * (props.height / 2) * 1.48}px`
})

const halfHeight = computed(() => {
	return `${props.height / 1.73}px`
})

const props = defineProps<Props>()
</script>

<style lang="sass" scoped>
.hexagon
    position: absolute
    color: #222

    &::before
        content: ""
        position: absolute
        height: v-bind(hexHeight)
        width: v-bind(hexWidth)
        left: -15px
        z-index: 50

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

    &.attack
        .hex-piece
            border-top: 2px solid red
            border-bottom: 2px solid red
            z-index: 2

    .piece-name
        position: relative
        z-index: 10

    .hex-piece
        position: absolute
        background: v-bind(color)
        height: v-bind(hexHeight)
        width: v-bind(halfHeight)

        &:first-child
            rotate: 120deg

        &:nth-child(2)
            rotate: 240deg
</style>
