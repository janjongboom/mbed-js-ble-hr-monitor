# BLE HR monitor for Mbed.js

Connect Grove earbud sensor to pin D2 on NRF52-DK. Then:

```
git clone https://github.com/janjongboom/mbed-js-ble-hr-monitor
cd mbed-js-ble-hr-monitor
npm install
gulp --target=NRF52_DK
```

Copy build/out/NRF52_DK/mbedos5.hex to your development board.
