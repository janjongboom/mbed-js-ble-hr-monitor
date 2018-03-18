var ble = BLEDevice();
var sensor = InterruptIn(D2);
var hr = GroveEarbudSensor(sensor);

var hrServiceUuid = '180d';
var hrCharUuid = '2a37';
var hrChar = BLECharacteristic(hrCharUuid, [ 'read', 'notify' ], 1);
var hrService = BLEService(hrServiceUuid, [ hrChar ]);

var controlLed = DigitalOut(LED1);

var ledChar = BLECharacteristic('9871', ['read', 'write'], 1);
var ledService = BLEService('9870', [ledChar]);

// This function gets invoked whenever someone writes to the characteristic over GATT
ledChar.onUpdate(function(newValue) {
    print('Updated ledChar, newValue is ' + (newValue[0] ? 'on' : 'off'));
    controlLed.write(newValue[0] ? 0 : 1);
});

ble.onConnection(function() {
    print('GATT connected');
});

ble.onDisconnection(function() {
    print('GATT disconnected');

    ble.startAdvertising();
});

ble.ready(function() {
    print('ble stack ready');

    ble.addServices([
        hrService,
        ledService
    ]);
    // startAdvertising takes: name, array of services, optional advertising interval (default 1000 ms.)
    ble.startAdvertising('JS HR monitor', [
        hrService.getUUID(),
        ledService.getUUID()
    ]);

    // built-in LED on nRF52 is 0=on, 1=off
    ledChar.write([ controlLed.read() ? 0 : 1 ]);
});

// === Application code ===
setInterval(function() {
    var rate = hr.getHeartRate();
    print("Heart rate is " + rate);

    // When a GATT connection is active, write to the battery level characteristic
    if (ble.isConnected()) {
        hrChar.write([ 0x16, rate ]);
    }
}, 1000);
