import { onClickOutside, useWebSocket } from "@vueuse/core"
import { positionContainsPiece } from "~/shared/moves"
import { generateUniqueId } from "~/shared/utils"

export const useGameStore = defineStore("game", {
	state: () => ({
		game: {
			gameId: "",
			playerOne: null,
			playerTwo: null,
			playBoth: false,
		} as GameState,

		websocket: {} as GameWebsocket,

		player: {
			id: "",
			color: "white",
		} as Player,

		board: {
			turn: "white" as GamePieceColor,
			checkState: { white: null, black: null },
			gamePieces: new Map() as GamePieceMap,
			boardPieces: new Map() as BoardPieceMap,
			selectedBoardPiece: {} as BoardPiece | null,
			latestMoves: {
				white: {
					to: null,
					from: null,
				},
				black: {
					to: null,
					from: null,
				},
			} as LatestMoves,
		} as BoardState,

		// Default
		selectedColors: colorWaves.classicBoard as string[],
	}),

	getters: {
		get(state) {
			return state.game
		},

		getGamePieces(state) {
			return state.board.gamePieces
		},

		getBoardPieces(state) {
			return state.board.boardPieces
		},

		getGamePiece: (state) => (boardPosition: BoardPosition) => {
			const boardPiece = state.board.boardPieces.get(stringPos(boardPosition))

			const pieceId = boardPiece?.pieceId

			if (!pieceId) return null

			return state.board.gamePieces.get(pieceId) || null
		},

		getBoardPiece: (state) => (boardPosition: BoardPosition) => {
			return state.board.boardPieces.get(stringPos(boardPosition))
		},

		isPlayersTurn(state) {
			return state.player.color === state.board.turn
		},
	},

	actions: {
		async init() {
			if (!import.meta.client) return

			let cachedGameId = this.cachedGame()
			const gameId = cachedGameId ? cachedGameId : generateUniqueId()
			const newGame = cachedGameId ? false : true

			const cachedPlayerId = this.cachedPlayer()
			const playerId = cachedPlayerId ? cachedPlayerId : generateUniqueId()

			await this.getGame(gameId, newGame)
			this.initWebsocket(gameId, playerId)

			console.log(playerId)

			this.player.id = playerId
			localStorage.setItem("playerId", JSON.stringify(playerId.trim()))
			localStorage.setItem("gameId", JSON.stringify(gameId.trim()))
		},

		/**Connect to websocket and define listener functions. */
		initWebsocket(gameId: string, playerId: string) {
			let _gameId: string

			if (gameId) {
				_gameId = gameId
			} else {
				_gameId = this.game.gameId
			}

			if (!playerId) throw new Error("player not found")

			const wsPrefix = process.env.NODE_ENV === "production" ? "wss" : "ws"
			const { data, status, open, close, send, ws } = useWebSocket(
				`${wsPrefix}://${location.host}/api/websocket?gameId=${_gameId}&playerId=${playerId}`,
			)

			this.websocket = { data, status, open, close, send, ws }

			// if (status.value !== "OPEN") throw new Error("Websocket connection failed.")

			watch(data, (newValue) => {
				console.log(newValue)
				const response = JSON.parse(newValue) as WebsocketResponse

				if (response.type === "kill") {
					const boardPiece = this.getBoardPieces.get(stringPos(response.piecePosition))
					const piece = this.getGamePieces.get(response.pieceId)

					if (!piece || !boardPiece) {
						throw new Error("Board and Game Pieces not found.")
					}

					boardPiece.pieceId = null

					piece.alive = false
					piece.boardPosition = null
				}

				if (response.type === "move") {
					const {
						pieceStart,
						pieceEnd,
					}: { pieceStart: BoardPosition; pieceEnd: BoardPosition } = response

					const startBoardPiece = this.getBoardPieces.get(stringPos(pieceStart))
					const endBoardPiece = this.getBoardPieces.get(stringPos(pieceEnd))

					if (!startBoardPiece || !endBoardPiece || !startBoardPiece.pieceId) {
						throw new Error("Board piece not found.")
					}

					const gamePiece = this.getGamePieces.get(startBoardPiece.pieceId)

					if (!gamePiece || !gamePiece.boardPosition) {
						console.error("No piece found.")
						return
					}

					startBoardPiece.pieceId = null
					endBoardPiece.pieceId = stringPos(gamePiece.boardPosition)

					gamePiece.boardPosition = pieceEnd
					this.changeTurn(this.board.turn)
				}

				if (response.type === "join") {
					console.log("join response", response)
					if (response.player === null) return // game is full

					this.player.color = response.player.color

					const playerNumber = response.playerNumber
					if (playerNumber === 1) {
						this.game.playerOne === response.player
					} else {
						this.game.playerTwo === response.player
					}
				}

				if (response.type === "restart") {
					// tell the client to make a get request for the new game data.
					this.getGame(this.game.gameId, false)
				}
			})
		},

		joinGame(gameId: string) {
			this.websocket.close() // close previous
			localStorage.setItem("gameId", JSON.stringify(gameId))
			// this.leaveGame()
			this.init()
		},

		cachedPlayer(): string | null {
			let gameId
			if (import.meta.client) {
				const gameIdCache = localStorage.getItem("playerId")

				if (gameIdCache) {
					try {
						gameId = JSON.parse(gameIdCache)
					} catch (error) {
						console.error(error)
					}
				}
			}

			return gameId
		},

		cachedGame(): string | null {
			let gameId
			if (import.meta.client) {
				const gameIdCache = localStorage.getItem("gameId")

				if (gameIdCache) {
					try {
						gameId = JSON.parse(gameIdCache)
					} catch (error) {
						console.error(error)
					}
				}
			}

			return gameId
		},

		async restartGame() {
			// send update to ws
			const payload: RestartRequest = {
				type: "restart",
				gameId: this.game.gameId,
			}
			const payloadString = JSON.stringify(payload)
			this.websocket.send(payloadString)

			this.getGame(this.game.gameId, true)
			this.resetBoardHighlights()
		},

		leaveGame() {
			this.websocket.close()
			localStorage.removeItem("gameId")
			this.init()
			this.resetBoardHighlights()
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
			const piece = this.getGamePiece(boardPosition)

			if (!piece) {
				this.board.selectedBoardPiece = null
				return
			}

			if (piece.color !== this.player.color && !this.game.playBoth) {
				this.board.selectedBoardPiece = null
				return
			}

			const path = getPathFromPiece(piece, this.board)

			if (!path) return // no moves available

			path.forEach((boardPosition) => {
				const hex = this.getBoardPiece(boardPosition)

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

		/**Get a game instance from server and update local state. */
		async getGame(gameId: string, newGame: boolean) {
			this.board.gamePieces.clear()
			let gameInstance: TransmissionGameInstance | null = null

			const playerId = this.cachedPlayer()
			if (!playerId) throw new Error("player not found") // should be generated before function call

			if (newGame) {
				gameInstance = await $fetch<TransmissionGameInstance>("/api/create-game", {
					method: "post",
					body: { gameId, playerId },
				})
			} else {
				gameInstance = await $fetch<TransmissionGameInstance | null>(`/api/${gameId}`, {
					method: "GET",
				})
			}

			// fallback
			if (!gameInstance) {
				localStorage.removeItem("gameId")
				this.getGame(gameId, true)
				return
			}

			this.updatePiecesState(gameInstance.boardState.gamePieces)

			this.game = {
				gameId: gameInstance.id,
				playerOne: gameInstance.playerOne,
				playerTwo: gameInstance.playerTwo,
				playBoth: true,
			}
		},

		resetBoardPiecesPieceId() {
			const boardPieces = this.getBoardPieces
			const boardPieceIds = Array.from(boardPieces.keys())

			boardPieceIds.forEach((id) => {
				const boardPiece = boardPieces.get(id)

				if (!boardPiece) throw new Error("Not found.")

				boardPiece.pieceId = null
			})
		},

		updatePiecesState(pieces: GamePiece[]) {
			this.resetBoardPiecesPieceId()

			pieces.forEach((piece) => {
				if (!piece.boardPosition) return

				const boardPiece = this.getBoardPiece(piece.boardPosition)
				if (!boardPiece) return
				boardPiece.pieceId = stringPos(piece.boardPosition)

				this.board.gamePieces.set(stringPos(piece.boardPosition), piece)
			})
		},

		changeTurn(currentTurn: GamePieceColor) {
			const nextTurnColor = getEnemyColor(currentTurn)
			this.board.turn = nextTurnColor
		},

		updateLatestMove(fromPos: BoardPosition, toPos: BoardPosition) {
			const piece = this.getGamePiece(fromPos)

			if (!piece) throw new Error("No piece found.")

			this.board.latestMoves[piece.color].from = fromPos
			this.board.latestMoves[piece.color].to = toPos
		},

		async movePiece(toPosition: BoardPosition) {
			if (!this.isPlayersTurn && !this.game.playBoth) return

			const selectedBoardPiece = this.board.selectedBoardPiece
			if (!selectedBoardPiece) return
			const fromPosition = selectedBoardPiece.boardPosition
			if (!selectedBoardPiece && fromPosition) throw new Error("Board piece not found.")

			this.updateLatestMove(fromPosition, toPosition)
			this.changeTurn(this.board.turn)

			const gamePiece = this.getGamePiece(fromPosition)
			if (!gamePiece) throw new Error("Piece not found")

			const side = positionContainsPiece(toPosition, this.board, gamePiece.color)
			if (side === "enemy") {
				this.kill(toPosition)
				playSound("kill")
			} else {
				playSound("move")
			}

			gamePiece.boardPosition = toPosition

			const boardPiece = this.getBoardPiece(fromPosition)
			if (boardPiece) boardPiece.pieceId = null // reset previous hex piece id .
			const newBoardPiece = this.getBoardPiece(toPosition)
			if (newBoardPiece) {
				newBoardPiece.pieceId = gamePiece.pieceId
			}

			// send update to ws
			const payload: UpdateMoveRequest = {
				type: "move",
				pieceStart: fromPosition,
				pieceEnd: toPosition,
				pieceId: gamePiece.pieceId,
				gameId: this.game.gameId,
			}

			console.log(payload)
			// console.log(payload.pieceStart)
			// console.log(payload.pieceEnd)

			const payloadString = JSON.stringify(payload)
			this.websocket.send(payloadString)

			this.resetBoardHighlights()
			this.checkCheck(toPosition)
		},

		kill(position: BoardPosition) {
			const pieceToKill = this.getGamePiece(position)
			const boardPiece = this.getBoardPiece(position)

			if (!pieceToKill || !pieceToKill.boardPosition || !boardPiece || !boardPiece.pieceId) {
				throw new Error("Error finding boardPiece or gamePiece")
			}

			let payload: KillRequest = {
				type: "kill",
				pieceId: boardPiece.pieceId,
				piecePosition: pieceToKill.boardPosition,
				gameId: this.game.gameId,
			}

			boardPiece.pieceId = null
			pieceToKill.alive = false
			pieceToKill.boardPosition = null

			const payloadString = JSON.stringify(payload)
			this.websocket.send(payloadString)
		},

		checkCheck(lastMove: BoardPosition) {
			const defenderColor = getEnemyColor(this.board.turn) // check if the enemy is check before their turn.

			const check = isCheck(this.board, defenderColor, lastMove)

			if (!check) {
				this.board.checkState[defenderColor] = null
				return // if not in check it cant be in checkmate : return
			}

			this.board.checkState[defenderColor] = "check"

			const checkmate = isCheckmate(this.board, defenderColor)
			if (!checkmate) return // leave king in check

			this.board.checkState[defenderColor] = "checkmate"
		},
	},
})
