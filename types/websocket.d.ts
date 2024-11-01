export {}

declare global {
	type WebsocketMessage = UpdateMoveRequest | JoinRequest

	interface UpdateMoveRequest {
		type: "move"
		/**Where the piece was before moving */
		pieceStart: BoardPosition

		/**Where the piece is after moving. */
		pieceEnd: BoardPosition

		gameId: string
	}

	interface JoinRequest {
		type: "join"
		gameId: string
	}
}
