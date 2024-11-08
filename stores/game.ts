import { useWebSocket } from "@vueuse/core"
import { getCpuMove } from "~/shared/cpu"
import { positionContainsPiece } from "~/shared/moves"
import { pawnUpgradePositions } from "~/shared/upgradePawn"
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

		gameType: "mcCooey" as GameType,

		board: {
			opponent: "cpu" as OpponentType,
			cpuLevel: 1 as number,
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
			if (!boardPiece) throw new Error("Board piece not found")

			const pieceId = boardPiece.pieceId
			if (!pieceId) return null

			const gamePiece = state.board.gamePieces.get(pieceId)
			if (!gamePiece) return null

			return gamePiece
		},

		getBoardPiece: (state) => (boardPosition: BoardPosition) => {
			return state.board.boardPieces.get(stringPos(boardPosition))
		},

		isPlayersTurn(state) {
			return state.player.color === state.board.turn
		},

		getSelectedGamePiece(state) {
			const selectedBoardPiece = state.board.selectedBoardPiece
			if (!selectedBoardPiece || !selectedBoardPiece.pieceId) {
				console.log(state.board.selectedBoardPiece)
				throw new Error("No piece found")
			}

			const selectedGamePiece = state.board.gamePieces.get(selectedBoardPiece.pieceId)
			if (!selectedGamePiece) throw new Error("No piece found")

			return selectedGamePiece
		},

		getSelectedBoardPosition(state) {
			const selectedBoardPiece = state.board.selectedBoardPiece
			if (!selectedBoardPiece || !selectedBoardPiece.pieceId) {
				console.log(state.board.selectedBoardPiece)
				throw new Error("No piece found")
			}

			const position = selectedBoardPiece.boardPosition
			if (!position) throw new Error("Position not found")

			return position
		},

		isCpuTurn(state) {
			if (!state.game.playerTwo) throw new Error("No player two found")
			if (state.game.playerTwo.id !== "cpu") return false
			return state.board.opponent === "cpu" && state.board.turn === state.game.playerTwo.color
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

			localStorage.setItem("playerId", JSON.stringify(playerId.trim()))

			console.log(playerId)
			await this.getGame(gameId, newGame)
			this.initWebsocket(gameId, playerId)

			console.log(playerId)

			this.player.id = playerId
			localStorage.setItem("gameId", JSON.stringify(gameId.trim()))
		},

		/**Connect to websocket and define listener functions. */
		initWebsocket(gameId: string, playerId: string) {
			if (!playerId) throw new Error("player not found")

			const wsPrefix = process.env.NODE_ENV === "production" ? "wss" : "ws"
			const { data, status, open, close, send, ws } = useWebSocket(
				`${wsPrefix}://${location.host}/api/websocket?gameId=${gameId}&playerId=${playerId}`,
			)

			this.websocket = { data, status, open, close, send, ws }

			watch(data, (newValue) => {
				const response = JSON.parse(newValue) as WebsocketResponse

				if (response.type === "kill") {
					console.log("ws says kill server")
					this.kill(response.piecePosition, false)
				}

				if (response.type === "move") {
					this.moveGamePiece(response.pieceStart, response.pieceEnd)
				}

				if (response.type === "join") {
					if (response.playerNumber === 0) return // game is full

					// this.player.color = response.player.color
					this.game.playerOne = response.playerOne
					this.game.playerTwo = response.playerTwo

					if (response.playerNumber === 1) {
						if (!response.playerOne) throw new Error("No player found")

						this.player = response.playerOne
					} else if (response.playerNumber === 2) {
						if (!response.playerTwo) throw new Error("No player found")

						this.player = response.playerTwo
					}
				}

				if (response.type === "joinNotification") {
					this.game.playerOne = response.playerOne
					this.game.playerTwo = response.playerTwo
				}

				if (response.type === "restart") {
					// tell the client to make a get request for the new game data.
					this.getGame(this.game.gameId, false)
				}
			})
		},

		joinGame(gameId: string) {
			this.leaveGame()
			localStorage.setItem("gameId", JSON.stringify(gameId))
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
			// tell the server
			const payload = {
				gameId: this.game.gameId,
				type: "leave",
				playerId: this.player.id,
			} as LeaveRequest

			this.websocket.send(JSON.stringify(payload))
			localStorage.removeItem("gameId")

			this.websocket.close()

			this.resetLatestMoves()
			this.resetBoardHighlights()
		},

		resetLatestMoves() {
			this.board.latestMoves = {
				white: {
					to: null,
					from: null,
				},
				black: {
					to: null,
					from: null,
				},
			}
		},

		resetBoardHighlights() {
			for (let [, boardPiece] of this.getBoardPieces) {
				if (boardPiece.highlights.has("previous")) {
					boardPiece.highlights.clear()
					boardPiece.highlights.add("previous")
					return
				}

				boardPiece.highlights.clear()
			}
		},
		selectBoardPiece(boardPiece: BoardPiece) {
			this.resetBoardHighlights()

			if (!positionContainsPiece(boardPiece.boardPosition, this.board, this.player.color)) {
				return
			}

			this.board.selectedBoardPiece = boardPiece
			this.board.selectedBoardPiece.highlights.add("selected")

			this.displayPieceMoves(boardPiece.boardPosition)
		},

		displayPieceMoves(boardPosition: BoardPosition) {
			const piece = this.getGamePiece(boardPosition)

			if (!piece) {
				this.board.selectedBoardPiece = null
				return
			}

			if (!positionContainsPiece(boardPosition, this.board, this.player.color)) return

			if (piece.color !== this.player.color) {
				this.board.selectedBoardPiece = null
				return
			}

			const path = getPathFromPiece(piece, this.board)

			if (!path) return // no moves available

			path.forEach((boardPosition) => {
				const hex = this.getBoardPiece(boardPosition)

				if (hex) {
					const side = positionContainsPiece(boardPosition, this.board, piece.color)

					if (side === "enemy") {
						hex.highlights.add("attack")
					}

					if (side === "ally") {
						hex.highlights.clear() // bug
					}

					hex.highlights.add("move")
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
					body: {
						gameId,
						playerId,
						opponent: this.board.opponent,
						gameType: this.gameType,
					},
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
				playBoth: false,
			}

			this.resetLatestMoves()
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

		updateLatestMove(fromPos: BoardPosition, toPos: BoardPosition, gamePiece: GamePiece) {
			this.board.latestMoves[gamePiece.color].from = fromPos
			this.board.latestMoves[gamePiece.color].to = toPos

			// set board highlights
			const startBoardPiece = this.getBoardPiece(fromPos)
			const endBoardPiece = this.getBoardPiece(toPos)

			if (!startBoardPiece || !endBoardPiece) throw new Error()

			startBoardPiece.highlights.has("previous")
			endBoardPiece.highlights.has("previous")
		},

		movePiece(toPosition: BoardPosition, gamePiece: GamePiece, fromPosition: BoardPosition) {
			if (!this.isPlayersTurn && !this.isCpuTurn) return

			if (!toPosition) throw new Error("toPosition undefined")

			const side = positionContainsPiece(toPosition, this.board, gamePiece.color)
			if (side === "enemy") {
				this.kill(toPosition, true)
				playSound("kill")
			} else {
				playSound("move")
			}

			this.moveGamePiece(fromPosition, toPosition)
			// this.checkPawnUpgrade(gamePiece)

			// send update to ws
			const payload: UpdateMoveRequest = {
				type: "move",
				pieceStart: fromPosition,
				pieceEnd: toPosition,
				pieceId: gamePiece.pieceId,
				gameId: this.game.gameId,
			}

			const payloadString = JSON.stringify(payload)
			this.websocket.send(payloadString)

			this.resetBoardHighlights()
			this.checkCheck(toPosition)

			if (this.isCpuTurn) this.cpuMove()
		},

		checkPawnUpgrade(gamePiece: GamePiece) {
			if (gamePiece.type !== "pawn") return
			if (!gamePiece.boardPosition) throw new Error("Game piece not found")

			const canUpgrade =
				pawnUpgradePositions
					.get(gamePiece.color)
					?.has(stringPos(gamePiece.boardPosition)) ?? false
		},

		moveGamePiece(fromPosition: BoardPosition, toPosition: BoardPosition) {
			if (!toPosition || !fromPosition) throw new Error("Positions not specified.")

			const fromBoardPiece = this.board.boardPieces.get(stringPos(fromPosition))
			const toBoardPiece = this.board.boardPieces.get(stringPos(toPosition))

			if (!fromBoardPiece || !toBoardPiece) throw new Error("Board piece not found.")
			if (!fromBoardPiece.pieceId) throw new Error("Piece ID missing from source position")

			const gamePiece = this.board.gamePieces.get(fromBoardPiece.pieceId)
			if (!gamePiece) throw new Error("Game Piece not found")

			gamePiece.boardPosition = toPosition
			toBoardPiece.pieceId = fromBoardPiece.pieceId
			fromBoardPiece.pieceId = null

			this.updateLatestMove(fromPosition, toPosition, gamePiece)
			this.changeTurn(this.board.turn)
		},

		kill(position: BoardPosition, notifyServer: boolean) {
			console.log("killing game piece")
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

			if (!notifyServer) return

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

		cpuMove() {
			if (this.board.opponent !== "cpu") return
			setTimeout(() => {
				if (!this.game.playerTwo) throw new Error("No player two found.")

				console.log("cpu movibng")

				let cpuPlayer = this.game.playerTwo

				const cpuMove = getCpuMove(this.board, cpuPlayer)

				if (
					!cpuMove ||
					!cpuMove.piece ||
					!cpuMove.piece.boardPosition ||
					!cpuMove.fromPosition
				)
					throw new Error("No move defined")

				const startBoardPiece = this.getBoardPiece(cpuMove.piece.boardPosition)
				if (!startBoardPiece) throw new Error("NO board piece found")

				this.board.selectedBoardPiece = startBoardPiece

				this.movePiece(cpuMove.toPosition, cpuMove.piece, cpuMove.fromPosition)
			}, 250)
		},
	},
})
