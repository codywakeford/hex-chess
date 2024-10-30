<template>
	<div
		class="piece"
		:style="{
			left: `${props.position[0]}px`,
			bottom: `${props.position[1]}px`,
		}"
	>
		<img
			:src="imageSrc"
			alt="Game Piece"
		/>
	</div>
</template>

<script setup lang="ts">
interface Props {
	piece: GamePiece

	/**Position in px */
	position: number[]
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
	},
	{ immediate: true }, // Ensures it runs immediately on mount
)
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
