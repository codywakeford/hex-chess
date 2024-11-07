<template>
	<main>
		<h1>Gliński's Chess</h1>

		<h5>Game ID: {{ game.game.gameId }}</h5>
		<pre>{{ player }}</pre>
		<pre>Turn:{{ turn }}</pre>
		<Board :height="boardHeight" />

		<div class="control-panel">
			<button @click="game.leaveGame(), game.init()">Leave Game</button>
			<button @click="restart()">Restart Game</button>
			<div class="join-game">
				<button @click="game.joinGame(gameId)">Join-Game</button>
				<div class="join-game">
					<input
						placeholder="Enter a game ID to join."
						type="text"
						v-model="gameId"
					/>
				</div>
			</div>
		</div>
		<select
			name="colorWave"
			id="colorWave"
			@input="updateColor()"
			v-model="selectedColors"
		>
			<option
				v-for="(value, name) in colorWaves"
				:value="value"
			>
				{{ name }}
			</option>
		</select>
		<p class="source-code">
			This is an open source project. Find the source code
			<nuxt-link
				to="https://github.com/codywakeford/hex-chess.git"
				target="_blank"
				>Here</nuxt-link
			>
		</p>
	</main>
	<Head>
		<Title>Hex Chess</Title>
		<Meta>
			Play Hex Chess, a unique twist on classic chess with a hexagonal board! Challenge your
			strategic skills, explore new moves, and enjoy exciting gameplay with friends or AI
			opponents. Perfect for chess enthusiasts and newcomers alike!" This description is
			clear, includes keywords like "hex chess" and "unique twist on classic chess," and
			appeals to both chess lovers and new players. Let me know if you'd like adjustments for
			a specific audience or style!
		</Meta>
	</Head>
</template>

<script lang="ts" setup>
import { colorWaves } from "./composables/colorWaves"

const game = useGameStore()
const selectedColors = ref([])

function updateColor() {
	game.selectedColors = selectedColors.value
}

const player = computed(() => {
	return game.player
})

async function restart() {
	await game.restartGame()
}

const boardHeight = computed(() => {
	if (!import.meta.client) return 500

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
	// height: 100vh


main
	width: 100%
	// height: 100vh
	padding-bottom: 100px
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
