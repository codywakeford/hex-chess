function upgradePawn(boardState: BoardState, pieceId: string, upgradeTo: GamePiece["type"]) {}

export const pawnUpgradePositions = new Map<string, Set<string>>([
	["white", new Set(["a6", "b7", "c8", "d9", "e10", "f11", "g10", "h9", "i8", "j7", "k6"])],
	["black", new Set(["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1", "i1", "j1", "k1"])],
])
