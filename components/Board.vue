<template>
	<div class="board">
		<Hexagon
			v-for="(hex, index) in boardHexes"
			:color="hex.color"
			class="hexagon"
			:position="hex.boardPosition"
			:height="hexHeight"
			:style="{ left: `${hex.position[0]}px`, bottom: `${hex.position[1]}px` }"
			@click="handleHexClick(hex)"
		/>

		<Piece
			class="piece"
			v-for="piece in gamePieces"
			:piece="piece"
			:height="(hexHeight / 3) * 2"
		/>
	</div>
</template>

<script setup lang="ts">
const game = useGameStore()
const colors = ["#999", "#666", "#444"]
const colors1 = ["#d18b47", "#e8ab6f", "#ffce9e"]

const gamePieces = computed(() => {
	return game.gamePieces
})
const boardHexes = computed(() => {
	return game.boardPieces
})

function handleHexClick(hex: HexBoardPiece) {
	if (hex.highlight === "move" || hex.highlight === "attack") {
		game.movePiece(hex.boardPosition)
		return
	}

	selectBoardPiece(hex)
}

const selectedColors = ref(colors1)
const letters = "abcdefghijkl"

const hexHeight = computed(() => {
	// return 250
	return props.height / 11
})

function selectBoardPiece(boardPiece: HexBoardPiece) {
	game.selectBoardPiece(boardPiece)
}

const props = defineProps<{
	height: number
}>()

const boardHeight = computed(() => {
	return `${props.height}px`
})

onMounted(async () => {
	initGameBoard(hexHeight.value)
})
</script>

<style lang="sass" scoped>
.board
	position: relative
	height: v-bind(boardHeight)
	width: 100%
	margin-inline: auto

.hexagon
	cursor: pointer
</style>
