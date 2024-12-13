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

	type WebsocketMessageRequest = UpdateMoveRequest | KillRequest | RestartRequest | LeaveRequest

	interface UpdateMoveRequest {
		type: "move"
		/**Where the piece was before moving */
		pieceStart: BoardPosition

		/**Where the piece is after moving. */
		pieceEnd: BoardPosition
		pieceId: string
		gameId: string
	}

	interface KillRequest {
		type: "kill"
		pieceId: string
		piecePosition: BoardPosition
		gameId: string
	}

	interface LeaveRequest {
		type: "leave"
		playerId: string
		gameId: string
	}

	interface RestartRequest {
		type: "restart"
		gameId: string
		gameType: GameType
	}

	type WebsocketResponse =
		| JoinResponse
		| KillRequest
		| UpdateMoveRequest
		| RestartRequest
		| JoinNotification

	interface JoinNotification {
		type: "joinNotification"
		playerOne: Player
		playerTwo: Player
	}

	/**The response when player two joins your game. */
	interface JoinResponse {
		type: "join"

		playerNumber: 0 | 1 | 2
		playerOne: Player | null
		playerTwo: Player | null
	}
}
