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

		if (!gameId) throw new Error("gameId not found")
		if (!playerId) throw new Error("playerId not found")

		// console.log("")
		// console.log("PlayerJoining:", playerId)
		// console.log("Joining Game", gameId)

		const game = gameInstances.get(gameId) as GameInstance
		if (!game) return

		let playerOne: Player | null = game.playerOne
		let playerTwo: Player | null = game.playerTwo

		/**The number the requesting player is. Return 0 if game is full. */
		let playerNumber = 0

		// If playerId  is already in game : rejoin
		if (game.playerOne && game.playerOne.id === playerId) {
			playerNumber = 1
		}

		// If playerId is already player2 : rejoin
		else if (game.playerTwo && game.playerTwo.id === playerId) {
			playerNumber = 2
		}

		// If player 1 slot is empty : Join as player one
		else if (!game.playerOne) {
			playerOne = { id: playerId, color: "white" }
			game.playerOne = playerOne
			playerNumber = 1
		}

		// If player 2 slot is empty or is CPU player : Join as player 2
		else if (!game.playerTwo || game.playerTwo.id === "cpu") {
			playerTwo = { id: playerId, color: "black" }
			game.playerTwo = playerTwo
			playerNumber = 2
		}

		// response for the person joining
		const payload = {
			type: "join",
			playerNumber, // 0 if game is full
			playerOne: playerOne,
			playerTwo: playerTwo,
		} as JoinResponse

		// response for the others in the game.
		const payload2 = {
			type: "joinNotification",
			playerOne,
			playerTwo,
		} as JoinNotification

		peer.send(JSON.stringify(payload)) // response
		peer.publish(gameId, JSON.stringify(payload2)) // update subscribers
		peer.subscribe(gameId) // subscribe to events
	},

	// TODO: verify move server side.
	message(peer, message) {
		const request = message.json() as WebsocketMessageRequest

		// Share message with subscribers
		peer.publish(request.gameId, message.toString())

		if (request.type === "restart") restartGame(request)
		if (request.type === "move") moveGamePiece(request)
		if (request.type === "kill") killGamePiece(request)
		if (request.type === "leave") leaveGame(request)
	},

	close(peer) {
		peer.close()

		//Todo update other subs to leaving
	},

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

/**Removes player from game state, :  destroy if empty */
function leaveGame(request: LeaveRequest) {
	const game = gameInstances.get(request.gameId) as GameInstance

	let player

	if (!game.playerTwo) {
		player = game.playerOne
	}

	// find and remove player
	if (game.playerOne && game.playerOne.id === request.playerId) {
		game.playerOne = null
	} else if (game.playerTwo && game.playerTwo.id === request.playerId) {
		game.playerTwo = null
	}

	// Delete game if empty
	if (!game.playerOne && !game.playerTwo) {
		console.log("Deleting game instance:", request.gameId)
		gameInstances.delete(request.gameId)
	}
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
