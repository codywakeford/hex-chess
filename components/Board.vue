<template>
	<div
		id="board"
		class="board"
	>
		<img
			id="boardImage"
			class="board-image"
			src="../assets/hexboard.svg"
		/>

		<div
			class="piece"
			:style="{
				left: `${piece.position[0]}px`,
				bottom: `${piece.position[1]}px`,
			}"
			v-for="piece in pieces"
		>
			<img
				:src="getImageSrc(piece)"
				:style="{ width: pieceSize }"
			/>
		</div>
	</div>

	{{ hexHeight }}
</template>

<script setup lang="ts">
const hexHeight = ref(0)
const hexWidth = ref(0)

const pieceSize = computed(() => {
	return `${hexWidth.value / 2.5}px`
})

const gamePieces = ref<GamePiece[]>([])

interface Props {
	pieces: GamePiece[]
}

function getImageSrc(piece: GamePiece) {
	let src = ""

	switch (piece.color) {
		case "black":
			src += "black-"
			break

		case "white":
			src += "white-"
			break
	}

	src += piece.type
	src += ".png"

	return src
}

const props = defineProps<Props>()

// watch(props.pieces, (newValue) => renderPieces(newValue))

function getBoardSize() {
	const board = document.getElementById("boardImage")

	console.log("hello")

	if (!board) {
		console.log("Board not found")
		return
	}

	const boardHeight = board.clientHeight
	const boardWidth = board.clientWidth

	hexHeight.value = boardHeight / 11
	console.log(hexHeight.value)
	/**
	 * 11 hexagons wide. Overlap is hexHeight / 4 (proof in readme.md)
	 * On the board there are 6 full width hexagons (ones that dont have overlap)
	 * And there are 5 half with hexagons. - 1/4 hexWidth * 2 * 5hexwidth - This is the overlap
	 * This leaves 8.5 fullwidth hexagons accross X
	 *
	 */
	hexWidth.value = boardWidth / 11.35
}

function getYPos(y: number) {
	return (hexHeight.value / 2) * y
}

function getXPos(x: number) {
	return hexWidth.value * x - hexWidth.value / 2
}

function renderPieces(pieces: GamePiece[]) {
	pieces.forEach((piece) => {
		piece.position[0] = getXPos(piece.position[0])
		piece.position[1] = getYPos(piece.position[1])

		gamePieces.value.push(piece)
	})
}
onMounted(() => {
	setTimeout(() => {
		getBoardSize()
		renderPieces(props.pieces)
	}, 2000)
})
</script>

<style lang="sass" scoped>
.board
    position: relative
    width: min-content

.board-image
    margin-top: 10px
    height: 95vh

.piece
    position: absolute
    cursor: pointer



    img
        transform: translateY(50%)
</style>
