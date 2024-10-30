<template>
	<div class="board">
		<Hexagon
			v-for="(hex, index) in boardHexes"
			:color="hex.color"
			class="hexagon"
			:position="hex.boardPosition"
			:height="hexHeight"
			:style="{ left: `${hex.position[0]}px`, bottom: `${hex.position[1]}px` }"
			@click="selectBoardPiece(hex)"
		/>

		<Piece
			v-for="piece in gamePieces"
			:piece="piece"
			:position="getPiecePosition(piece.boardPosition)"
		/>
	</div>
</template>

<script setup lang="ts">
const game = useGameStore()
const colors = ["#999", "#666", "#444"]
const colors1 = ["#d18b47", "#e8ab6f", "#ffce9e"]

const gamePieces = computed(() => {
	return game.getGamePieces
})
const boardHexes = computed(() => {
	return game.getBoardPieces
})

const selectedColors = ref(colors1)
const letters = "abcdefghijkl"

const hexHeight = "100px"
const hexHeightValue = parseInt(hexHeight)
const hexWidth = Math.sqrt(3) * (100 / 2) - 1

function selectBoardPiece(boardPiece: HexBoardPiece) {
	game.selectBoardPiece(boardPiece)
}

const props = defineProps<{}>()

function getPiecePosition(positionName: GamePiece["boardPosition"]) {
	console.log(positionName)
	const hex = boardHexes.value.find((hex) => {
		return hex.boardPosition === positionName
	})
	console.log(hex)

	if (hex) {
		return hex.position
	}

	return [0, 0]
}

onMounted(async () => {
	initGameBoard()
})
</script>

<style lang="sass" scoped>
.board
	position: relative
	top: 1000px

.hexagon
	cursor: pointer
</style>
