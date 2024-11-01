import { useWebSocket } from "@vueuse/core"
import { defineStore } from "pinia"

export const useGameStore = defineStore("game", {
	state: () => ({
		game: {} as GameState,
		websocket: {} as GameWebsocket,
		player: {} as Player,
		board: {
			gamePieces: [] as GamePiece[],
			boardPieces: [] as HexBoardPiece[],
			selectedBoardPiece: {} as HexBoardPiece | null,
		} as BoardState,
	}),

	getters: {
		get(state) {
			return state.game
		},

		getBoard(state) {
			return state.board || { gamePieces: [], boardPieces: [] }
		},

		gamePieces(state) {
			return (state.board && state.board.gamePieces) || []
		},

		getGamePieceFromPosition: (state) => (boardPosition: BoardPosition) => {
			return state.board.gamePieces.find((piece) => {
				return (
					piece.boardPosition &&
					piece.boardPosition.x === boardPosition.x &&
					piece.boardPosition.y === boardPosition.y
				)
			})
		},

		boardPieces(state) {
			return state.board.boardPieces || []
		},

		getBoardPiece: (state) => (positionName: GamePiece["boardPosition"]) => {
			return state.board.boardPieces.find((piece) => {
				return piece.boardPosition === positionName
			})
		},
	},

	actions: {
		async init() {
			const gameInstance = await $fetch("/api/create-game", {
				method: "post",
			})
			if (!gameInstance) return

			this.board.gamePieces = gameInstance.boardState.gamePieces
			this.player = gameInstance.playerOne

			this.game = {
				gameId: gameInstance.id,
				playerOne: gameInstance.playerOne,
				playerTwo: gameInstance.playerTwo,
			}

			console.log("herere")
			this.initWebsocket()
		},

		initWebsocket(gameId?: string) {
			let id: string

			if (gameId) {
				id = gameId
			} else {
				id = this.game.gameId
			}

			const { data, status, open, close, send, ws } = useWebSocket(
				`ws://${location.host}/api/websocket?gameId=${id}`,
			)

			this.websocket = {
				data,
				status,
				open: open,
				close,
				send,
				ws,
			}

			watch(data, (newValue) => {
				const change = JSON.parse(newValue)
				console.log("noticed changes", change)

				const {
					pieceStart,
					pieceEnd,
				}: { pieceStart: BoardPosition; pieceEnd: BoardPosition } = change

				const oldPieceIndex = this.board.gamePieces.findIndex((piece) => {
					return (
						piece.boardPosition &&
						pieceStart &&
						piece.boardPosition.x === pieceStart.x &&
						piece.boardPosition.y === pieceStart.y
					)
				})

				if (oldPieceIndex !== -1) {
					// Remove the piece from the board using splice
					this.board.gamePieces[oldPieceIndex].boardPosition = pieceEnd
				}

				// this.board.gamePieces.push(pieceEnd)
			})
		},

		resetBoardHighlights() {
			this.board.boardPieces.forEach((hex) => (hex.highlight = null))
		},

		selectBoardPiece(boardPiece: HexBoardPiece) {
			this.resetBoardHighlights()
			this.board.selectedBoardPiece = boardPiece

			this.displayPieceMoves()
			this.board.selectedBoardPiece.highlight = "selected"
		},

		displayPieceMoves() {
			if (!this.board.selectedBoardPiece?.boardPosition) return

			const piece = this.getGamePieceFromPosition(
				this.board.selectedBoardPiece?.boardPosition,
			)

			if (!piece) {
				this.board.selectedBoardPiece = {} as HexBoardPiece
				return
			}

			const boardPieces = this.board.boardPieces
			const gamePieces = this.board.gamePieces
			const position = this.board.selectedBoardPiece?.boardPosition

			if (!position) return

			let moves: BoardPosition[] = []

			switch (piece.type) {
				case "castle":
					moves = castleMoves(position, boardPieces, gamePieces, piece.color)
					break

				case "pawn":
					moves = pawnMoves(position, gamePieces, piece.color)
					break

				case "king":
					moves = kingMoves(position)
					break

				case "queen":
					moves = queenMoves(position, boardPieces, gamePieces, piece.color)
					break

				case "bishop":
					moves = bishopMoves(position, boardPieces, gamePieces, piece.color)
					break

				case "horse":
					moves = horseMoves(position, boardPieces)
					break

				default:
					break
			}

			moves.forEach((boardPosition) => {
				const hex = this.board.boardPieces.find((hex) => {
					return (
						hex.boardPosition.x === boardPosition.x &&
						hex.boardPosition.y === boardPosition.y
					)
				})

				if (hex) {
					hex.highlight = "move"

					const side = positionContainsPiece(
						boardPosition,
						this.board.gamePieces,
						piece.color,
					)

					if (side === "enemy") {
						hex.highlight = "attack"
					}

					if (side === "ally") {
						hex.highlight = null
					}
				}
			})
		},

		addBoardPiece(boardPiece: HexBoardPiece) {
			this.board.boardPieces.push(boardPiece)
		},

		async joinGame(gameId: string) {
			this.initWebsocket(gameId)

			const gameInstance = await $fetch<GameInstance>(`/api/${gameId}`, {
				method: "GET",
			})

			if (!gameInstance) {
				console.error("No game found for given ID")
				return
			}

			this.board.gamePieces = gameInstance.boardState.gamePieces

			this.game = {
				gameId: gameInstance.id,
				playerOne: gameInstance.playerOne,
				playerTwo: gameInstance.playerTwo,
			}
		},

		movePiece(position: BoardPosition) {
			const selectedBoardPiece = this.board.selectedBoardPiece

			const piece = this.board.gamePieces.find((piece) => {
				return (
					piece.boardPosition &&
					selectedBoardPiece?.boardPosition &&
					piece.boardPosition.x === selectedBoardPiece.boardPosition.x &&
					piece.boardPosition.y === selectedBoardPiece.boardPosition.y
				)
			})

			if (piece) {
				const side = positionContainsPiece(position, this.board.gamePieces, piece.color)

				if (side === "enemy") {
					this.kill(position)
				}

				piece.boardPosition = position
			}

			if (!selectedBoardPiece) return

			const payload: UpdateMoveRequest = {
				type: "move",
				pieceStart: selectedBoardPiece.boardPosition,
				pieceEnd: position,
				gameId: this.game.gameId,
			}
			const payloadString = JSON.stringify(payload)

			console.log(payload)
			this.websocket.send(payloadString)
			this.resetBoardHighlights()
		},

		kill(position: BoardPosition) {
			const pieceToKill = this.board.gamePieces.find((piece) => {
				return (
					piece.boardPosition &&
					piece.boardPosition.x === position.x &&
					piece.boardPosition.y === position.y
				)
			})

			if (pieceToKill) {
				pieceToKill.alive = false
				pieceToKill.boardPosition = null
			}
		},
	},
})
