<template>
	<div>
		<!-- <Board :pieces="pieces" /> -->
		<BoardNew />
		<!-- <pre>{{ pieces }}</pre> -->
	</div>
</template>

<script lang="ts" setup>
const response = ref()

const pieces = computed(() => {
	if (response.value && response.value.gameData) {
		return response.value.gameData.pieces
	}

	return []
})

async function initGame() {
	const { data } = await useFetch("/api/create-game", {
		method: "post",
	})

	response.value = data.value
}

initGame()

function plotPieces() {}
</script>

<style lang="sass"></style>
