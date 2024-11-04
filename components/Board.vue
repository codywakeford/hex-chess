<template>
	<div class="board-container">
		<div class="board">
			<Hexagon
				v-for="(hex, index) in boardHexes"
				:color="hex.color"
				class="hexagon"
				:position="hex.boardPosition"
				:height="hexHeight"
				:hex="hex"
				:style="{ left: `${hex.position[0]}px`, bottom: `${hex.position[1]}px` }"
			/>

			<Piece
				v-for="piece in gamePieces"
				:piece="piece"
				:height="(hexHeight / 3) * 2"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
const game = useGameStore()

const gamePieces = computed(() => {
	return game.gamePieces
})
const boardHexes = computed(() => {
	return game.boardPieces
})

const hexHeight = computed(() => {
	return props.height / 11
})

const props = defineProps<{
	height: number
}>()

const boardHeight = computed(() => {
	return `${props.height}px`
})

const boardOffset = computed(() => {
	return `${props.height / 4}px`
})

onMounted(async () => {
	initGameBoard(hexHeight.value)
})
</script>

<style lang="sass" scoped>
.board-container
	margin-inline: auto
	position: relative


.board
	position: relative
	height: v-bind(boardHeight)
	width: v-bind(boardHeight)
	bottom: v-bind(boardOffset)
	margin-inline: auto
	user-select: none

.hexagon
	cursor: pointer
</style>
