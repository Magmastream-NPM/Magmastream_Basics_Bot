const { Events } = require("discord.js");

module.exports = {
	name: Events.Raw,

	execute(client, data) {
		// Update the voice state in the Lavalink manager
		client.manager.updateVoiceState(data);
	},
};
