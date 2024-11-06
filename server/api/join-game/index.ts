import { convertGameInstanceForClient } from "~/server/utils"
import { gameInstances } from "../../cache"

export default eventHandler(async (event): Promise<TransmissionGameInstance | null> => {
	const { player }: { player: Player } = await readBody(event)

	const gameId = event.context.params?.gameId
	if (!gameId) return null // no game found

	const game = gameInstances.get(gameId) as GameInstance
	const transmittableGameInstance = convertGameInstanceForClient(gameId)

	console.log(transmittableGameInstance)

	if (game) {
		if (!game.playerTwo) {
			game.playerTwo = player
			game.playerTwo.color != game.playerOne.color
			return transmittableGameInstance
		} else {
			return null // cant join someone is already in the session
		}
	}

	return null // no game found
})
