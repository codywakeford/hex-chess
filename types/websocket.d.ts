export {}

declare global {
	interface GameWebsocket {
		data: Ref<WebsocketMessageResponse>
		status: Ref<any>
		close: function
		open: function
		send: any
		ws: any
	}

	type WebsocketMessageRequest = UpdateMoveRequest | JoinRequest | KillRequest

	interface UpdateMoveRequest {
		type: "move"
		/**Where the piece was before moving */
		pieceStart: BoardPosition

		/**Where the piece is after moving. */
		pieceEnd: BoardPosition

		gameId: string
	}

	interface KillRequest {
		type: "kill"
		piecePosition: BoardPosition
		gameId: string
	}

	type WebsocketMessageResponse = WebsocketMessageRequest | JoinResponse

	/**The response when player two joins your game. */
	interface JoinResponse {
		type: "join"
		playerTwo: Player
	}
}
