<template>
	<div
		v-if="props.piece.alive"
		class="piece"
		:style="{
			left: `${left}px`,
			bottom: `${bottom}px`,
			transition: 'left 0.3s bottom 0.3s',
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

// Positions

const left = computed(() => {
	return position.value[0]
})

const bottom = computed(() => {
	return position.value[1]
})

const props = defineProps<{ piece: GamePiece }>()

const imageSrc = ref("")

function getImageSrc(type: GamePiece["type"], color: GamePieceColor) {
	let src = "/"
	switch (color) {
		case "black":
			src += "black-"
			break

		case "white":
			src += "white-"
			break
	}

	src += type
	src += ".png"

	return src
}
watch(
	() => props.piece.boardPosition,
	(newBoardPosition) => {
		getPiecePosition(newBoardPosition)
	},
	{ immediate: true },
)

watch(
	() => props.piece.type,
	(newType) => {
		imageSrc.value = getImageSrc(newType, props.piece.color)
	},
	{ immediate: true },
)

function getPiecePosition(boardPosition: GamePiece["boardPosition"]) {
	const boardPieces = game.boardPieces
	if (!boardPosition) return

	const hex = boardPieces.find((hex) => {
		return (
			hex.boardPosition &&
			hex.boardPosition.x === boardPosition.x &&
			hex.boardPosition.y === boardPosition.y
		)
	})

	if (hex) {
		if (position.value[0] !== hex.position[0] || position.value[1] !== hex.position[1]) {
			position.value = hex.position
		}
	}
}
</script>

<style lang="sass" scoped>
.piece
    position: absolute
    transform: translate(7px, 60px)
    z-index: 10
    transition: left 0.15s, bottom 0.15s

    img
        position: relative
        z-index: 10
        height: 50px
</style>
