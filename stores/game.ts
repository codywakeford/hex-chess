import { defineStore } from "pinia"

export const useGameStore = defineStore("game", {
	state: () => ({
		game: {} as GameState,
		board: {
			gamePieces: [] as GamePiece[],
			boardPieces: [] as HexBoardPiece[],
			selectedBoardPiece: {} as HexBoardPiece,
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

		getGamePieceFromPosition: (state) => (positionName: HexBoardPiece["boardPosition"]) => {
			const piece = state.board.gamePieces.find((piece) => {
				return piece.boardPosition === positionName
			})

			if (piece) {
				return piece
			}

			return null
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
			const data = await $fetch("/api/create-game", {
				method: "post",
			})
			if (data) {
				const pieces: GamePiece[] = data.gameData.pieces
				this.board.gamePieces = pieces
			}
		},

		resetBoardHighlights() {
			this.board.boardPieces.forEach((hex) => (hex.highlight = null))
		},

		selectBoardPiece(boardPiece: HexBoardPiece) {
			this.resetBoardHighlights()
			this.board.selectedBoardPiece = boardPiece

			// const gamePiece = this.getGamePieceFromPosition(boardPiece.boardPosition)

			// this.displayPieceMoves()
			this.board.selectedBoardPiece.highlight = "selected"
		},

		displayPieceMoves() {
			const piece = this.getGamePieceFromPosition(this.board.selectedBoardPiece.boardPosition)

			// if (!piece) return

			const straightPaths = getStraightPaths(this.board.selectedBoardPiece.boardPosition)
			// console.log(straightPaths)
			straightPaths.forEach((boardPosition) => {
				const hex = this.board.boardPieces.find((hex) => {
					return (
						hex.boardPosition.x === boardPosition.x &&
						hex.boardPosition.y === boardPosition.y
					)
				})

				if (hex) {
					hex.highlight = "move"
				}

				console.log(hex)
			})
		},

		addBoardPiece(boardPiece: HexBoardPiece) {
			this.board.boardPieces.push(boardPiece)
		},

		movePiece() {},
	},
})
