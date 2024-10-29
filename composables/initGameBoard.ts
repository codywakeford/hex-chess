const letters = "abcdefghijkl"
const hexHeight = "100px"
const hexHeightValue = parseInt(hexHeight)
const hexWidth = Math.sqrt(3) * (100 / 2) - 1
const colors = ["#999", "#666", "#444"]
const colors1 = ["#d18b47", "#e8ab6f", "#ffce9e"]
const selectedColors = ref(colors1)

// Create the hexagonal board // // https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.cleanpng.com%2Fpng-hexagonal-chess-l-ancien-secret-de-la-fleur-de-vie-1933863%2F10.html&psig=AOvVaw2bmisPHcUYqEs7lNPYBjRF&ust=1730242812490000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNCkkfOWsokDFQAAAAAdAAAAABB-
export function initGameBoard() {
	const game = useGameStore()

	let rowLength = 11
	let numberOfRows = 11
	let wrapAtColumn = 6
	let column = 1
	let hexPositionNameOffset = 0

	// Iterate over each row
	for (let row = 1; row <= numberOfRows; row++) {
		column = 1
		let hexPosition = [0, 0 + hexHeightValue * row]

		if (row > 6) {
			hexPositionNameOffset += 1
			hexPosition[0] = hexWidth * (row - 6)
			hexPosition[1] += 0 + (hexHeightValue / 2) * (row - 6)

			wrapAtColumn -= 1
			rowLength -= 2
		}

		// For column in row assign a board position and get color
		for (; column <= rowLength; column++) {
			let hexPos = [...hexPosition]

			if (row > 6 && column < wrapAtColumn) {
				hexPos[1] += 0 + -hexHeightValue * (row - 6)
			}

			// if larger than six, place the hex above and to the right, else place below and to the right
			if (row > 6 && column < wrapAtColumn) {
				hexPos[1] -= -hexHeightValue * 2 * (-column / 4)
			} else if (column >= wrapAtColumn) {
				hexPos[1] += (hexHeightValue / 2) * (column - 12)
			} else {
				hexPos[1] += (-hexHeightValue / 2) * column
			}

			// increment
			hexPos[0] += hexWidth * column

			const boardHex = {
				name: `${letters[column - 1 + hexPositionNameOffset]}${row}`,
				position: hexPos,
				color: "",
				highlight: null,
			}

			// Get row on horizontal plane, add 5 to offset negative numbers.
			const horizontalRow = boardHex.position[1] / (hexHeightValue / 2) + 5

			if (horizontalRow % 3 === 0) {
				boardHex.color = selectedColors.value[0]
			} else if (horizontalRow % 3 === 1) {
				boardHex.color = selectedColors.value[1]
			} else {
				boardHex.color = selectedColors.value[2]
			}

			game.addBoardPiece(boardHex)
		}
	}
}
