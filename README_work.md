独自React componetを作ったので、githubで公開するお勧めのREADDME.mdを作って
以下にコンポーネントの詳細のmarkdownです。

## Featureを美しい説明になるように修正してほしいです。
## Propsもテーブル形式で美しく修正してほしいです。

# ReactCodeScanner

===

Scanner functions can be used with "minimum necessary settings" as a "react component".
QR and EAN/JAN 20+ Barcode Scanner that works in your browser.
A pre-defined UI manages all complex camera behaviors.
So developers can focus on building features.
The developer only needs to define the behavior during scanning and the state of the camera to use it.


## Feature
* Works in Chrome, Firefox, Safari, etc
* Supported QR and EAN/JAN, 20+ Barcode format
* Torch button
* Zoom slider
* Facing mode button
* Controll camera state. Start and Stop, Pause, Resume
* Responsive UI


## Installation
```
npm i react-code-scanner

```


## Props
name | type | default | description
---|---|---|---
state (require) | ScannerState(Enum) |  | scanner state
mode | string ('user' or 'environment')|  'environment' | camera default facing mode
config | ScannerConfig(Object) | {fps: 10, qrbox: 250} | camera configuration fps etc
delay | number | 1000 | each scanned next event delay (ms)
timeout | number | 60000 |  timeout milli second for camera stop (ms)
format | Html5QrcodeSupportedFormats;
fitScreen | boolean | false | container css value false->[width:100%; height:100%;], true->[ width:100dvw; height:100dvh;]
onScanSuccess(required) | (result: Html5QrcodeResult) => void | | scan success callback function
onScanError | (error: Html5QrcodeError) => void | | scan error  callback function


### Types

#### ScannerState(Enum)
  UNKNOWN = 0
  NOT_STARTED = 1
  SCANNING = 2
  PAUSED = 3



## Referense

[html5-qrcode](https://github.com/mebjas/html5-qrcode)