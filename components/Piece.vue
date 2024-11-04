<template>
	<div
		v-if="props.piece.alive"
		class="piece"
		:style="{
			left: `${left}px`,
			bottom: `${bottom}px`,
		}"
	>
		<img
			:src="imageSrc"
			alt="Game Piece"
			:height="props.height"
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

const props = defineProps<{ piece: GamePiece; height: number }>()

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

const offsetTop = computed(() => {
	return `${props.height}px`
})

const offsetLeft = computed(() => {
	return `-${props.height / 12}px`
})

const imageHeight = computed(() => {
	return `${props.height}px`
})
</script>

<style lang="sass" scoped>
.piece
    position: absolute
    z-index: 1000
    transition: left 0.15s, bottom 0.15s
    pointer-events: none

    img
        position: relative
        height: v-bind(imageHeight)
        top: v-bind(offsetTop)
        left: v-bind(offsetLeft)
</style>
