/**
 * This is going to give the player an id and send it to them for tracking
 *
 *
 * It will create a game instance in server memory
 * This instance will hold all of the piece states
 * it will hold the ids of both players
 * number of players in game
 * other data ...
 *
 *
 * it will add a random 'join string' to an array in the memory
 * this will allow others to reference the game
 *
 */

import { gameInstances } from "../cache"

export default eventHandler(async (event) => {
	const player: Player = {
		id: generateUniqueId(),
		color: "black",
	}

	const boardState: CreateBoardState = {
		gamePieces: startingPieces,
		selectedBoardPiece: null,
		boardPieces: [] as HexBoardPiece[],
		checkState: { white: null, black: null },
	}

	const gameInstance: GameInstance = {
		id: generateUniqueId(),
		playerOne: player,
		playerTwo: null,

		boardState: boardState,
	}

	gameInstances.set(gameInstance.id, gameInstance)
	return gameInstance
})

function generateUniqueId() {
	return `${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

const startingPieces: GamePiece[] = [
	/**white */
	//Pawns
	{
		type: "pawn",
		color: "white",
		alive: true,
		boardPosition: { x: "b", y: 1 },
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		boardPosition: { x: "c", y: 2 },
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		boardPosition: { x: "d", y: 3 },
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		boardPosition: { x: "e", y: 4 },
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		boardPosition: { x: "f", y: 5 },
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		boardPosition: { x: "g", y: 4 },
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		boardPosition: { x: "h", y: 3 },
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		boardPosition: { x: "i", y: 2 },
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		boardPosition: { x: "j", y: 1 },
	},

	// Bishops
	{
		type: "bishop",
		color: "white",
		alive: true,
		boardPosition: { x: "f", y: 1 },
	},
	{
		type: "bishop",
		color: "white",
		alive: true,
		boardPosition: { x: "f", y: 2 },
	},
	{
		type: "bishop",
		color: "white",
		alive: true,
		boardPosition: { x: "f", y: 3 },
	},

	// King
	{
		type: "king",
		color: "white",
		alive: true,
		boardPosition: { x: "g", y: 1 },
	},

	// Queen
	{
		type: "queen",
		color: "white",
		alive: true,
		boardPosition: { x: "e", y: 1 },
	},

	// Horse
	{
		type: "horse",
		color: "white",
		alive: true,
		boardPosition: { x: "d", y: 1 },
	},

	{
		type: "horse",
		color: "white",
		alive: true,
		boardPosition: { x: "h", y: 1 },
	},

	// Castle
	{
		type: "castle",
		color: "white",
		alive: true,
		boardPosition: { x: "c", y: 1 },
	},

	{
		type: "castle",
		color: "white",
		alive: true,
		boardPosition: { x: "i", y: 1 },
	},
	/**black */
	//Pawns
	{
		type: "pawn",
		color: "black",
		alive: true,
		boardPosition: { x: "b", y: 7 },
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		boardPosition: { x: "c", y: 7 },
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		boardPosition: { x: "d", y: 7 },
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		boardPosition: { x: "e", y: 7 },
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		boardPosition: { x: "f", y: 7 },
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		boardPosition: { x: "g", y: 7 },
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		boardPosition: { x: "h", y: 7 },
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		boardPosition: { x: "i", y: 7 },
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		boardPosition: { x: "j", y: 7 },
	},

	// Bishops
	{
		type: "bishop",
		color: "black",
		alive: true,
		boardPosition: { x: "f", y: 11 },
	},
	{
		type: "bishop",
		color: "black",
		alive: true,
		boardPosition: { x: "f", y: 10 },
	},
	{
		type: "bishop",
		color: "black",
		alive: true,
		boardPosition: { x: "f", y: 9 },
	},

	// King
	{
		type: "king",
		color: "black",
		alive: true,
		boardPosition: { x: "g", y: 10 },
	},

	// Queen
	{
		type: "queen",
		color: "black",
		alive: true,
		boardPosition: { x: "e", y: 10 },
	},

	// Horse
	{
		type: "horse",
		color: "black",
		alive: true,
		boardPosition: { x: "d", y: 9 },
	},

	{
		type: "horse",
		color: "black",
		alive: true,
		boardPosition: { x: "h", y: 9 },
	},

	// Castle
	{
		type: "castle",
		color: "black",
		alive: true,
		boardPosition: { x: "c", y: 8 },
	},

	{
		type: "castle",
		color: "black",
		alive: true,
		boardPosition: { x: "i", y: 8 },
	},
]
