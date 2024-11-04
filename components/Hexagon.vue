<template>
	<div
		class="hexagon"
		:class="{
			selected: highlight === 'selected',
			highlightMove: highlight === 'move',
			attack: highlight === 'attack',
		}"
	>
		<div
			class="hex-piece"
			@click="handleHexClick(props.hex)"
		/>
		<div
			class="hex-piece"
			@click="handleHexClick(props.hex)"
		/>
		<div
			class="hex-piece"
			@click="handleHexClick(props.hex)"
		/>
		<div class="piece-name">{{ props.position.x }}{{ props.position.y }}</div>
	</div>
</template>

<script setup lang="ts">
const game = useGameStore()

function selectBoardPiece(boardPiece: HexBoardPiece) {
	game.selectBoardPiece(boardPiece)
}

interface Props {
	color: string
	height: number
	position: BoardPosition
	hex: HexBoardPiece
}

async function handleHexClick(hex: HexBoardPiece) {
	if (hex.highlight === "move" || hex.highlight === "attack") {
		await game.movePiece(hex.boardPosition)
		return
	}

	selectBoardPiece(props.hex)
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
	return `${(2 / Math.sqrt(3)) * (props.height / 2) * 1.45}px`
})

const halfHeight = computed(() => {
	return `${props.height / 1.73}px`
})

const offsetTop = computed(() => {
	return `${props.height / 2.2}px`
})

const offsetLeft = computed(() => {
	return `${props.height / 4.1}px`
})

const props = defineProps<Props>()
</script>

<style lang="sass" scoped>
.hexagon
    position: absolute
    color: #222


    &.selected
        .hex-piece
            border-top: 2px solid #222
            border-bottom: 2px solid #222
            z-index: 10

    &.highlightMove
        &::before
            content: ""
            height: 10px
            width: 10px
            border-radius: 50%
            background: red
            position: absolute
            top: v-bind(offsetTop)
            left: v-bind(offsetLeft)
            z-index: 50

    &.attack
        .hex-piece
            border-top: 2px solid red
            border-bottom: 2px solid red
            z-index: 50

    .piece-name
        position: relative
        z-index: 100
        margin-top: 5px
        font-size: 0.9rem
    .hex-piece
        position: absolute
        background: v-bind(color)
        height: v-bind(hexHeight)
        width: v-bind(halfHeight)

        &::before
            content: ""
            position: absolute
            height: 100%
            width: 100%
            z-index: 50


        &:first-child
            rotate: 120deg
            &::before
                content: ""
                position: absolute
                height: 100%
                width: 100%
                z-index: 50

                rotate: 120deg

        &:nth-child(2)
            rotate: 240deg


            &::before
                rotate: 240deg
                content: ""
                position: absolute
                height: 100%
                width: 100%
                z-index: 50
</style>
