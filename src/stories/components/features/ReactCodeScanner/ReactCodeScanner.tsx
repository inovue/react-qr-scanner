import React, { useMemo, useState } from 'react'
import ReactCode from '../ReactCode/ReactCode'
import {FooterBar} from '../../ui/FooterBar/FooterBar'
import { Html5QrcodeScannerState } from 'html5-qrcode'
import { BooleanCameraCapability, CameraDevice, RangeCameraCapability } from 'html5-qrcode/esm/camera/core'

import {styles} from './ReactCodeScanner.css'

export const ReactCodeScanner = () => {
  const [state, setState] = useState<Html5QrcodeScannerState>()
  const [devices, setDevices] = useState<CameraDevice[]|undefined>()
  const [deviceId, setDeviceId] = useState<string>()
  const [torch, setTorch] = useState<BooleanCameraCapability|undefined>()
  const [zoom, setZoom] = useState<RangeCameraCapability|undefined>()
  
  const onInitializedHandler = (
    devicesResponse: CameraDevice[] | undefined,
    torchFeature: BooleanCameraCapability | undefined,
    zoomFeature: RangeCameraCapability | undefined
  ) => {
    setDevices(devicesResponse);
    setTorch(torchFeature);
    setZoom(zoomFeature);
    /*
    if (devices && devices.length > 0) {
      setDeviceId(devices[0].id)
    }
    */
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

  const [torchValue, setTorchValue] = useState<boolean>(false)
  const toggleTorch = () => {
    if(torch === undefined) return;
    (async ()=>{
      const v = !torch.value();
      await torch.apply(v);
      setTorchValue(v);
    })();
  }
  

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        {state !== undefined && Html5QrcodeScannerState.SCANNING <= state &&
          <select value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
            {devices && devices.map((device) => <option key={device.id} value={device.id}>{device.label}</option>)}
          </select>
        }
        <div className={styles.canvas}>
          <ReactCode persist state={state} onInitialized={onInitializedHandler} onScannerStateChange={onStateChangeHandler}></ReactCode>
        </div>
        {state !== undefined &&
          <FooterBar state={state} onDeviceChange={onDeviceChangeHandler} onPause={onPauseHandler} onStart={onStartHandler} onStop={onStopHandler}></FooterBar>
        }
        {torch !== undefined &&
          <button onClick={toggleTorch}>{!torchValue ? 'Torch on' : 'Torch off'}</button>
        }
      </div>
      
    </div>
  )
}
