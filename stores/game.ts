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

		selectBoardPiece(boardPiece: HexBoardPiece) {
			getDiagonalPaths(boardPiece.boardPosition)
			// getHorizontalPaths(boardPiece.boardPosition)
			const gamePiece = this.getGamePieceFromPosition(boardPiece.boardPosition)
			if (!gamePiece) return
			this.board.selectedBoardPiece = boardPiece

			this.displayPieceMoves()
		},

		displayPieceMoves() {
			const piece = this.getGamePieceFromPosition(this.board.selectedBoardPiece.boardPosition)

			if (!piece) return

			// highlight available moves
			if (piece.type === "pawn" && piece.color === "black") {
				// if first turn - move forward 2
				// else - move one space forward
				// if enemy to forward right - hightlight move
			}
		},

		addBoardPiece(boardPiece: HexBoardPiece) {
			this.board.boardPieces.push(boardPiece)
		},

		movePiece() {},
	},
})
