import { gameInstances } from "~/server/cache"

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

			game.playerTwo = {
				id: playerId,
				color: playerTwoColor,
			}
		}

		console.log("Joining room: " + gameId)
		peer.subscribe(gameId)
	},

	message(peer, message) {
		const request = message.json() as WebsocketMessage

		console.log(message.json())

		if (request.type === "move") {
			// Send change to other player
			// TODO: verify move
			const payload = message.toString()

			peer.publish(request.gameId, payload)

			// Update server cache
			moveGamePiece(request)
		}
	},

	close(peer) {},
	error(peer, error) {
		console.log("error on WS", peer, error)
	},
})

function moveGamePiece(request: UpdateMoveRequest) {
	const game = gameInstances.get(request.gameId)
	const piece = game?.boardState.gamePieces.find((piece) => {
		piece.boardPosition &&
			request.pieceStart &&
			piece.boardPosition.x === request.pieceStart.x &&
			piece.boardPosition.y === request.pieceStart.y
	})

	if (piece) piece.boardPosition = request.pieceEnd
}
