import { gameInstances } from "../../cache"

export default eventHandler(async (event): Promise<GameInstance | null> => {
	const { player }: { player: Player } = await readBody(event)
	const gameId = event.context.params?.gameId

	if (!gameId) return null
	const game = gameInstances.get(gameId)

	if (game) {
		if (!game.playerTwo) {
			game.playerTwo = player
			game.playerTwo.color != game.playerOne.color
		}
		return game
	}

	return null
})
