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
// let gameInstances: GameInstance[] = []

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

	// gameInstances.push(gameInstance)

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
		position: "b1",
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: "c2",
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: "d3",
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: "e4",
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: "f5",
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: "g4",
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: "h3",
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: "i2",
	},

	{
		type: "pawn",
		color: "black",
		alive: true,
		position: "j1",
	},

	// Bishops
	{
		type: "bishop",
		color: "black",
		alive: true,
		position: "f1",
	},
	{
		type: "bishop",
		color: "black",
		alive: true,
		position: "f2",
	},
	{
		type: "bishop",
		color: "black",
		alive: true,
		position: "f3",
	},

	// King
	{
		type: "king",
		color: "black",
		alive: true,
		position: "g1",
	},

	// Queen
	{
		type: "queen",
		color: "black",
		alive: true,
		position: "e1",
	},

	// Horse
	{
		type: "horse",
		color: "black",
		alive: true,
		position: "d1",
	},

	{
		type: "horse",
		color: "black",
		alive: true,
		position: "h1",
	},

	// Castle
	{
		type: "castle",
		color: "black",
		alive: true,
		position: "c1",
	},

	{
		type: "castle",
		color: "black",
		alive: true,
		position: "i1",
	},
	/**White */
	//Pawns
	{
		type: "pawn",
		color: "white",
		alive: true,
		position: "b7",
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: "c7",
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: "d7",
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: "e7",
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: "f7",
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: "g7",
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: "h7",
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: "i7",
	},

	{
		type: "pawn",
		color: "white",
		alive: true,
		position: "j7",
	},

	// Bishops
	{
		type: "bishop",
		color: "white",
		alive: true,
		position: "f11",
	},
	{
		type: "bishop",
		color: "white",
		alive: true,
		position: "f10",
	},
	{
		type: "bishop",
		color: "white",
		alive: true,
		position: "f9",
	},

	// King
	{
		type: "king",
		color: "white",
		alive: true,
		position: "g10",
	},

	// Queen
	{
		type: "queen",
		color: "white",
		alive: true,
		position: "e10",
	},

	// Horse
	{
		type: "horse",
		color: "white",
		alive: true,
		position: "d9",
	},

	{
		type: "horse",
		color: "white",
		alive: true,
		position: "h9",
	},

	// Castle
	{
		type: "castle",
		color: "white",
		alive: true,
		position: "c8",
	},

	{
		type: "castle",
		color: "white",
		alive: true,
		position: "i8",
	},
]
