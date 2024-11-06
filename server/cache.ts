/**
 * Volatile server memory used for game data.
 * This is only used as its a low throughput game.
 */
export let gameInstances: GameInstanceCache = new Map()
