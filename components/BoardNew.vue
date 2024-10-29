<template>
	<div class="container">
		<Hexagon
			v-for="(hex, index) in boardHexes"
			:color="hex.color"
			class="hexagon"
			:height="hexHeight"
			:style="{ left: `${hex.position[0]}px`, bottom: `${hex.position[1]}px` }"
		/>
	</div>
</template>

<script setup lang="ts">
const boardHexes = ref([])

const letters = "abcdefghijkl"

const hexHeight = "100px"
const hexHeightValue = parseInt(hexHeight)
const hexWidth = Math.sqrt(3) * (100 / 2)

const colors = ["#999", "#555", "#222", "#999", "#555", "#222"]

// Create the hexagonal board // // https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.cleanpng.com%2Fpng-hexagonal-chess-l-ancien-secret-de-la-fleur-de-vie-1933863%2F10.html&psig=AOvVaw2bmisPHcUYqEs7lNPYBjRF&ust=1730242812490000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNCkkfOWsokDFQAAAAAdAAAAABB-
async function initBoard() {
	let rowLength = 11
	let colorOffset = 0
	let numberOfRows = 11
	let colorCounter = 0
	let wrapAtColumn = 6

	// Iterate over each row
	for (let row = 1; row <= numberOfRows; row++) {
		/**px position */
		let hexPosition = [0, 0 + hexHeightValue * row]

		if (row === 7) colorCounter + 0

		// change in direction changes each row above 6
		if (row > 6) {
			hexPosition[0] = hexWidth * (row - 6)
			wrapAtColumn -= 1
			hexPosition[1] += 0 + (hexHeightValue / 2) * (row - 6)
			rowLength -= 2
		}

		// For column in row assign a board position and get color
		for (let column = 1; column <= rowLength; column++) {
			let hexPos = [...hexPosition]

			// if larger than six, place the hex above and to the right, else place below and to the right
			if (column >= wrapAtColumn) {
				hexPos[1] += (hexHeightValue / 2) * (column - 12)
			} else if (column < wrapAtColumn && row > 6) {
				hexPos[1] = 0 + (hexHeightValue / 2) * column * (row + 12)
			} else {
				hexPos[1] += (-hexHeightValue / 2) * column
			}

			// increment
			hexPos[0] += hexWidth * column

			const boardHex = {
				name: `${letters[column]}${row}`,
				position: hexPos,
			}

			if (column > 6) {
				colorCounter += 1
			} else {
				colorCounter -= 1
			}

			if (colorCounter > 2) {
				const newCounter = colorCounter - 3
				colorCounter = newCounter
			} else if (colorCounter < 0) {
				const newCounter = colorCounter + 3
				colorCounter = newCounter
			}
			console.log(colorCounter)

			if (colorCounter === 0) {
				boardHex.color = colors[0]
			} else if (colorCounter === 1) {
				boardHex.color = colors[1]
			} else if (colorCounter === 2) {
				boardHex.color = colors[2]
			}

			boardHexes.value.push(boardHex)
		}
	}
}
onMounted(async () => {
	await initBoard()
})
</script>

<style lang="sass" scoped>
.conatiner
	position: relative
</style>
