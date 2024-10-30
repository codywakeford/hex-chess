<template>
	<div
		class="piece"
		:style="{
			left: `${position[0]}px`,
			bottom: `${position[1]}px`,
		}"
	>
		<img
			:src="imageSrc"
			alt="Game Piece"
		/>
	</div>
</template>

<script setup lang="ts">
const game = useGameStore()
const position = ref([0, 0])

interface Props {
	piece: GamePiece
}
const props = defineProps<Props>()

const imageSrc = ref("")

function getImageSrc(piece: GamePiece) {
	let src = "/"
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
watch(
	() => props.piece,
	(newPiece) => {
		imageSrc.value = getImageSrc(newPiece)
		getPiecePosition(newPiece.boardPosition)
	},
	{ immediate: true },
)

function getPiecePosition(boardPosition: GamePiece["boardPosition"]) {
	const boardPieces = game.boardPieces

	const hex = boardPieces.find((hex) => {
		return hex.boardPosition.x === boardPosition.x && hex.boardPosition.y === boardPosition.y
	})

	if (hex) {
		position.value = hex.position
		return hex.position
	}

	return [0, 0]
}

// onMounted(() => {
// 	getPiecePosition(props.piece.boardPosition)
// })
</script>

<style lang="sass" scoped>
.piece
    position: absolute
    transform: translate(7px, 60px)
    z-index: 10

    img
        position: relative
        z-index: 10
        height: 50px
</style>
