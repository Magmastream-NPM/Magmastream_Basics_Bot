const { ManagerEventTypes } = require("magmastream");

module.exports = {
	name: ManagerEventTypes.QueueEnd,
	async execute(client, player, track) {
		const channel = client.channels.cache.get(player.textChannelId);
		if (!channel) return;

		channel.send(`Queue has ended!`).catch((error) => console.log(`[QUEUEEND] Failed to send message to channel: ${player.textChannelId}`));
	},
};
