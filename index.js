INPUT_IFC = 'obi-eth0';
OUTPUT_IFC = 'obi-eth0';
INPUT_PCAP = '/home/yotam/in_pcap.pcap'
OUTPUT_PCAP = '/home/yotam/out_pcap.pcap'

USE_DEVICES = true;

module.exports = require('./node_modules/express/lib/express');

domain = require('domain'),
d = domain.create();

d.on('error', function(err) {
  console.error(err);
});

var express = require('express');
var app = express();

var http = require('http');

var Client = require('node-rest-client').Client;
var client = new Client();


var bodyParser = require('body-parser');
//var multer = require('multer'); 

app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer({inMemory: true})); // for parsing multipart/form-data

//////////////////////////////////////////////////////////
// Objects
function FromDevice(id, devname) {
	this.type = "FromDevice";
	this.name = id;
	this.config = { devname: devname };
}

function ToDevice(id, devname) {
	this.type = "ToDevice";
	this.name = id;
	this.config = { devname: devname };
}

function FromDump(id, filename) {
	this.type = "FromDump";
	this.name = id;
	this.config = { filename: filename };
}

function ToDump(id, filename) {
	this.type = "ToDump";
	this.name = id;
	this.config = { filename: filename };
}

function Discard(id) {
	this.type = "Discard";
	this.name = id;
	this.config = { };
}

function Match() {
	
}

function HeaderClassifier(id, matches) {
	this.type = "HeaderClassifier";
	this.name = id;
	this.config = { match: matches };
}

function Connector(src, port, dst) {
	this.src = src.name;
	this.dst = dst.name;
	this.src_port = port;
	this.dst_port = 0;
	
//	this._src_obj = src;
//	this._dst_obj = dst;	
}

//////////////////////////////////////////////////////////
// Samples

var fromDevice = new FromDevice("FromDeviceFirewall", INPUT_IFC);
var fromDump = new FromDump("FromDumpFirewall", INPUT_PCAP);
var headerClassifier = new HeaderClassifier("HeaderClassifierFirewall",
        [
                { ETH_TYPE: 0x0800, IPV4_PROTO: 6, TCP_DST: 80 },
                { }
        ]);
var toDevice = new ToDevice("ToDeviceFirewall", OUTPUT_IFC);
var toDump = new ToDump("ToDumpFirewall", OUTPUT_PCAP);
var discard = new Discard("DiscardFirewall");

if (USE_DEVICES) {
	var firewall_blocks = [ fromDevice, headerClassifier, toDevice, discard ];
	var firewall_connectors = [
		new Connector(fromDevice, 0, headerClassifier),
		new Connector(headerClassifier, 0, discard),
		new Connector(headerClassifier, 1, toDevice)
	];
} else {
	var firewall_blocks = [ fromDump, headerClassifier, toDump, discard ];
	var firewall_connectors = [
		new Connector(fromDump, 0, headerClassifier),
		new Connector(headerClassifier, 0, discard),
		new Connector(headerClassifier, 1, toDump)
	];
}


var setProcessingGraphRequest = {
	type: "SetProcessingGraphRequest",
	required_modules: [],
//	blocks: [],
//	connectors: []
	blocks: firewall_blocks,
	connectors: firewall_connectors
};

//////////////////////////////////////////////////////////
// Messages

function sendMessage(msg, host) {

	var host_addr = host.substr(0, host.indexOf(':'));
	console.log('Sending msg ' + msg.type + ' to host ' + host_addr);
	console.log(' 	' + JSON.stringify(msg));
	var args = {
		data: msg,
		headers: { "Content-Type": "application/json" } 
	};
	client.post('http://' + host_addr + ':' + '3636/message/' + msg.type, args,
		function(data, res) {
			console.log('Sent msg ' + msg.type);
			console.log('Body: ' + msg.body);
			console.log('Response status: ' + res.statusCode + ' body: ' + JSON.stringify(data));
		});

}

app.post('/message/Hello', function(req, res) {
	console.log('Received Hello message from ' + req.headers.host);
	res.status(200).end();

	sendMessage(setProcessingGraphRequest, req.headers.host);
});

app.post('/message/KeepAlive', function(req, res) {
	console.log('Received KeepAlive message from ' + req.headers.host);
	res.status(200).end();
});

app.post('/message/SetProcessingGraphResponse', function(req, res) {
	console.log('Received SetProcessingGraphResponse message from ' + req.headers.host);
	res.status(200).end();
});

app.post('/message/Error', function(req, res) {
	console.log('Received ERROR message from ' + req.headers.host);
	console.log('	Error type: ' + req.body.error_type + '\n' +
		    '	Error subtype: ' + req.body.error_subtype + '\n' +
		    '	Message: ' + req.body.message + '\n' +
		    '	Extended message: ' + req.body.extended_message);
});

var server = app.listen(3637, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Controller is listening at http://%s:%s', host, port);
});
