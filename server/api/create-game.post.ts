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

/**Server side memory */
let gameInstances: GameInstance[] = []

export default eventHandler(async (event) => {
	const player: Player = {
		id: generateUniqueId(),
		color: "white",
		name: "",
	}

	const gameInstance: GameInstance = {
		id: generateUniqueId(),
		playerOne: player,
		playerTwo: undefined,
		pieces: startingPieces,
		joinId: generateUniqueId(),
	}

	gameInstances.push(gameInstance)

	const playerData = { playerId: player.id, gameId: gameInstance.id, joinId: gameInstance.joinId }
	const gameData = { pieces: gameInstance.pieces }
	return {
		playerData,
		gameData,
	}
})

function generateUniqueId() {
	return `${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

const startingPieces: GamePiece[] = [
	/**black */
	//Pawns
	{
		type: "pawn",
		color: "black",
		alive: true,
		position: [2, 5],
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: [3, 6],
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: [4, 7],
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: [5, 8],
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: [6, 9],
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: [7, 8],
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: [8, 7],
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: [9, 6],
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: [10, 5],
	},

	// Bishops
	{
		type: "bishop",
		color: "black",
		alive: true,
		position: [6, 1],
	},
	{
		type: "bishop",
		color: "black",
		alive: true,
		position: [6, 3],
	},
	{
		type: "bishop",
		color: "black",
		alive: true,
		position: [6, 5],
	},

	// King
	{
		type: "king",
		color: "black",
		alive: true,
		position: [7, 2],
	},

	// Queen
	{
		type: "queen",
		color: "black",
		alive: true,
		position: [5, 2],
	},

	// Horse
	{
		type: "horse",
		color: "black",
		alive: true,
		position: [4, 3],
	},

	{
		type: "horse",
		color: "black",
		alive: true,
		position: [8, 3],
	},

	// Castle
	{
		type: "castle",
		color: "black",
		alive: true,
		position: [9, 4],
	},

	{
		type: "castle",
		color: "black",
		alive: true,
		position: [3, 4],
	},
	/**White */
	//Pawns
	{
		type: "pawn",
		color: "white",
		alive: true,
		position: [2, 17],
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: [3, 16],
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: [4, 15],
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: [5, 14],
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: [6, 13],
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: [7, 14],
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: [8, 15],
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: [9, 16],
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: [10, 17],
	},

	// Bishops
	{
		type: "bishop",
		color: "white",
		alive: true,
		position: [6, 21],
	},
	{
		type: "bishop",
		color: "white",
		alive: true,
		position: [6, 19],
	},
	{
		type: "bishop",
		color: "white",
		alive: true,
		position: [6, 17],
	},

	// King
	{
		type: "king",
		color: "white",
		alive: true,
		position: [7, 20],
	},

	// Queen
	{
		type: "queen",
		color: "white",
		alive: true,
		position: [5, 20],
	},

	// Horse
	{
		type: "horse",
		color: "white",
		alive: true,
		position: [4, 19],
	},

	{
		type: "horse",
		color: "white",
		alive: true,
		position: [8, 19],
	},

	// Castle
	{
		type: "castle",
		color: "white",
		alive: true,
		position: [9, 18],
	},

	{
		type: "castle",
		color: "white",
		alive: true,
		position: [3, 18],
	},
]
