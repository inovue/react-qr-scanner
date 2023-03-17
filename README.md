# ReactCodeScanner

ReactCodeScanner is a React component that enables QR and EAN/JAN barcode scanning in your web browser with minimum necessary settings. With a pre-defined user interface that manages all complex camera behaviors, you can focus on building features and defining camera states and behaviors during scanning.

## Features

ReactCodeScanner has the following features:

- Works in Chrome, Firefox, Safari, and more
- Supports QR and EAN/JAN, 20+ barcode formats
- Torch button for low-light environments
- Zoom slider for image zoom
- Facing mode button to switch between front and back cameras
- Responsive UI that adapts to different screen sizes

## Installation

You can install ReactCodeScanner via npm with the following command:

```
npm i react-code-scanner
```


## Props

ReactCodeScanner has the following props:

| Name             | Type                                    | Default                              | Description                                                                                      |
| ---------------- | --------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| state (required) | ScannerState(Enum)                      |                                      | Defines the current state of the scanner                                                         |
| mode             | string ('user' or 'environment')        | 'environment'                        | Defines the default facing mode of the camera (front or back)                                     |
| config           | ScannerConfig(Object)                   | {fps: 10, qrbox: 250}                | Defines the camera configuration, such as frames per second and QR code box size                  |
| delay            | number                                  | 1000                                 | Defines the delay between scanned events in milliseconds                                         |
| timeout          | number                                  | 60000                                | Defines the timeout in milliseconds for camera stoppage                                          |
| format           | Html5QrcodeSupportedFormats              |                                      | Defines the supported barcode format                                                               |
| fitScreen        | boolean                                 | false                                | Defines whether the scanner should fit the screen or not                                          |
| onScanSuccess    | (result: Html5QrcodeResult) => void     |                                      | Defines the callback function for when scanning is successful                                     |
| onScanError      | (error: Html5QrcodeError) => void       |                                      | Defines the callback function for when scanning fails                                             |

### Types

ReactCodeScanner has the following types:

#### ScannerState(Enum)

- UNKNOWN = 0
- NOT_STARTED = 1
- SCANNING = 2
- PAUSED = 3

## Reference

ReactCodeScanner is based on [html5-qrcode](https://github.com/mebjas/html5-qrcode). For more information on this library, please visit their Github page.


## Links

- [Publish with Vite - React, Typescript and Tailwindcss component to npm](https://www.youtube.com/watch?v=XKfeczZyEzc)
- [vite-react-ts-button](https://github.com/frontend-mastery-web/vite-react-ts-button)
- [viteでパッケージをライブラリに公開する（TypeScript対応）](https://zenn.dev/drop_table_user/articles/7b043bef6cec29)

