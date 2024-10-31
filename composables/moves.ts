// adjacent hex pieces

/**
 * A chess piece can move on 6 planes; 3 for horizontal and 3 for diagonal.
 *
 * Horizontal: Where faces meet - 3
 * - Top to bottom
 * - top-left to bottom-right
 * - bottom-left to bottom-left
 *
 * Diagonal: Where vertices point - 3
 * - These are not intuitive at first.
 * - The vertices of the hexagons point to their 'diagonal' partners.
 * - All diagonal pieces are the same color.
 *
 */
const letters = "abcdefghijk"

function getVerticalPathLength(position: BoardPosition) {
	const x = position.x

	// Handle changing number of rows
	const letterIndex = letters.indexOf(x)
	let numberOfRows = 6
	if (letterIndex <= 5) {
		numberOfRows += letterIndex
	} else {
		numberOfRows = 11
		numberOfRows -= letterIndex - 5
	}

	return numberOfRows
}

function getDiagonalPathLength(position: BoardPosition) {
	const y = position.y

	let diagonalHexagons = []

	// turn x letter into number
	const letterIndex = letters.indexOf(position.x)
	let distanceToCenter: number

	if (y <= 6 && letterIndex <= 5) {
		distanceToCenter = 5 - letterIndex

		// calc distnace to the center
	}
}

export function getVerticalPath(position: BoardPosition) {
	// plane 1 - vertical

	let verticalPaths: BoardPosition[] = []
	const pathLength = getVerticalPathLength(position)

	for (let i = 1; i <= pathLength; i++) {
		verticalPaths.push({
			x: position.x,
			y: i,
		})
		// verticalPaths.push(`${position.x}${i}`)
	}

	return verticalPaths
}

// Because of the abnormal coordinate system on a hex board
// you need to take into account the starting position.
// My solution is to use the center column as a source of truth.
// In some places you know there are 5 tiles to the left of center for example.
// You can then work out all the tiles in the line from the center.
// You can also calculate how many tiles from any side a piece is given its x and y coords.
// Though this calculation is different depending on where the piece is, hence all the if's.

// In this i use `cursorX` as a cursor that iterates around the board. Though again how you iterate over the hexagons depends where on the board the cursor is .

// export function getDiagonalPaths(position: BoardPosition): BoardPosition[] {
// 	// plane 2 - sloping down
// 	let cursorY = position.y
// 	let cursorX = position.x

// 	let diagonalHexagons: BoardPosition[] = []
// 	const letterIndex = letters.indexOf(position.x)
// 	let distanceToCenter: number = 0

// 	/**any piece in the f column. Used as a reference */
// 	let centerHex: BoardPosition

// 	// bottom left third of board //
// 	if (cursorY <= 6 && letterIndex <= 5) {
// 		distanceToCenter = 5 - letterIndex

// 		// Get all hexs' top left of current hex
// 		diagonalHexagons.push(position)
// 		while (cursorX != "a") {
// 			const index = letters.indexOf(cursorX)
// 			cursorX = letters[index - 1]
// 			diagonalHexagons.push({ x: cursorX, y: position.y })
// 		}

// 		cursorX = position.x // reset cursor

// 		if (distanceToCenter >= 0) {
// 			for (let i = 0; i < distanceToCenter; i++) {
// 				const index = letters.indexOf(cursorX)

// 				cursorX = letters[index + 1]
// 				diagonalHexagons.push({ x: cursorX, y: position.y })
// 			}
// 		}

// 		let distanceFromCenterToRight = cursorY - 1
// 		cursorY = position.y

// 		for (let i = 0; i < distanceFromCenterToRight; i++) {
// 			const index = letters.indexOf(cursorX)
// 			const nextColumn = letters[index + 1]
// 			cursorX = nextColumn
// 			cursorY -= 1

// 			diagonalHexagons.push({ x: nextColumn, y: cursorY })
// 		}

// 		return diagonalHexagons

// 		// top left sixth of the board
// 	} else if (cursorY > 6 && letterIndex < 5) {
// 		const index = letters.indexOf(cursorX)
// 		index
// 		let distanceToCenter = 5 - index

// 		// find center hex
// 		for (let i = 0; i < distanceToCenter; i++) {
// 			const index = letters.indexOf(cursorX)
// 			cursorX = letters[index + 1]
// 		}
// 		const centerHex = { x: cursorX, y: position.y }

// 		let offset = 0
// 		for (let i = 0; i < 5; i++) {
// 			const index = letters.indexOf(cursorX)
// 			offset += 1
// 			cursorX = letters[index + 1]
// 			diagonalHexagons.push({ x: cursorX, y: centerHex.y - offset })
// 		}

// 		offset = 0
// 		let distanceFromCenterToLeft = 6 - (centerHex.y - 5)
// 		cursorX = centerHex.x
// 		for (let i = 0; i < distanceFromCenterToLeft; i++) {
// 			const index = letters.indexOf(cursorX)

// 			cursorX = letters[index - 1]

// 			diagonalHexagons.push({ x: cursorX, y: centerHex.y })
// 		}
// 	} else if (letterIndex >= 5) {
// 		distanceToCenter = letterIndex - 5

// 		// top right of the board
// 		if (cursorY >= 6 - distanceToCenter) {
// 			let cursorX = position.x
// 			// Get all hexs' top left of current hex
// 			diagonalHexagons.push(position)
// 			let offset = 0

// 			// move down and right adding all hexes
// 			while (cursorX != "k") {
// 				const index = letters.indexOf(cursorX)
// 				offset += 1

// 				cursorX = letters[index + 1]
// 				diagonalHexagons.push({ x: cursorX, y: position.y - offset })
// 			}

