# modbusser
A set of tools for working with modbus


# Fingerprint File Format

## Identity

Used to supply information about the device, and it's vendor

## Tests

A series of tests to perform on a target, to help build a case that the device matches.

#### Valid

Rules that should pass if the target device is a match.  For example, looking for Freqency, which has an expected value of 50 or 60.

### Invalid

Rules that rule out the target as being this type.  For example, having a value of 1000 where it thinks Frequency should be.

## Map

A convenient map of all the useful registers for this device.  If a device on the LAN matches, this map can be used to ready any other values.
