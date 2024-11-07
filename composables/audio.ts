const soundPaths = {
	kill: "/capture.mp3",
	move: "/move-self.mp3",
}

export function playSound(sound: "move" | "kill") {
	const audio = new Audio(soundPaths[sound])

	audio.play().catch((error) => {
		return // do nothing
	})
}
