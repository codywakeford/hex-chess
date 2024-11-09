import { glinskyStartingPositions, mcCooeyStartingPositions } from "../hardData"
import { initGameMap } from "../utils"

export default eventHandler(async (event) => {
	const { gameId, playerId, opponent, gameType } = await readBody(event)

	if (!gameId || !playerId || !opponent || !gameType)
		throw new Error("gameId | playerId | opponent | gameType not found.")

	let startingPieces: GamePiece[]
	if (gameType === "mcCooey") {
		startingPieces = mcCooeyStartingPositions
	} else {
		startingPieces = glinskyStartingPositions
	}

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

	const gameInstance: TransmissionGameInstance = {
		id: gameId,
		playerOne,
		playerTwo,

		boardState: boardState,
	}

	initGameMap(gameInstance) // add instance to server cache

	return gameInstance
})
