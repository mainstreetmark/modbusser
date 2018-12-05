const mb = require('./modbusser.js');


// mb.FindDevices('10.1.10.', 502, console.log);

mb.IdentifyDevice('10.1.10.226', 502, console.log);
