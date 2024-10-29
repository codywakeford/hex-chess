<template>
	<div class="container">
		<Hexagon
			:color="hex.color"
			class="hexagon"
			:height="hexHeight"
			v-for="(hex, index) in boardHexes"
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
	// Iterate over each row
	for (let row = 1; row <= numberOfRows; row++) {
		/**px position */
		let hexPosition = [0, 0 + hexHeightValue * row]

		// After rows 6 the rows get shorter by 2 each row
		if (row > 6) {
			hexPosition[0] += hexWidth * (row - 6)
			hexPosition[1] = 0 + (hexHeightValue / 2) * (row + 12)
			rowLength -= 2
		}

		// Alternate color pattern every row
		if (row % 3 === 0) {
			colorOffset = 2
		} else if (row % 2 === 0) {
			colorOffset = 0
		} else {
			colorOffset = 1
		}

		// For column in row assign a board position and get color
		for (let column = 1; column <= rowLength; column++) {
			let hexPos = [...hexPosition]

			// if larger than six, place the hex above and to the right, else place below and to the right
			if (column >= 6) {
				hexPos[1] += (hexHeightValue / 2) * (column - 12)
			} else {
				hexPos[1] += (-hexHeightValue / 2) * column
			}

			// increment
			hexPos[0] += hexWidth * column

			const boardHex = {
				name: `${letters[column]}${row}`,
				position: hexPos,
			}

			if (column % 3 === 0) {
				boardHex.color = colors[0 + colorOffset]
			} else if (column % 2 === 0) {
				boardHex.color = colors[1 + colorOffset]
			} else {
				boardHex.color = colors[2 + colorOffset]
			}

			console.log(boardHex.position)
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
