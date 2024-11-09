<template>
	<main>
		<Nav />
		<Board :height="boardHeight" />
		<h3
			v-if="game.game?.playerTwo?.id === 'cpu'"
			class="gameId"
		>
			Game ID: {{ gameId }}
		</h3>

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
		<Title>Gliński's Chess</Title>
		<Meta>
			Play Hex Chess Online, a unique twist on classic chess with a hexagonal board! Challenge
			your strategic skills, explore new moves, and enjoy exciting gameplay with friends or AI
			opponents. Perfect for chess enthusiasts and newcomers alike!" This description is
			clear, includes keywords like "hex chess" and "unique twist on classic chess," and
			appeals to both chess lovers and new players. Let me know if you'd like adjustments for
			a specific audience or style!
		</Meta>
	</Head>
</template>

<script lang="ts" setup>
const game = useGameStore()

const gameId = computed(() => {
	return game.game.gameId
})

const boardHeight = computed(() => {
	if (!import.meta.client) return 500

	const windowWidth = window.innerWidth
	const windowHeight = window.innerHeight

	return windowHeight > windowWidth ? windowWidth : windowHeight - 250
})

const turn = computed(() => {
	return game.board.turn
})
onMounted(() => {
	game.init()
})
</script>

<style lang="sass">
html
	background: #161512
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

.gameId
	position: absolute
	top: 75px
	right: 25px
</style>
