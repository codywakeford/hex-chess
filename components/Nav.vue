<template>
	<nav>
		<div class="logo-box">
			<img
				src="/logo.png"
				alt="Game logo"
			/>
			<h1 @click="toggleGameType()">{{ logoTitle }} Chess</h1>
		</div>

		<div class="right">
			<button @click="game.leaveGame(), game.init()">Leave Game</button>
			<button @click="restart()">Restart Game</button>
			<div class="join-game">
				<button @click="game.joinGame(gameIdInput), (gameIdInput = '')">Join-Game</button>
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

function toggleGameType() {
	const index = gameTypes.indexOf(game.gameType)

	if (index === gameTypes.length - 1) {
		game.gameType = gameTypes[0]
	} else {
		// Otherwise, move to the next game type
		game.gameType = gameTypes[index + 1]
	}
}

const logoTitle = computed(() => {
	if (game.gameType === "glinsky") return "Gliński's"
	if (game.gameType === "mcCooey") return "McCooey's"
})
const gameType = computed(() => {
	return game.gameType
})
const gameTypes: GameType[] = ["glinsky", "mcCooey"]
</script>

<style lang="sass" scoped>
$offwhite: rgb(205, 205, 205)

nav
    padding: 10px 15px
    margin-inline: auto
    max-width: 1400px
    width: 100%
    display: flex
    align-items: center
    justify-content: space-between
    gap: 25px
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

button
    background: transparent
    box-shadow: none
    border: none
    font-size: 1rem
    color: $offwhite
    cursor: pointer
    padding: 3px 10px
    border-radius: 5px
    transition: background 0.3s

    &:hover
        background: rgba(255, 255, 255, 0.06)

.logo-box
    display: flex
    gap: 15px
    align-items: center

    img
        width: 55px

    h1
        font-weight: 200
        font-size: 2rem
        margin: 0
        opacity: 0.8
        cursor: pointer

input
    outline: none
    border: 1px solid $offwhite
    border-radius: 25px
    padding: 5px 15px
    margin-left: 10px
    color: $offwhite
    background: transparent

.right
    display: flex
    gap: 15px

.join-game
    display: flex
    gap: 5px
</style>
