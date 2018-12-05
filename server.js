const modbus = require('jsmodbus');
const net = require('net')
;

const server = new net.Server();
const Server = new modbus.server.TCP(server);

server.listen(502);
