import { startingPieces } from "../hardData"
import { initGameMap } from "../utils"

export default eventHandler(async (event) => {
	const { gameId, playerId, opponent } = await readBody(event)

	if (!gameId || !playerId || !opponent)
		throw new Error("gameId | playerId | opponent not found.")

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

	let playerTwo: Player | null = null

	if (opponent === "cpu") {
		playerTwo = {
			id: "cpu",
			color: "black",
		}
	}

	const gameInstance: TransmissionGameInstance = {
		id: gameId,
		playerOne: null,
		playerTwo: playerTwo,

		boardState: boardState,
	}

	initGameMap(gameInstance) // add instance to server cache

	return gameInstance
})
