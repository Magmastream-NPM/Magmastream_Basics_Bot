const { ManagerEventTypes } = require("magmastream");

module.exports = {
	name: ManagerEventTypes.NodeConnect,
	execute(client, node) {
		console.log(`[NODECONNECT] Connected to node ${node.options.identifier}`);
	},
};
