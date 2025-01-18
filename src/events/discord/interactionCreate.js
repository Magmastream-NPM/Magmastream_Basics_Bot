const { Events, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	
	async execute(client, interaction) {
		// Only handle chat input commands
		if (!interaction.isChatInputCommand()) return;

		// Get the command from the command collection
		const command = client.commands.get(interaction.commandName);

		// If no command is found, log an error
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			// Execute the command
			await command.execute(client, interaction);
		} catch (error) {
			// Log the error
			console.error(error);

			// Reply with an ephemeral message if the interaction has already been replied to
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			}
		}
	},
};