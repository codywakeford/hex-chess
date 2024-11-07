import { gameInstances } from "../cache"
import { convertGameInstanceForClient } from "../utils"
export default eventHandler(async (event): Promise<TransmissionGameInstance | null> => {
	const gameId = event.context.params?.gameId
	if (!gameId) return null

	const game = gameInstances.get(gameId)

	const transmittableGameInstance = convertGameInstanceForClient(gameId)
	if (game) return transmittableGameInstance

	return null
})
