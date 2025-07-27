module.exports = {
	token: "your_token", // required
	nodes: [
		{
			host: "your_lavalink_host", // required
			port: 9999, // optional but recommanded!
			password: "your_lavalink_password", // optional but recommanded!
			useSSL: false, // optional
			maxRetryAttempts: 500, // optional
			retryDelayMs: 300000, // optional
			enableSessionResumeOption: true, // optional
			sessionTimeoutMs: 300, // optional
		},
	],
};
