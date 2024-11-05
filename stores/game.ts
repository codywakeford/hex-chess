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
			const gameInstance = await $fetch<GameInstance>("/api/create-game", {
				method: "post",
			})

			if (!gameInstance) return

			const pieces = gameInstance.boardState.gamePieces

			pieces.forEach((piece) => {
				if (!piece.boardPosition) return
				const posString = stringPos(piece.boardPosition)
				
				this.board.gamePieces.set(posString, piece) // piece id is start pos
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
			})
		},

		restartGame() {
			;(this.game = {} as GameState), (this.websocket = {} as GameWebsocket), this.init()
		},

		resetBoardHighlights() {
			this.board.boardPieces.forEach((hex) => (hex.highlight = null))
		},

		selectBoardPiece(boardPiece: HexBoardPiece) {
			this.resetBoardHighlights()

			this.board.selectedBoardPiece = boardPiece
			this.board.selectedBoardPiece.highlight = "selected"

			this.displayPieceMoves(boardPiece.boardPosition)
		},

		displayPieceMoves(boardPosition: BoardPosition) {
			const posString = stringPos(boardPosition)

			if (!posString) {
				console.error("Board position is null")
				return
			}

			const piece = this.board.gamePieces.get(posString)

			if (!piece) {
				this.board.selectedBoardPiece = {} as HexBoardPiece
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
					// const attackerPaths = getAllPlayerPaths(this.board, piece.color)
					moves = kingMoves(boardPosition)
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
				const hex = this.board.boardPieces.find((hex) => {
					return (
						hex.boardPosition.x === boardPosition.x &&
						hex.boardPosition.y === boardPosition.y
					)
				})

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

			const pieces = gameInstance.boardState.gamePieces

			pieces.forEach((piece) => {
				if (!piece.boardPosition) return
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
			
			if (!selectedBoardPiece || !fromPosition) return
			
			const piece = this.board.gamePieces.get(stringPos(fromPosition))
			
			if (!piece) {
				console.error("Piece not found")
				return
			}

			const side = positionContainsPiece(toPosition, this.board, piece.color)

			if (side === "enemy") {
				this.kill(toPosition)
				new Audio("/capture.mp3").play()
			} else {
				new Audio("/move-self.mp3").play()
			}

			this.board.gamePieces.delete(stringPos(fromPosition))
			this.board.gamePieces.set(stringPos(toPosition), piece)

			piece.boardPosition = toPosition

			console.log(toPosition, piece.boardPosition)
			

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
		},

		kill(position: BoardPosition) {
			const pieceToKill = this.board.gamePieces.get(stringPos(position))

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

			// TODO: Make more efficient

			// const check = isCheck(this.board, defenderColor)

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