// 			cursorX = position.x
// 			offset = 0
// 			for (let i = 0; i < distanceToCenter; i++) {
// 				const index = letters.indexOf(cursorX)

// 				offset += 1
// 				cursorX = letters[index - 1]

// 				diagonalHexagons.push({ x: cursorX, y: position.y + offset })
// 			}

// 			let distanceFromCenterToLeft = 5 - (cursorY + distanceToCenter - 6)
// 			distanceFromCenterToLeft

// 			for (let i = 0; i < distanceFromCenterToLeft; i++) {
// 				const index = letters.indexOf(cursorX)
// 				cursorX = letters[index - 1]

// 				diagonalHexagons.push({ x: cursorX, y: position.y + offset })
// 			}
// 		} else {
// 			let cursorX = position.x

// 			const index = letters.indexOf(cursorX)
// 			let distanceToCenter = index - 5

// 			diagonalHexagons.push({ x: cursorX, y: position.y })

// 			let offset = 0

// 			for (let i = 0; i < distanceToCenter; i++) {
// 				offset += 1
// 				const index = letters.indexOf(cursorX)
// 				cursorX = letters[index - 1]

// 				diagonalHexagons.push({ x: cursorX, y: position.y + offset })
// 			}

// 			const centerHex = { x: cursorX, y: position.y + offset }

// 			for (let i = 0; i < 5; i++) {
// 				const index = letters.indexOf(cursorX)
// 				cursorX = letters[index - 1]

// 				diagonalHexagons.push({ x: cursorX, y: position.y + offset })
// 			}

// 			let distanceFromCenterToRight = position.y + offset - 1
// 			distanceFromCenterToRight

// 			offset = 0

// 			cursorX = centerHex.x
// 			for (let i = 0; i < distanceFromCenterToRight; i++) {
// 				const index = letters.indexOf(cursorX)

// 				cursorX = letters[index + 1]
// 				offset += 1
// 				offset

// 				const newPosition = { x: cursorX, y: centerHex.y - offset }

// 				const exists = diagonalHexagons.some(
// 					(hex) => hex.x === newPosition.x && hex.y === newPosition.y,
// 				)

// 				// Only push if it doesn't already exist
// 				if (!exists) {
// 					diagonalHexagons.push(newPosition)
// 				}
// 			}

// 			diagonalHexagons
// 		}

// 		return diagonalHexagons
// 	}
// 	return diagonalHexagons
// }

export function getStraightPaths(position: BoardPosition) {
	const diagonalPaths = getDiagonalPaths(position)
	const verticalPaths = getVerticalPath(position)

	console.log(diagonalPaths)

	return [...diagonalPaths, ...verticalPaths]
}

function iterateTopRight(position: BoardPosition): BoardPosition {
	const index = letters.indexOf(position.x)
	let topRightPosition: BoardPosition

	let xPos: BoardPosition["x"]
	let yPos: BoardPosition["y"]

	if (index < 5) {
		xPos = letters[index + 1]
		yPos = position.y + 1
	} else {
		xPos = letters[index + 1]
		yPos = position.y
	}
	topRightPosition = { x: xPos, y: yPos }
	return topRightPosition
}

function iterateTopLeft(position: BoardPosition) {
	const index = letters.indexOf(position.x)
	let topLeftPosition: BoardPosition

	let xPos: BoardPosition["x"]
	let yPos: BoardPosition["y"]

	if (index < 6) {
		xPos = letters[index - 1]
		yPos = position.y
	} else if (index >= 6) {
		xPos = letters[index - 1]
		yPos = position.y + 1
	}

	topLeftPosition = { x: xPos, y: yPos }
	return topLeftPosition
}

function iterateBottomLeft(position: BoardPosition) {
	const index = letters.indexOf(position.x)
	let bottomLeftPosition: BoardPosition

	let xPos: BoardPosition["x"] = "a"
	let yPos: BoardPosition["y"] = 1

	if (index < 6) {
		xPos = letters[index - 1]
		yPos = position.y - 1
	} else if (index >= 6) {
		xPos = letters[index - 1]
		yPos = position.y
	}

	bottomLeftPosition = { x: xPos, y: yPos }
	return bottomLeftPosition
}

function iterateBottomRight(position: BoardPosition) {
	const index = letters.indexOf(position.x)
	let bottomRightPosition: BoardPosition

	let xPos: BoardPosition["x"] = "a"
	let yPos: BoardPosition["y"] = 1

	if (index < 6) {
		xPos = letters[index + 1]
		yPos = position.y
	} else if (index >= 6) {
		xPos = letters[index + 1]
		yPos = position.y - 1
	}

	bottomRightPosition = { x: xPos, y: yPos }
	return bottomRightPosition
}

function getDiagonalPaths(position: BoardPosition): BoardPosition[] {
	let cursorPos = position
	let diagonalHexagons: BoardPosition[] = []
	const index = letters.indexOf(position.x)
	let distanceToEdge = 50

	for (let i = 0; i < distanceToEdge; i++) {
		if (index >= 6) {
			distanceToEdge = index
		}

		if (index < 6) {
			const topRightPosition = iterateTopRight(cursorPos)

			cursorPos = topRightPosition
			diagonalHexagons.push(topRightPosition)

			if (cursorPos.x === "f") {
				//get the distance

				if (cursorPos.y <= 6) {
					distanceToEdge = 5
				} else {
					distanceToEdge = 11 - -cursorPos.y
					distanceToEdge
				}
				i = 0
			}
		}
	}
	return diagonalHexagons
}

// Quokka
const result = getDiagonalPaths({
	y: 8,
	x: "f",
})

result

// plane 3 - Sloping up
