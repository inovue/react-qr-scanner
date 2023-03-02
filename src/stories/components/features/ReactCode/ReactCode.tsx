import React, { useEffect, useMemo, useRef } from "react";
import {Html5Qrcode, Html5QrcodeScannerState} from "html5-qrcode";
import { QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode/esm/core";
import { CameraDevice } from "html5-qrcode/esm/camera/core";
import {Html5QrcodeCameraScanConfig} from "html5-qrcode/esm/html5-qrcode";

import { BarcodeIcon, BarcodeIconState, TickState } from "../../ui/BarcodeIcon/BarcodeIcon";
import {MdOutlineChangeCircle} from "react-icons/md";
import {BsCameraVideoOffFill} from "react-icons/bs";

import { styles, themeClass } from "./ReactCode.css";


type ReactCodeProps = {
  state?: Html5QrcodeScannerState;
  cameraId?: string | MediaTrackConstraints;
  holdTime?: number;
  timeout?: number;
  persist?: boolean;
  config?: Html5QrcodeCameraScanConfig;
  onQrCodeSuccess?: QrcodeSuccessCallback;
  onQrCodeError?: QrcodeErrorCallback;
  onScannerStateChange?: (state: Html5QrcodeScannerState|undefined) => void;
  onInitialized?: (devices: CameraDevice[]|undefined) => void;
}

const ReactCode: React.FC<ReactCodeProps> = ({
  state,
  cameraId={facingMode: "environment"}, 
  holdTime=2000, 
  timeout=30000, 
  persist=false,
  config={ fps: 10, qrbox: 250 }, 
  onQrCodeSuccess, 
  onQrCodeError,
  onScannerStateChange,
  onInitialized,
}) => {
  
  const qrScannerRef = useRef<Html5Qrcode>();
  
  const [stateProxy, setStateProxy] = React.useState<Html5QrcodeScannerState>();
  const [scannedAt, setScannedAt] = React.useState<number>((Date.now()));
  const [timeoutIntervalId, setTimeoutIntervalId] = React.useState<number|undefined>(undefined);
  const [scannerError, setScannerError] = React.useState<Error>();
  const [tick, setTick] = React.useState<TickState|undefined>(undefined);


  const start = async () => {
    await qrScannerRef.current?.start( cameraId, config, onQrCodeSuccessWrapper, onQrCodeErrorWrapper );
    setStateProxy(Html5QrcodeScannerState.SCANNING);
  }

  const stop = async () => {
    await qrScannerRef.current?.stop().catch((err:Error)=>{ throw err; });
    setStateProxy(Html5QrcodeScannerState.NOT_STARTED);
  }

  const pause = () => {
    qrScannerRef.current?.pause(true);
    setStateProxy(Html5QrcodeScannerState.PAUSED);
  }
  
  const resume = () => {
    qrScannerRef.current?.resume();
    setStateProxy(Html5QrcodeScannerState.SCANNING);
  }


  // scanner sleep callback
  useEffect(()=>{
    if(timeoutIntervalId) window.clearInterval(timeoutIntervalId);
    if(stateProxy === Html5QrcodeScannerState.SCANNING){
      setTimeoutIntervalId(window.setInterval(()=>{ pause(); }, timeout));
    }
  }, [stateProxy, scannedAt]);


  // onStateChange callback
  useEffect(()=>{
    if(onScannerStateChange) onScannerStateChange(stateProxy);
  }, [stateProxy]);

  useEffect(()=>{
    (async ()=>{
      try{
        switch(state){
          case Html5QrcodeScannerState.SCANNING:
            await resume(); break;
          case Html5QrcodeScannerState.PAUSED:
            pause(); break;
          case Html5QrcodeScannerState.NOT_STARTED:
            await stop(); break;
          default:
            break;
        }
      }catch(err){
        throw err;
      }
    })();
  }, [state])


  const isStarting = useMemo(() => stateProxy !== undefined && stateProxy >= Html5QrcodeScannerState.SCANNING, [stateProxy]);

  const onQrCodeSuccessWrapper:QrcodeSuccessCallback = (decodedText, result) => {
    const now = Date.now();
    
    if((scannedAt + holdTime) < now){
      console.log("scannedAt", scannedAt, "holdTime", holdTime, "now", now)
      setScannedAt(now);
      setTick({state: BarcodeIconState.SUCCESS});
      if(!persist) pause();
      if(onQrCodeSuccess) onQrCodeSuccess(decodedText, result);
    }
  }
  const onQrCodeErrorWrapper:QrcodeErrorCallback = (errorMessage, error) => {
    if(onQrCodeError) onQrCodeError(errorMessage, error);
  }
  

  // initialisation
  useEffect(() => {
    (async ()=>{
      try{
        qrScannerRef.current = new Html5Qrcode("qr-code-reader")
        const devices = await Html5Qrcode.getCameras();
        if(onInitialized) onInitialized(devices);
        await start()
      }catch(err){
        if(err instanceof DOMException){
          console.log(err)
          if(err.name === "NotAllowedError") setScannerError(err);
          if(err.name === "NotFoundError") setScannerError(err);
        }
        else throw err;
      }
    })();
    return () => {
      (async ()=>{
        await stop();
      })();
    }
  }, []);

  return (
    <div className={themeClass}>
      <div className={styles.canvasWrapper}>
        <div id="qr-code-reader" />
          {isStarting && <div className={styles.barcodeIconWrapper}><BarcodeIcon tick={tick} /></div>}
      </div>
      {scannerError &&
        <div className={styles.error.wrapper}>
          <div className={styles.error.container}>
            <BsCameraVideoOffFill size={50} className={styles.error.icon} />
            <p className={styles.error.message}>{scannerError.message}</p>
            <button onClick={()=>{window.location.reload()}}>Reload</button>
          </div>
        </div>
      }
    </div>
  );
};

export default ReactCode;
