import { useWebSocket } from "@vueuse/core"
import { positionContainsPiece } from "~/shared/moves"

export const useGameStore = defineStore("game", {
	state: () => ({
		game: {} as GameState,

		websocket: {} as GameWebsocket,

		player: {} as Player,

		board: {
			checkState: { white: null, black: null },
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

		getGamePieceIndexFromPosition: (state) => (boardPosition: BoardPosition) => {
			return state.board.gamePieces.findIndex((piece) => {
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
				turn: "white",
			}

			this.initWebsocket()
		},

		initWebsocket(gameId?: string, playerId?: string) {
			let _gameId: string

			if (gameId) {
				_gameId = gameId
			} else {
				_gameId = this.game.gameId
			}

			const { data, status, open, close, send, ws } = useWebSocket(
				`ws://${location.host}/api/websocket?gameId=${_gameId}&playerId=${playerId}`,
			)

			this.websocket = {
				data,
				status,
				open,
				close,
				send,
				ws,
			}

			watch(data, (newValue) => {
				const response = JSON.parse(newValue)

				if (response.type === "kill") {
					const { piecePosition } = response

					const pieceIndex = this.getGamePieceIndexFromPosition(piecePosition)

					if (pieceIndex !== -1) {
						this.board.gamePieces[pieceIndex].alive = false
						this.board.gamePieces[pieceIndex].boardPosition = null
					}
				}

				if (response.type === "move") {
					const {
						pieceStart,
						pieceEnd,
					}: { pieceStart: BoardPosition; pieceEnd: BoardPosition } = response

					const oldPieceIndex = this.getGamePieceIndexFromPosition(pieceStart)

					// const oldPieceIndex = this.board.gamePieces.findIndex((piece) => {
					// 	return (
					// 		piece.boardPosition &&
					// 		pieceStart &&
					// 		piece.boardPosition.x === pieceStart.x &&
					// 		piece.boardPosition.y === pieceStart.y
					// 	)
					// })

					if (oldPieceIndex !== -1) {
						this.board.gamePieces[oldPieceIndex].boardPosition = pieceEnd
					}
				}

				if (response.type === "join") {
					this.game.playerTwo = response.playerTwo
				}
			})
		},

		restartGame() {
			;(this.game = {} as GameState),
				(this.websocket = {} as GameWebsocket),
				(this.player = {} as Player),
				(this.board = {
					checkState: { white: null, black: null },
					gamePieces: [] as GamePiece[],
					selectedBoardPiece: {} as HexBoardPiece | null,
				} as BoardState)

			this.init()
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
					const attackerPaths = getAllPlayerPaths(this.board, piece.color)
					moves = kingMoves(position, attackerPaths)
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
			this.initWebsocket(gameId, this.player.id)

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
				turn: "white",
			}
		},

		movePiece(position: BoardPosition) {
			const selectedBoardPiece = this.board.selectedBoardPiece
			if (!selectedBoardPiece) return

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

			// send update to ws
			const payload: UpdateMoveRequest = {
				type: "move",
				pieceStart: selectedBoardPiece.boardPosition,
				pieceEnd: position,
				gameId: this.game.gameId,
			}

			const payloadString = JSON.stringify(payload)
			this.websocket.send(payloadString)
			this.resetBoardHighlights()

			this.checkCheck() // check if enemy is now in check
		},

		kill(position: BoardPosition) {
			const pieceToKill = this.board.gamePieces.find((piece) => {
				return (
					piece.boardPosition &&
					piece.boardPosition.x === position.x &&
					piece.boardPosition.y === position.y
				)
			})

			if (!pieceToKill || !pieceToKill.boardPosition) return

			let payload: KillRequest = {
				type: "kill",
				piecePosition: pieceToKill.boardPosition,
				gameId: this.game.gameId,
			}

			pieceToKill.alive = false
			pieceToKill.boardPosition = null

			const payloadString = JSON.stringify(payload)
			this.websocket.send(payloadString)
		},

		checkCheck() {
			const defenderColor = this.game.turn === "white" ? "black" : "white"

			const check = isCheck(this.board, defenderColor)

			// // console.log(check)
			// if (!check) {
			// 	this.board.checkState[defenderColor] = null
			// 	return // if not in check it cant be in checkmate : return
			// }

			// this.board.checkState[defenderColor] = "check"

			// const checkmate = isCheckmate(this.board, defenderColor)

			// if (!checkmate) return // leave king in check

			// this.board.checkState[defenderColor] = "checkmate"
		},
	},
})
