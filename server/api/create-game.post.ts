import { startingPieces } from "../hardData"
import { initGameMap } from "../utils"

export default eventHandler(async (event) => {
	const { gameId, playerId, opponent } = await readBody(event)

	if (!gameId || !playerId || !opponent)
		throw new Error("gameId | playerId | opponent not found.")

	// Default board state.
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
		opponent: opponent,
		cpuLevel: 1,
		turn: "white" as GamePieceColor,
	}

	let playerOne: Player | null = null
	let playerTwo: Player | null = null

	playerOne = {
		id: playerId,
		color: "white",
	}

	// always create a new game with a cpu player
	playerTwo = {
		id: "cpu",
		color: "black",
	}

	console.log("")
	console.log("creating Game...")

	const gameInstance: TransmissionGameInstance = {
		id: gameId,
		playerOne,
		playerTwo,

		boardState: boardState,
	}
	console.log(gameInstance.playerOne)
	console.log(gameInstance.playerTwo)

	initGameMap(gameInstance) // add instance to server cache

	return gameInstance
})
