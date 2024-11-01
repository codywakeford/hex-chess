import { gameInstances } from "../cache"
export default eventHandler(async (event) => {
	const gameId = event.context.params?.gameId

	if (!gameId) return

	const game = gameInstances.get(gameId)

	if (game) return game

	return undefined
})
