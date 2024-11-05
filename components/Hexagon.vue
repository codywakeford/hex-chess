<template>
	<div
		class="hexagon"
		:class="{
			selected: highlight === 'selected',
			highlightMove: highlight === 'move',
			attack: highlight === 'attack',
		}"
		:style="{ left: `${hex?.position[0]}px`, bottom: `${hex?.position[1]}px` }"
	>
		<div
			class="hex-piece"
			@click="handleHexClick(hex)"
		/>
		<div
			class="hex-piece"
			@click="handleHexClick(hex)"
		/>
		<div
			class="hex-piece"
			@click="handleHexClick(hex)"
		/>
		<div class="piece-name">{{ hex.boardPosition.x }}{{ hex.boardPosition.y }}</div>
	</div>
</template>

<script setup lang="ts">
const game = useGameStore()

function selectBoardPiece(boardPiece: BoardPiece) {
	game.selectBoardPiece(boardPiece)
}

const selectedColors = computed(() => {
	return game.selectedColors
})

interface Props {
	height: number
	hexId: string
}

const hex = computed(() => {
	const hex = game.board.boardPieces.get(props.hexId)

	if (!hex) {
		throw new Error("Hex piece not found")
	}

	return hex
})

async function handleHexClick(hex: BoardPiece) {
	if (hex.highlight === "move" || hex.highlight === "attack") {
		await game.movePiece(hex.boardPosition)
		return
	}

	selectBoardPiece(hex)
}

const highlight = computed(() => {
	return hex.value?.highlight || null
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

const color = computed(() => {
	return selectedColors.value[hex.value.colorIndex]
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
