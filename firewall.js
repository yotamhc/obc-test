var lib = require('./obc-lib.js');

exports.Application = function() {
	var headerClassifier = new lib.HeaderClassifier("HeaderClassifierFirewall",
	        [
	                { ETH_TYPE: 0x0800, IPV4_PROTO: 6, TCP_DST: 8001 },
	                { }
	        ]);
	var firewall_blocks = [ lib.DEFAULT_FROM_DEVICE, headerClassifier, lib.DEFAULT_TO_DEVICE, lib.DEFAULT_DISCARD ];//, lib.DEFAULT_ETHERNET_SWAP, lib.DEFAULT_SET_TIMESTAMP ];
	var firewall_connectors = [
	        new lib.Connector(lib.DEFAULT_FROM_DEVICE, 0, headerClassifier),
	        new lib.Connector(headerClassifier, 0, lib.DEFAULT_DISCARD),
	        //new lib.Connector(headerClassifier, 1, lib.DEFAULT_ETHERNET_SWAP),
		//new lib.Connector(lib.DEFAULT_ETHERNET_SWAP, 0, lib.DEFAULT_SET_TIMESTAMP),
		//new lib.Connector(lib.DEFAULT_SET_TIMESTAMP, 0, lib.DEFAULT_TO_DEVICE)
		new lib.Connector(headerClassifier, 1, lib.DEFAULT_TO_DEVICE)
	];

	this.blocks = firewall_blocks;
	this.connectors = firewall_connectors;
}
