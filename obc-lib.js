//////////////////////////
// Blocks

exports.FromDevice = function(id, devname) {
        this.type = "FromDevice";
        if (!id)
                id = "FromDevice_Default";
        if (!devname)
                devname = INPUT_IFC;

        this.name = id;
        this.config = { devname: devname };
}

exports.ToDevice = function(id, devname) {
        this.type = "ToDevice";
        if (!id)
                id = "ToDevice_Default";
        if (!devname)
                devname = OUTPUT_IFC;

        this.name = id;
        this.config = { devname: devname };
}

exports.FromDump = function(id, filename) {
        this.type = "FromDump";
        if (!id)
                id = "FromDump_Default";
        if (!filename)
                filename = INPUT_PCAP;

        this.name = id;
        this.config = { filename: filename };
}

exports.ToDump = function(id, filename) {
        this.type = "ToDump";
        if (!id)
                id = "ToDump_Default";
        if (!filename)
                filename = OUTPUT_PCAP;

        this.name = id;
        this.config = { filename: filename };
}

exports.Discard = function(id) {
        this.type = "Discard";
        if (!id)
                id = "Discard_Default";

        this.name = id;
        this.config = { };
}

exports.EthernetDirectionSwap = function(id) {
	this.type = "NetworkDirectionSwap";
	if (!id)
		id = "NetworkDirectionSwap_Default";

	this.name = id;
	this.config = { ethernet: true };
}

exports.SetTimestamp = function(id) {
	this.type = "SetTimestamp";
	if (!id)
		id = "SetTimestamp_Default";

	this.name = id;
	this.config = { };
}

exports.HeaderClassifier = function(id, matches) {
        this.type = "HeaderClassifier";
        this.name = id;
        this.config = { match: matches };
}

exports.Connector = function(src, port, dst) {
        this.src = src.name;
        this.dst = dst.name;
        this.src_port = port;
        this.dst_port = 0;
}

//////////////////////////////////////////////////////////
// Default Blocks

exports.DEFAULT_FROM_DEVICE = new exports.FromDevice();
exports.DEFAULT_TO_DEVICE = new exports.ToDevice();
exports.DEFAULT_FROM_DUMP = new exports.FromDump();
exports.DEFAULT_TO_DUMP = new exports.ToDump();
exports.DEFAULT_DISCARD = new exports.Discard();
exports.DEFAULT_ETHERNET_SWAP = new exports.EthernetDirectionSwap();
exports.DEFAULT_SET_TIMESTAMP = new exports.SetTimestamp();
