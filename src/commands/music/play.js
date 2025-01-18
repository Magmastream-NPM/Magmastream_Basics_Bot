const { LoadTypes } = require("magmastream");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play a song/playlist.")
		.addStringOption((option) => option.setName("query").setDescription("The search query for the song/playlist").setRequired(true)),

	async execute(client, interaction) {
		// Check if the user is in a voice channel
		if (!interaction.member.voice.channel) {
			return await interaction
				.reply("You need to be in a voice channel to use this command.")
				.catch((error) => console.log(`[ERROR] Failed to send message to channel: ${interaction.channel.id}`));
		}

		// Get the current player
		let player = client.manager.get(interaction.guild.id);

		// Check if the user is in the same voice channel as the bot
		if (player && interaction.member.voice.channel.id !== player.voiceChannel) {
			return await interaction
				.reply("You need to be in the same voice channel as the bot to use this command.")
				.catch((error) => console.log(`[ERROR] Failed to send message to channel: ${interaction.channel.id}`));
		}

		// Defer the reply
		await interaction.deferReply().catch((error) => console.log(`[ERROR] Failed to defer message to channel: ${interaction.channel.id}`));

		// Get the search query
		const query = interaction.options.getString("query");

		// Search for the query
		let res = await client.manager.search(query, interaction.member.user);

		// Check if the search returned any results
		if (res.loadType === LoadTypes.Empty || res.loadType === LoadTypes.Error) {
			return await interaction
				.editReply("No results found.")
				.catch((error) => console.log(`[ERROR] Failed to send message to channel: ${interaction.channel.id}`));
		}

		// Create the player if it doesn't exist
		try {
			player = client.manager.create({
				guild: interaction.guild.id,
				voiceChannel: interaction.member.voice.channel.id,
				textChannel: interaction.channel.id,
				selfDeafen: true,
				volume: 100,
			});
			if (player.state !== "CONNECTED") player.connect();
		} catch (error) {
			return await interaction
				.editReply(`An error occurred while creating the player: ${error.message}`)
				.catch((error) => console.log(`[ERROR] Failed to send message to channel: ${interaction.channel.id}`));
		}

		// Handle the search result
		switch (res.loadType) {
			case LoadTypes.Track:
			case LoadTypes.Search:
				// Add the track to the queue
				const track = res.tracks[0];
				player.queue.add(track);

				// Play the track if the queue is empty
				if (!player.playing && !player.paused && !player.queue.size) await player.play();

				// Reply with a success message
				await interaction
					.editReply(`Successfully added \`${track.author} - ${track.title}\` to the queue.`)
					.catch((error) => console.log(`[ERROR] Failed to send message to channel: ${interaction.channel.id}`));
				break;
			case LoadTypes.Playlist:
				// Add the playlist tracks to the queue
				res.tracks = res.playlist.tracks;

				player.queue.add(res.tracks);

				// Play the first track if the queue is empty
				if (!player.playing && !player.paused && player.queue.size === res.tracks.length) await player.play();

				// Reply with a success message
				await interaction
					.editReply(`Successfully added \`${res.playlist.name}\` playlist with \`${res.tracks.length + 1} songs\` to the queue.`)
					.catch((error) => console.log(`[ERROR] Failed to send message to channel: ${interaction.channel.id}`));
				break;
		}
	},
};
