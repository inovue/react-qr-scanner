import React, { useState } from 'react'
import ReactCode from '../ReactCode/ReactCode'
import {FooterBar} from '../../ui/FooterBar/FooterBar'
import { Html5QrcodeScannerState } from 'html5-qrcode'
import { CameraDevice } from 'html5-qrcode/esm/camera/core'

export const ReactCodeScanner = () => {
  const [state, setState] = useState<Html5QrcodeScannerState|undefined>(Html5QrcodeScannerState.NOT_STARTED)
  const [devices, setDevices] = useState<CameraDevice[]|undefined>()
  const [deviceId, setDeviceId] = useState<string>()
  
  const onInitializedHandler = () => {
    console.log('initialized')
  }
  const onDeviceChangeHandler = () => {
    setDeviceId(deviceId)
  }
  const onPauseHandler = () => {
    setState(Html5QrcodeScannerState.PAUSED)
  }
  const onStartHandler = () => {
    setState(Html5QrcodeScannerState.SCANNING)
  }
  const onStopHandler = () => {
    setState(Html5QrcodeScannerState.NOT_STARTED)
  }
  const onStateChangeHandler = (v: Html5QrcodeScannerState|undefined) => {
    setState(v)
  }

  
  return (
    <div>
      <ReactCode persist state={state} onInitialized={onInitializedHandler} onScannerStateChange={onStateChangeHandler}></ReactCode>
      <FooterBar state={state} onDeviceChange={onDeviceChangeHandler} onPause={onPauseHandler} onStart={onStartHandler} onStop={onStopHandler}></FooterBar>
      <select value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
        {devices && devices.map((device) => <option key={device.id} value={device.id}>{device.label}</option>)}
      </select>
      
    </div>
  )
}
