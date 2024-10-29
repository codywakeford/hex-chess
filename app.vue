<template>
	<div>
		<Board />
	</div>
</template>

<script lang="ts" setup>
const game = useGameStore()

onMounted(() => {
	game.init()
})
</script>

<style lang="sass"></style>
