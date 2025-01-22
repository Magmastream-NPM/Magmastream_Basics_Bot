const { ManagerEventTypes } = require("magmastream");

module.exports = {
	name: ManagerEventTypes.TrackStart,
	async execute(client, player, track) {
		const channel = client.channels.cache.get(player.textChannel);
		if (!channel) return;

		channel
			.send(`Now playing: \`${track.title}\`, requested by \`${track.requester.username}\`.`)
			.catch((error) => console.log(`[TRACKSTART] Failed to send message to channel: ${player.textChannel}`));
	},
};
