var lib = require('./obc-lib.js');

exports.Application = function() {
	this.blocks = [ lib.DEFAULT_FROM_DEVICE, lib.DEFAULT_TO_DEVICE, lib.DEFAULT_ETHERNET_SWAP ];
	this.connectors = [
	        new lib.Connector(lib.DEFAULT_FROM_DEVICE, 0, lib.DEFAULT_ETHERNET_SWAP),
		new lib.Connector(lib.DEFAULT_ETHERNET_SWAP, 0, lib.DEFAULT_TO_DEVICE)
	];
}
