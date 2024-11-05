import { useWebSocket } from "@vueuse/core"
import { positionContainsPiece } from "~/shared/moves"

export const useGameStore = defineStore("game", {
	state: () => ({
		game: {} as GameState,

		websocket: {} as GameWebsocket,

		player: {} as Player,

		board: {
			checkState: { white: null, black: null },
			gamePieces: new Map() as GamePieceMap,
			boardPieces: new Map() as BoardPieceMap,
			selectedBoardPiece: {} as BoardPiece | null,
			paths: {
				white: new Set() as Set<BoardPosition>,
				black: new Set() as Set<BoardPosition>,
			},
		} as BoardState,

		selectedColors: classicBoard as string[],
	}),

	getters: {
		get(state) {
			return state.game
		},

		gamePiece: (state) => (boardPosition: BoardPosition) => {
			const boardPiece = state.board.boardPieces.get(stringPos(boardPosition))

			const pieceId = boardPiece?.pieceId

			if (!pieceId) return null

			return state.board.gamePieces.get(pieceId) || null
		},

		boardPiece: (state) => (boardPosition: BoardPosition) => {
			return state.board.boardPieces.get(stringPos(boardPosition))
		},

		paths: (state) => (color: GamePieceColor) => {
			if (state.board.paths[color].size) {
				return state.board.paths[color]
			}

			const path = getAllPlayerPaths(state.board, color)

			state.board.paths[color] = new Set(path)

			return state.board.paths[color]
		},
	},

	actions: {
		async init() {
			const gameInstance = await $fetch<GameInstance>("/api/create-game", {
				method: "post",
			})

			if (!gameInstance) return

			const pieces = gameInstance.boardState.gamePieces

			pieces.forEach((piece) => {
				if (!piece.boardPosition) return
				const boardPiece = this.boardPiece(piece.boardPosition)
				if (!boardPiece) throw new Error("Board piece not found")

				boardPiece.pieceId = stringPos(piece.boardPosition)

				this.board.gamePieces.set(stringPos(piece.boardPosition), {
					...piece,
					pieceId: stringPos(piece.boardPosition),
				}) // piece id is start pos
			})

			this.player = gameInstance.playerOne

			this.game = {
				gameId: gameInstance.id,
				playerOne: gameInstance.playerOne,
				playerTwo: gameInstance.playerTwo,
				turn: "white",
			}

			this.initWebsocket()
		},

		onMove() {
			this.board.paths.white.clear()
			this.board.paths.black.clear()
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
					const { piecePosition }: { piecePosition: BoardPosition } = response

					const piece = this.board.gamePieces.get(stringPos(piecePosition))

					if (piece) {
						piece.alive = false
						piece.boardPosition = null

						return
					}
				}

				if (response.type === "move") {
					const {
						pieceStart,
						pieceEnd,
					}: { pieceStart: BoardPosition; pieceEnd: BoardPosition } = response

					const piece = this.board.gamePieces.get(stringPos(pieceStart))

					if (!piece) {
						console.error("No piece found.")
						return
					}

					piece.boardPosition = pieceEnd
				}

				if (response.type === "join") {
					this.game.playerTwo = response.playerTwo
				}
				this.onMove()
			})
		},

		restartGame() {
			;(this.game = {} as GameState), (this.websocket = {} as GameWebsocket), this.init()
		},

		resetBoardHighlights() {
			this.board.boardPieces.forEach((hex) => (hex.highlight = null))
		},

		selectBoardPiece(boardPiece: BoardPiece) {
			this.resetBoardHighlights()

			this.board.selectedBoardPiece = boardPiece
			this.board.selectedBoardPiece.highlight = "selected"

			this.displayPieceMoves(boardPiece.boardPosition)
		},

		displayPieceMoves(boardPosition: BoardPosition) {
			const piece = this.gamePiece(boardPosition)

			if (!piece) {
				this.board.selectedBoardPiece = {} as BoardPiece
				return
			}

			let moves: BoardPosition[] = []

			switch (piece.type) {
				case "castle":
					moves = castleMoves(boardPosition, this.board, piece.color)
					break

				case "pawn":
					moves = pawnMoves(boardPosition, this.board, piece.color)
					break

				case "king":
					moves = kingMoves(boardPosition, this.board, piece.color)
					break

				case "queen":
					moves = queenMoves(boardPosition, this.board, piece.color)
					break

				case "bishop":
					moves = bishopMoves(boardPosition, this.board, piece.color)
					break

				case "horse":
					moves = horseMoves(boardPosition, this.board)
					break

				default:
					break
			}

			moves.forEach((boardPosition) => {
				const hex = this.boardPiece(boardPosition)

				if (hex) {
					hex.highlight = "move"

					const side = positionContainsPiece(boardPosition, this.board, piece.color)

					if (side === "enemy") {
						hex.highlight = "attack"
					}

					if (side === "ally") {
						hex.highlight = null
					}
				}
			})
		},

		addBoardPiece(boardPiece: BoardPiece) {
			this.board.boardPieces.set(stringPos(boardPiece.boardPosition), boardPiece)
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

			const pieces = gameInstance.boardState.gamePieces

			pieces.forEach((piece) => {
				if (!piece.boardPosition) return

				const boardPiece = this.boardPiece(piece.boardPosition)
				if (!boardPiece) return
				boardPiece.pieceId = stringPos(piece.boardPosition)

				this.board.gamePieces.set(stringPos(piece.boardPosition), piece)
			})

			this.game = {
				gameId: gameInstance.id,
				playerOne: gameInstance.playerOne,
				playerTwo: gameInstance.playerTwo,
				turn: "white",
			}
		},

		async movePiece(toPosition: BoardPosition) {
			const selectedBoardPiece = this.board.selectedBoardPiece
			const fromPosition = selectedBoardPiece?.boardPosition

			const boardPiece = this.boardPiece(fromPosition)
			const gamePiece = this.gamePiece(fromPosition)

			if (boardPiece) {
				boardPiece.pieceId = null
			}

			if (!selectedBoardPiece || !fromPosition) return

			if (!gamePiece) {
				console.error("Piece not found")
				return
			}

			const side = positionContainsPiece(toPosition, this.board, gamePiece.color)

			if (side === "enemy") {
				this.kill(toPosition)
				new Audio("/capture.mp3").play()
			} else {
				new Audio("/move-self.mp3").play()
			}

			gamePiece.boardPosition = toPosition

			const newBoardPiece = this.boardPiece(toPosition)
			if (newBoardPiece) {
				newBoardPiece.pieceId = gamePiece.pieceId
			}

			// send update to ws
			const payload: UpdateMoveRequest = {
				type: "move",
				pieceStart: selectedBoardPiece.boardPosition,
				pieceEnd: toPosition,
				gameId: this.game.gameId,
			}

			const payloadString = JSON.stringify(payload)
			this.websocket.send(payloadString)
			this.resetBoardHighlights()

			this.checkCheck() // TODO: check if enemy is now in check

			this.onMove()
		},

		kill(position: BoardPosition) {
			const pieceToKill = this.gamePiece(position)
			const boardPiece = this.boardPiece(position)

			if (!pieceToKill || !pieceToKill.boardPosition || !boardPiece) {
				throw new Error("Error finding boardPiece or gamePiece")
			}

			let payload: KillRequest = {
				type: "kill",
				piecePosition: pieceToKill.boardPosition,
				gameId: this.game.gameId,
			}

			boardPiece.pieceId = null
			pieceToKill.alive = false
			pieceToKill.boardPosition = null

			const payloadString = JSON.stringify(payload)
			this.websocket.send(payloadString)
		},

		checkCheck() {
			const defenderColor = this.game.turn === "white" ? "black" : "white"

			const check = isCheck(this.board, defenderColor)

			if (!check) {
				this.board.checkState[defenderColor] = null
				return // if not in check it cant be in checkmate : return
			}

			this.board.checkState[defenderColor] = "check"

			const checkmate = isCheckmate(this.board, defenderColor)

			console.log(checkmate)

			if (!checkmate) return // leave king in check

			this.board.checkState[defenderColor] = "checkmate"
		},
	},
})
