<template>
	<div>
		<pre>Game ID: {{ game.game.gameId }}</pre>
		<pre>{{ game.game }}</pre>
		<div class="join-game">
			<input
				type="text"
				v-model="gameId"
			/>
			<button @click="game.joinGame(gameId)">Join-Game</button>
			<button>Leave Game</button>
			<button @click="game.restartGame()">Restart Game</button>
		</div>
		<div v-if="game.board.checkState.white !== null">{{ game.board.checkState }}</div>
		<Board :height="boardHeight" />
	</div>
</template>

<script lang="ts" setup>
const game = useGameStore()
const boardHeight = computed(() => {
	return window.innerHeight
})
const gameId = ref("")

onMounted(() => {
	game.init()
})
</script>

<style lang="sass">
html
	background: #333
	color: white
</style>
