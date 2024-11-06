<template>
	<main>
		<h1>Gliński's Chess</h1>

		<h5>Game ID: {{ game.game.gameId }}</h5>
		<pre>Player: {{ game.player.color }}</pre>
		<pre>Turn:{{ turn }}</pre>
		<Board :height="boardHeight" />

		<div class="control-panel">
			<button @click="game.leaveGame">Leave Game</button>
			<button @click="restart()">Restart Game</button>
			<div class="join-game">
				<button @click="game.getGame(gameId, false)">Join-Game</button>
				<div class="join-game">
					<input
						placeholder="Enter a game ID to join."
						type="text"
						v-model="gameId"
					/>
				</div>
			</div>

			<button @click="game.selectedColors = classicBoard">Change color</button>
			<button @click="game.selectedColors = classicBoard">grey color</button>
		</div>

		<p class="source-code">
			This is an open source project. Find the source code
			<nuxt-link
				to="https://github.com/codywakeford/hex-chess.git"
				target="_blank"
				>Here</nuxt-link
			>
		</p>
	</main>
</template>

<script lang="ts" setup>
const game = useGameStore()

async function restart() {
	await game.restartGame()
}

const boardHeight = computed(() => {
	const windowWidth = window.innerWidth
	const windowHeight = window.innerHeight

	return windowHeight > windowWidth ? windowWidth : windowHeight - 300
})

const gameId = ref("")
const turn = computed(() => {
	return game.board.turn
})
onMounted(() => {
	game.init()
})
</script>

<style lang="sass">
html
	background: #333
	color: white
	height: 100vh

main
	width: 100%
	height: 100vh
	align-items: center
	display: flex
	flex-direction: column

	h1
		margin-inline: auto
		width: 100%
		text-align: center
		font-size: 3rem
		margin-block: 25px 10px

	h5
		position: relative
		margin-inline: auto
		width: 100%
		text-align: center
		font-size: 1.25rem
		margin-block: 10px 25px
		z-index: 100

.control-panel
	display: flex
	gap: 15px
	margin-inline: auto
	margin-top: 35px

	.join-game
		display: flex
		gap: 5px

.source-code
	position: fixed
	bottom: 0
</style>
