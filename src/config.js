module.exports = {
	token: "", // required
	lastFmApiKey: "", // optional
	nodes: [
		{
			host: "", // required
			port: 9999, // required
			password: "", // required
			secure: false, // optional
			retryAmount: 500, // optional
			retryDelay: 300000, // optional
			resumeStatus: true, // optional
			resumeTimeout: 300, // optional
		},
	],
};
