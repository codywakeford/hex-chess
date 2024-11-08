<template>
	<nav>
		<h3 class="left">GameID:{{ gameId }}</h3>
		<div class="center">
			<h1>Gliński's Chess</h1>
		</div>
		<div class="right">
			<button @click="game.leaveGame(), game.init()">Leave Game</button>
			<button @click="restart()">Restart Game</button>
			<div class="join-game">
				<button @click="game.joinGame(gameId), (gameIdInput = '')">Join-Game</button>
				<div class="join-game">
					<input
						placeholder="Enter a game ID to join."
						type="text"
						v-model="gameIdInput"
					/>
				</div>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
const game = useGameStore()
const gameIdInput = ref("")
async function restart() {
	await game.restartGame()
}
const playerColor = computed(() => {
	return game.player.color
})
const gameId = computed(() => {
	return game.game.gameId
})
</script>

<style lang="sass" scoped>
nav
    margin-inline: auto
    max-width: 1400px
    width: 100%
    display: flex
    align-items: center
    justify-content: space-between
    gap: 25px
    height: 75px
    position: relative
    margin-bottom: 50px
    z-index: 1000

    .center
        position: absolute
        left: 50%
        top: 35%
        transform: translate(-50%, -50%)

        h1
            font-size: 2.5rem
.right
    display: flex
    gap: 5px
.join-game
    display: flex
    gap: 5px
</style>
