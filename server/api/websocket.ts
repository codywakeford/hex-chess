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

		const game = gameInstances.get(gameId)

		if (!game) return

		if (playerId) {
			const playerOneColor = game?.playerOne.color

			let playerTwoColor: GamePieceColor

			if (playerOneColor === "black") {
				playerTwoColor = "white"
			} else {
				playerTwoColor = "black"
			}

			const playerTwo = {
				id: playerId,
				color: playerTwoColor,
			}
			game.playerTwo = playerTwo

			const payload: JoinResponse = {
				type: "join",
				playerTwo: playerTwo,
			}

			peer.publish(gameId, JSON.stringify(payload))
		}

		console.log("Joining room: " + gameId)
		peer.subscribe(gameId)
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
	const game = gameInstances.get(gameId)

	const piece = game?.boardState.gamePieces.get(stringPos(boardPosition))
	console.log(piece)
	return piece || undefined
}

function moveGamePiece(request: UpdateMoveRequest) {
	const piece = getPieceByBoardPosition(request.gameId, request.pieceStart)

	if (piece) piece.boardPosition = request.pieceEnd
}

function joinPlayerTwo() {}

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
