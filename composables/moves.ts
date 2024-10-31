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

		// calc distnace to the center, how man
	}
}

export function getVerticalPath(position: BoardPosition) {
	// plane 1 - vertical

	let verticalPaths = []
	const pathLength = getVerticalPathLength(position)

	for (let i = 1; i <= pathLength; i++) {
		verticalPaths.push(`${position.x}${i}`)
	}

	return verticalPaths
}

export function getDiagonalPaths(position: BoardPosition) {
	// plane 2 - sloping down
	const y = position.y

	let diagonalHexagons = []

	// turn x letter into number
	const letterIndex = letters.indexOf(position.x)
	let distanceToCenter: number = 0

	// left side of board
	if (y < 6 && letterIndex <= 5) {
		distanceToCenter = 5 - letterIndex

		// iterate over x vaue back toward center. adding each position along the way

		let xPos = position.x
		const index = letters.indexOf(xPos)
		const topLeftPosition = letters[index - 1]

		// Get all hexs' top left of current hex
		diagonalHexagons.push(position)
		while (xPos != "a") {
			const index = letters.indexOf(xPos)

			const topLeftPosition = letters[index - 1]
			xPos = topLeftPosition

			diagonalHexagons.push({ x: topLeftPosition, y: position.y })
		}

		if (distanceToCenter > 0) {
			xPos = position.x
			for (let i = 0; i < distanceToCenter; i++) {
				const index = letters.indexOf(xPos)

				xPos = letters[index + 1]
				diagonalHexagons.push({ x: xPos, y: position.y })
			}
		}

		let distanceFromCenterToRight = y - 1
		let yPos = position.y

		for (let i = 0; i < distanceFromCenterToRight; i++) {
			const index = letters.indexOf(xPos)
			const nextColumn = letters[index + 1]
			xPos = nextColumn
			yPos -= 1

			diagonalHexagons.push({ x: nextColumn, y: yPos })
		}

		return diagonalHexagons
	} else if (letterIndex >= 5) {
		distanceToCenter = letterIndex - 5

		// top right of the board
		if (y >= 6 - distanceToCenter) {
			let xPos = position.x

			// Get all hexs' top left of current hex
			diagonalHexagons.push(position)
			let offset = 0

			// move down and right adding all hexes
			while (xPos != "k") {
				const index = letters.indexOf(xPos)
				offset += 1

				xPos = letters[index + 1]
				diagonalHexagons.push({ x: xPos, y: position.y - offset })
			}

			xPos = position.x
			distanceToCenter
			offset = 0
			for (let i = 0; i < distanceToCenter; i++) {
				const index = letters.indexOf(xPos)

				offset += 1
				xPos = letters[index - 1]

				diagonalHexagons.push({ x: xPos, y: position.y + offset })
			}

			let distanceFromCenterToLeft = 5 - (y - 6)

			for (let i = 1; i <= distanceFromCenterToLeft; i++) {
				const index = letters.indexOf(xPos)
				xPos = letters[index - 1]

				diagonalHexagons.push({ x: xPos, y: position.y + offset })
			}
		}

		diagonalHexagons

		return y >= 6 - distanceToCenter
	}
}

// Quokka
const result = getDiagonalPaths({ y: 7, x: "h" })

// result

// plane 3 - Sloping up
