const config = require("./config.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

module.exports = async (client) => {
	const rest = new REST().setToken(config.token);

	try {
		console.log(`[INFO] Started refreshing application commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = [];
		client.commands.forEach((command) => {
			try {
				// Create a copy of the command data without the execute function
				let item = {
					name: command.data.name,
					description: command.data.description,
				};

				// If the command has options, add them to the item
				if (command.data.options) {
					item.options = command.data.options;
				}

				// Add the command to the data array
				data.push(item);
			} catch (error) {}
		});

		// Put the data array to the Discord API
		await rest.put(Routes.applicationCommands(client.user.id), { body: data });

		console.log(`[INFO] Successfully reloaded ${data.length} application commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
};
