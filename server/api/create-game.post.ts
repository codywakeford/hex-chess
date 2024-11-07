/**
 * This is going to give the player an id and send it to them for tracking
 *
 *
 * It will create a game instance in server memory
 * This instance will hold all of the piece states
 * it will hold the ids of both players
 * number of players in game
 * other data ...
 *
 *
 * it will add a random 'join string' to an array in the memory
 * this will allow others to reference the game
 *
 */

import { startingPieces } from "../hardData"
import { initGameMap } from "../utils"

export default eventHandler(async (event) => {
	const { gameId, playerId } = await readBody(event)

	if (!gameId || !playerId) throw new Error("gameId | playerId not found.")

	const boardState: TransmissionBoardState = {
		gamePieces: structuredClone(startingPieces),
		selectedBoardPiece: null,
		boardPieces: [] as BoardPiece[],
		checkState: { white: null, black: null },
		latestMoves: {
			white: {
				to: null,
				from: null,
			},
			black: {
				to: null,
				from: null,
			},
		},
		turn: "white" as GamePieceColor,
	}

	const gameInstance: TransmissionGameInstance = {
		id: gameId,
		playerOne: null,
		playerTwo: null,

		boardState: boardState,
	}

	initGameMap(gameInstance) // add instance to server cache

	return gameInstance
})
