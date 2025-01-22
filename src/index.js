const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { Manager, UseNodeOptions, SearchPlatform } = require("magmastream");
const config = require("./config.js");

// Create a new client instance
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent],
});

// Assign Manager to the client
client.manager = new Manager({
	autoPlay: true, // Optional! - Recommanded to be true
	usePriority: false, // Optional! - Recommanded if you have more than 1 node
	replaceYouTubeCredentials: true, // Optional! - Recommanded to be true
	lastFmApiKey: config.lastFmApiKey, // Optional!
	trackPartial: ["pluginInfo", "title", "author", "duration", "uri", "requester", "artworkUrl", "sourceName", "identifier", "artistUrl"], // Optional!
	useNode: UseNodeOptions.LeastLoad, // Optional!
	defaultSearchPlatform: SearchPlatform.YouTube, // Optional! - Assuming YouTube is enabled on Lavalink
	autoPlaySearchPlatform: SearchPlatform.Spotify, // Optional! - Assuming Spotify is enabled on Lavalink
	nodes: config.nodes,
	send: async (id, payload) => {
		const guild = client.guilds.cache.get(id);
		if (guild) await guild.shard.send(payload);
	},
});

// Register commands
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");

const loadCommands = (folderPath) => {
	const commandFiles = fs.readdirSync(folderPath);

	for (const file of commandFiles) {
		const filePath = path.join(folderPath, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			// If it's a directory, recursively load commands from it
			loadCommands(filePath);
		} else if (file.endsWith(".js")) {
			const command = require(filePath);
			// Set a new item in the Collection with the key as the command name and the value as the exported module
			if ("data" in command && "execute" in command) {
				console.log(`[INFO] Loaded command: ${command.data.name}`);
				client.commands.set(command.data.name, command);
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
};

// Load commands from the main commands folder
loadCommands(foldersPath);

const loadEvents = (folderPath) => {
	// Read all files from the specified folder
	const eventFiles = fs.readdirSync(folderPath);

	for (const file of eventFiles) {
		const filePath = path.join(folderPath, file);
		const stat = fs.statSync(filePath);

		// If it's a directory, recursively load events from it
		if (stat.isDirectory()) {
			loadEvents(filePath);
		} else if (file.endsWith(".js")) {
			// Require the event module
			const event = require(filePath);

			// If the event should be handled only once
			if (event.once) {
				if (filePath.includes(`${path.sep}magmastream${path.sep}`)) {
					// Handle Magmastream events differently
					client.manager.on(event.name, (...args) => event.execute(client, ...args));
				} else {
					// Register a one-time event listener
					client.once(event.name, (...args) => event.execute(client, ...args));
				}
			} else {
				if (filePath.includes(`${path.sep}magmastream${path.sep}`)) {
					// Handle Magmastream events differently
					client.manager.on(event.name, (...args) => event.execute(client, ...args));
				} else {
					// Register a persistent event listener
					client.on(event.name, (...args) => event.execute(client, ...args));
				}
			}
			console.log(`[INFO] Loaded event: ${event.name}`);
		}
	}
};

// Load events from the main events folder
const eventsPath = path.join(__dirname, "events");
loadEvents(eventsPath);

// Log in the client
client.login(config.token);
