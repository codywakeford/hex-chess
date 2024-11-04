// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	modules: ["@pinia/nuxt"],
	imports: {
		dirs: ["./shared/*"],
	},

	nitro: {
		imports: {
			dirs: ["./shared/*"],
		},
		experimental: {
			websocket: true,
		},
	},
})
