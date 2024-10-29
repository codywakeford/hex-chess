import { defineStore } from "pinia"

export const useGameStore = defineStore("game", {
	state: () => ({
		game: {} as GameState,
		board: {
			gamePieces: [] as GamePiece[],
			boardPieces: [] as HexBoardPiece[],
			selectedBoardPiece: {} as GamePiece,
		} as BoardState,
	}),

	getters: {
		get(state) {
			return state.game
		},

		getBoard(state) {
			return state.board || { gamePieces: [], boardPieces: [] }
		},

		getGamePieces(state) {
			return (state.board && state.board.gamePieces) || []
		},

		getGamePieceFromPosition: (state) => (positionName: HexBoardPiece["name"]) => {
			const piece = state.board.gamePieces.find((piece) => {
				return piece.position === positionName
			})

			if (piece) {
				return piece
			}

			return null
		},

		getBoardPieces(state) {
			return (state.board && state.board.boardPieces) || []
		},

		getBoardPiece: (state) => (positionName: string) => {
			return state.board.boardPieces.find((piece) => {
				return piece.name === positionName
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
			const gamePiece = this.getGamePieceFromPosition(boardPiece.name)
			if (!gamePiece) return
			this.board.selectedBoardPiece = boardPiece

			this.displayPieceMoves()
		},

		displayPieceMoves() {
			const piece = this.board.selectedBoardPiece

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
