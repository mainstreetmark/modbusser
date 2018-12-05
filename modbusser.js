const net = require('net');

module.exports = {

	/**
	 * Take a full modbus address and split it into function and local address 30001 -> 3, 1
	 * @param {string/num} address
	 */
	_explode_address(address) {
		if (typeof address !== 'stirng')
			address += ' ';
		const fn = Number(address[0]);
		const addr = address.slice(1);
		return [fn, addr];
	},

	/**
	 * Tests the target mb device againast the device definition file to see if it matches
	 * @param {socket} mb - connection to modbus device
	 * @param {json} device - device definition
	 */
	_validate_device(mb, device) {
		for (const t in device.tests.valid) {
			const test = device.tests.valid[t];
			const [fn, address] = this._explode_address(test.address);
			const fns = ['readCoils', 'readDiscreteInputs', false, 'readInputRegisters', 'readHoldingRegisters'];

			mb[fns[fn]](address, 1).then((r) => {
				console.log(address, r.response._body._valuesAsArray);
			});
		}
	},

	/**
	 * Runs through all the fingerprint files looking for a match
	 * @param {socket} mb - connection to modbus device
	 */
	_identify_device(mb) {
		console.log('id');
		const fs = require('fs');
		fs.readdir('./fingerprints', (err, items) => {
			for (let i = 0; i < items.length; i++) {
				const contents = fs.readFileSync(`./fingerprints/${items[i]}`);
				const device = JSON.parse(contents);
				this._validate_device(mb, device);
			}
		});
	},

	IdentifyDevice(ip, port, callback) {
		const Modbus = require('jsmodbus');
		const net = require('net');
		const socket = new net.Socket();
		const client = new Modbus.client.TCP(socket, 1);
		const options = {
			host: ip,
			port,
		};
		socket.on('connect', this._identify_device.bind(this, client), console.error);
		console.log(options);
		socket.connect(options);
	},

	FindDevices(startAddress, port, callback) {
		let toScan = 0;
		const scanlist = [];
		const _scan_port = function sp(startAddress, port, i) {
			const client = net.connect({
				host: startAddress + i,
				port,
			}, () => {
				scanlist.push(i);
			});
			client.on('error', () => { });
			client.on('data', (data) => {
				console.log(data.toString());
			});
			client.on('close', () => {
				toScan--;
				if (toScan === 0) {
					scanlist.sort((a, b) => a - b);
					callback(scanlist);
				}
			});
			setTimeout(() => {
				client.destroy();
			}, 300);
		};
		for (let i = 0; i < 256; i++) {
			toScan++;
			_scan_port(startAddress, port, i);
		}
	},

};
