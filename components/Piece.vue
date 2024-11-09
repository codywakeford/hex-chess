<template>
	<div
		v-if="piece && piece.alive"
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

const props = defineProps<{ pieceId: string; height: number }>()

const imageSrc = ref("")

const piece = computed(() => {
	return game.board.gamePieces.get(props.pieceId)
})

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
	() => piece.value?.boardPosition,
	(boardPosition) => {
		if (!boardPosition) return
		getPiecePosition(boardPosition)
	},
	{ deep: true, immediate: true },
)

watch(
	() => piece.value?.type,
	(newType) => {
		if (!newType || !piece.value) return
		imageSrc.value = getImageSrc(newType, piece.value.color)
	},
	{ immediate: true },
)

function getPiecePosition(boardPosition: GamePiece["boardPosition"]) {
	if (!boardPosition) return

	const hex = game.board.boardPieces.get(stringPos(boardPosition))

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
    opacity: 0.2

    img
        position: relative
        height: v-bind(imageHeight)
        top: v-bind(offsetTop)
        left: v-bind(offsetLeft)
</style>
