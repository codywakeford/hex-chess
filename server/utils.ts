import { gameInstances } from "./cache"
import { glinskyStartingPositions, mcCooeyStartingPositions } from "./hardData"

/**Converts maps to arrays */
export function convertGameInstanceForClient(gameId: string): TransmissionGameInstance | null {
	const game = gameInstances.get(gameId) as GameInstance

	if (!game) return null

	const clientGameInstance: TransmissionGameInstance = {
		...game,
		boardState: {
			...game.boardState,
			boardPieces: Array.from(game.boardState.boardPieces.values()),
			gamePieces: Array.from(game.boardState.gamePieces.values()),
		},
	}

	return clientGameInstance
}

export function setPiecesToStartPositions(gameId: string, gameType: GameType) {
	const game = gameInstances.get(gameId)
	if (!game) throw new Error("No game found.")

	const gamePieces = game.boardState.gamePieces
	gamePieces.clear()

	let startingPieces = getStartingPieces(gameType)

	startingPieces.forEach((piece) => {
		if (!piece.boardPosition) throw new Error("No piece poisition found.")

		gamePieces.set(stringPos(piece.boardPosition), piece)
	})
}

export function getStartingPieces(gameType: GameType) {
	if (gameType === "glinsky") return glinskyStartingPositions
	if (gameType === "mcCooey") return glinskyStartingPositions

	return []
}

/**Sets up the game data and adds it to server memory. */
export function initGameMap(gameInstance: TransmissionGameInstance) {
	const gamePiecesMap: Map<string, GamePiece> = new Map()
	const boardPiecesMap: Map<string, BoardPiece> = new Map()

	gamePiecesMap.clear()

	gameInstance.boardState.gamePieces.forEach((piece) => {
		if (!piece.boardPosition) return

		gamePiecesMap.set(stringPos(piece.boardPosition), piece)
	})

	const serverSideGameInstance: GameInstance = {
		...gameInstance,
		boardState: {
			boardPieces: boardPiecesMap,
			gamePieces: gamePiecesMap,
			selectedBoardPiece: {} as BoardPiece | null,
			latestMoves: {
				white: {
					to: null,
					from: null,
				},
				black: {
					to: null,
					from: null,
				},
			} as LatestMoves,
		} as BoardState,
	}
	gameInstances.set(gameInstance.id, serverSideGameInstance)
}
