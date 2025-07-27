const { Events } = require("discord.js");

module.exports = {
	name: Events.Raw,

	async execute(client, data) {
		// Update the voice state in the Lavalink manager
		await client.manager.updateVoiceState(data);
	},
};
