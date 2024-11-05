const letters = "abcdefghijkl"


// Create the hexagonal board // // https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.cleanpng.com%2Fpng-hexagonal-chess-l-ancien-secret-de-la-fleur-de-vie-1933863%2F10.html&psig=AOvVaw2bmisPHcUYqEs7lNPYBjRF&ust=1730242812490000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNCkkfOWsokDFQAAAAAdAAAAABB-

export function initGameBoard(hexHeight: number) {
	const hexWidth = (2 / Math.sqrt(3)) * (hexHeight / 2) * 1.48

	const game = useGameStore()

	let rowLength = 11 // at widest point
	let numberOfRows = 11 // total
	let wrapAtColumn = 6
	let column = 1 // iterator start point
	let hexPositionNameOffset = 0 // boardPosition name offsets as you iterate up the board

	// Iterate over each row
	for (let row = 1; row <= numberOfRows; row++) {
		column = 1
		let hexPosition = [0, 0 + hexHeight * row]

		if (row > 6) {
			hexPositionNameOffset += 1
			hexPosition[0] = hexWidth * (row - 6)
			hexPosition[1] += 0 + (hexHeight / 2) * (row - 6)

			wrapAtColumn -= 1
			rowLength -= 2
		}

		// For i in row assign a board position and get color
		for (; column <= rowLength; column++) {
			/** [x, y]px */
			let hexPos = [...hexPosition]

			if (row > 6 && column < wrapAtColumn) {
				hexPos[1] += 0 + -hexHeight * (row - 6)
			}

			// if larger than six, place the hex above and to the right, else place below and to the right
			if (row > 6 && column < wrapAtColumn) {
				hexPos[1] -= -hexHeight * 2 * (-column / 4)
			} else if (column >= wrapAtColumn) {
				hexPos[1] += (hexHeight / 2) * (column - 12)
			} else {
				hexPos[1] += (-hexHeight / 2) * column
			}

			// increment x by 1 hex
			hexPos[0] += hexWidth * column

			const boardHex: BoardPiece = {
				boardPosition: {
					x: `${letters[column - 1 + hexPositionNameOffset]}`,
					y: row,
				},
				position: hexPos,
				colorIndex: 0,
				highlight: null,
				pieceId: null
			}

			// set hex color
			// Get row on horizontal plane, add 5 to offset negative numbers.
			const horizontalRow = Math.round(boardHex.position[1] / (hexHeight / 2) + 5)

			if (horizontalRow % 3 === 0) {
				boardHex.colorIndex = 0
			} else if (horizontalRow % 3 === 1) {
				boardHex.colorIndex = 1
			} else {
				boardHex.colorIndex = 2
			}
	
			game.addBoardPiece(boardHex)
		}
	}
}
