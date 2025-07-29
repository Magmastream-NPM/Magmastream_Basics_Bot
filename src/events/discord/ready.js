const { Events } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,

	async execute(client) {
		// Deploy slash commands
		require("../../deploy-commands")(client);

		// Initialize Lavalink
		await client.manager.init({ clientId: client.user.id });

		// Print a message to the console indicating that the client is ready
		console.log(`[INFO] Ready! Logged in as ${client.user.tag}`);
	},
};
