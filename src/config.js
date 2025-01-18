module.exports = {
	token: "", // required
	lastFmApiKey: "", // optional
	nodes: [
		{
			host: "",
			port: 9999,
			password: "",
			secure: false,
			retryAmount: 500,
			retryDelay: 300000,
			resumeStatus: true,
			resumeTimeout: 300,
		},
	],
};
