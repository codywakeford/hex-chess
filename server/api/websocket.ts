import { gameInstances } from "~/server/cache"
import { startingPieces } from "../hardData"
import { setPiecesToStartPositions } from "../utils"

export default defineWebSocketHandler({
	open(peer) {
		const url = peer.request?.url

		if (!url) return

		const urlObj = new URL(url)
		const gameId = urlObj.searchParams.get("gameId")
		const playerId = urlObj.searchParams.get("playerId")

		if (!gameId) return
		if (!playerId) throw new Error("player id not found")

		console.log("")
		console.log("PlayerJoining:", playerId)
		console.log("Joining Game", gameId)

		const game = gameInstances.get(gameId) as GameInstance
		if (!game) return

		let player: Player | null = null
		let playerNumber = 0

		if (game.playerOne && game.playerOne.id === playerId) {
			// Player is rejoining as player 1
			player = game.playerOne
			playerNumber = 1
			console.log("Rejoining as player number", playerNumber)
		} else if (game.playerTwo && game.playerTwo.id === playerId) {
			// Player is rejoining as player 2
			player = game.playerTwo
			playerNumber = 2
			console.log("Rejoining as player number", playerNumber)
		} else if (!game.playerOne) {
			// New player joining as player 1
			player = { id: playerId, color: "white" }
			game.playerOne = player
			playerNumber = 1
			console.log("Joining as player number", playerNumber)
		} else if (!game.playerTwo) {
			// New player joining as player 2
			player = { id: playerId, color: "black" }
			game.playerTwo = player
			playerNumber = 2
			console.log("Joining as player number", playerNumber)
		}

		console.log(game.playerOne)
		console.log(game.playerTwo)

		const payload = {
			type: "join",
			player: player, // if null game is full
		} as JoinResponse

		peer.send(JSON.stringify(payload))
		peer.subscribe(gameId)
		// peer.publish(gameId, JSON.stringify(payload))
	},

	message(peer, message) {
		// TODO: verify move
		const request = message.json() as WebsocketMessageRequest

		// Share message with subscribers
		const payload = message.toString()
		peer.publish(request.gameId, payload)

		if (request.type === "restart") {
			restartGame(request)
		}

		if (request.type === "move") {
			moveGamePiece(request)
		}

		if (request.type === "kill") {
			killGamePiece(request)
		}

		if (request.type === "leave") {
			leaveGame(request)
		}
	},

	close(peer) {},
	error(peer, error) {
		console.log("error on WS", peer, error)
	},
})

function restartGame(request: RestartRequest) {
	setPiecesToStartPositions(request.gameId)
}

function getPieceByBoardPosition(gameId: string, boardPosition: BoardPosition) {
	const game = gameInstances.get(gameId) as GameInstance

	const piece = game.boardState.gamePieces.get(stringPos(boardPosition))
	if (!piece) throw Error("No piece found")
	return piece
}

function moveGamePiece(request: UpdateMoveRequest) {
	const game = gameInstances.get(request.gameId) as GameInstance
	if (!game) throw new Error("Game does not exist.")

	console.log(request)

	const gamePiece = game.boardState.gamePieces.get(request.pieceId)

	if (!gamePiece) throw new Error("Game piece not found")
	gamePiece.boardPosition = request.pieceEnd
}

function leaveGame(request: LeaveRequest) {
	const game = gameInstances.get(request.gameId)
}

function killGamePiece(request: KillRequest) {
	const game = gameInstances.get(request.gameId)
	if (!game) {
		console.error("[server] Error killing piece: Game not found")
		return
	}

	const piece = getPieceByBoardPosition(request.gameId, request.piecePosition)

	if (!piece) {
		console.error("[server] Error killing piece: No piece found")
		return
	}

	piece.alive = false
	piece.boardPosition = null

	gameInstances.set(request.gameId, game)
}
