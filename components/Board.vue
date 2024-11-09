<template>
	<div class="board-container">
		<div class="board">
			<Hexagon
				v-for="hexId in hexIds"
				class="hexagon"
				:height="hexHeight"
				:hexId="hexId"
				:class="{ flip: playerColor === 'black' }"
			/>

			<Piece
				v-for="pieceId in gamePieceIds"
				:pieceId="pieceId"
				:height="(hexHeight / 3) * 2"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
const game = useGameStore()

const playerColor = computed(() => {
	if (!game.player.color) return "black"

	return game.player.color
})

const gamePieceIds = computed(() => {
	return Array.from(game.board.gamePieces.keys())
})

const hexIds = computed(() => {
	return Array.from(game.board.boardPieces.keys())
})

const hexHeight = computed(() => {
	return Math.ceil(props.height) / 11
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
