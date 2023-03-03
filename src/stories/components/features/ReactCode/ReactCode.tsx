import React, { useEffect, useMemo, useRef } from "react";
import {Html5Qrcode, Html5QrcodeScannerState} from "html5-qrcode";
import { Html5QrcodeError, Html5QrcodeResult, QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode/esm/core";
import { BooleanCameraCapability, CameraDevice, RangeCameraCapability } from "html5-qrcode/esm/camera/core";
import {Html5QrcodeCameraScanConfig} from "html5-qrcode/esm/html5-qrcode";

import { BarcodeIcon, BarcodeIconState, TickState } from "../../ui/BarcodeIcon/BarcodeIcon";
import {BsCameraVideoOffFill} from "react-icons/bs";

import { styles, themeClass } from "./ReactCode.css";


type ReactCodeProps = {
  state?: Html5QrcodeScannerState;
  cameraId?: string | MediaTrackConstraints;
  holdTime?: number;
  timeout?: number;
  persist?: boolean;
  config?: Html5QrcodeCameraScanConfig;
  onScanned?: (result: Html5QrcodeResult) => void;
  onScanError?: (error: Html5QrcodeError) => void;
  onScannerStateChange?: (state: Html5QrcodeScannerState|undefined) => void;
  onInitialized?: (
    devices: CameraDevice[] | undefined, 
    torchFeature:BooleanCameraCapability | undefined, 
    zoomFeature:RangeCameraCapability | undefined
  ) => void;
}

const ReactCode: React.FC<ReactCodeProps> = ({
  state,
  cameraId={facingMode: "environment"}, 
  holdTime=1000, 
  timeout=30000, 
  persist=false,
  config={ fps: 10, qrbox: 250 }, 
  onScanned, 
  onScanError,
  onScannerStateChange,
  onInitialized
}) => {
  
  const qrScannerRef = useRef<Html5Qrcode>();
  
  const [stateProxy, setStateProxy] = React.useState<Html5QrcodeScannerState>();
  const [scannedAt, setScannedAt] = React.useState<number>(Date.now());
  const [timeoutIntervalId, setTimeoutIntervalId] = React.useState<number|undefined>(undefined);
  const [scannerError, setScannerError] = React.useState<Error>();
  const [tick, setTick] = React.useState<TickState|undefined>(undefined);

  const [decodeResult, setDecodeResult] = React.useState<Html5QrcodeResult>();
  const [decodeErrorResult, setDecodeErrorResult] = React.useState<Html5QrcodeError>();
  

  const onDecoded:QrcodeSuccessCallback = (decodedText, result) => {
    setDecodeResult((_)=>result);
  }
  const onDecodeError:QrcodeErrorCallback = (errorMessage, error) => {
    setDecodeErrorResult((_)=>error);
  }

  const start = async () => {
    console.log('start')
    await qrScannerRef.current?.start( cameraId, config, onDecoded, onDecodeError).catch((err:Error)=>{ throw err; } );
    setStateProxy(Html5QrcodeScannerState.SCANNING);
  }

  const stop = async () => {
    await qrScannerRef.current?.stop().catch((err:Error)=>{ throw err; });
    qrScannerRef.current?.clear();
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
  
  // pause 1s
  const sleep = (ms:number=1000) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    if(!qrScannerRef.current) qrScannerRef.current = new Html5Qrcode("qr-code-reader");
    return () => {
      (async ()=>{
        await stop();
      })();
    }
  }, []);

  // scanner sleep callback
  useEffect(()=>{
    if(timeoutIntervalId) window.clearInterval(timeoutIntervalId);
    if(stateProxy === Html5QrcodeScannerState.SCANNING){
      setTimeoutIntervalId(window.setInterval(()=>{ setStateProxy((_)=>Html5QrcodeScannerState.PAUSED); }, timeout));
    }
  }, [stateProxy, scannedAt]);


  // onStateChange callback
  useEffect(()=>{
    console.log("stateProxy", stateProxy);
    if(onScannerStateChange) onScannerStateChange(stateProxy);
  }, [stateProxy]);

  useEffect(()=>{
    console.log("state", state);
    (async ()=>{
      try{
        if(state === undefined){
            
          await start();
          if(onInitialized) {
            // const devices = await Html5Qrcode.getCameras();
            
            const capabilities = await qrScannerRef.current?.getRunningTrackCameraCapabilities();
            const torchFeature = capabilities?.torchFeature();
            const zoomFeature = capabilities?.zoomFeature();
            onInitialized([], torchFeature, zoomFeature);
          }
          
        }
        else if(state === Html5QrcodeScannerState.NOT_STARTED){
          await stop();
        }
        else if(state === Html5QrcodeScannerState.PAUSED){
          pause();
        }
        else if(state === Html5QrcodeScannerState.SCANNING){
          if(qrScannerRef.current?.getState() === Html5QrcodeScannerState.PAUSED){
            await resume();
            console.log(await qrScannerRef.current?.getRunningTrackCameraCapabilities());
          }else if(qrScannerRef.current?.getState() === Html5QrcodeScannerState.NOT_STARTED){
            await start();
          }else{
            console.info("scanner already running");
          }
        }
      }catch(err){
        if(err instanceof DOMException){
          console.log(err)
          if(err.name === "NotAllowedError") setScannerError(err);
          if(err.name === "NotFoundError") setScannerError(err);
        }
        else throw err;
      }
    })();
  }, [state])




  useEffect(()=>{
    const now = Date.now();
    if(((scannedAt + holdTime) < now) && decodeResult){
      console.log('now', now, 'scannedAt', scannedAt, 'holdTime', holdTime);
      setScannedAt((_)=>now);
      setTick((_)=>({state: BarcodeIconState.SUCCESS}));
      if(!persist) setStateProxy((_)=>Html5QrcodeScannerState.PAUSED);
      if(onScanned) onScanned(decodeResult);
    }
  } , [decodeResult]);

  useEffect(()=>{
    onScanError && decodeErrorResult && onScanError(decodeErrorResult);
  }, [decodeErrorResult]);

  
  return (
    <>
      {scannerError ? (
        <div className={styles.error.wrapper}>
          <div className={styles.error.container}>
            <BsCameraVideoOffFill size={50} className={styles.error.icon} />
            <p className={styles.error.message}>{scannerError.message}</p>
            {scannerError.name === "NotAllowedError" ? 
              <button onClick={()=>{
                (async () =>{
                  await window.navigator.mediaDevices.getUserMedia({ video: true });
                  window.location.reload()
                })();
              }}>Request permission</button>
              :
              <button onClick={()=>{window.location.reload()}}>Reload</button>
            }
            
          </div>
        </div>
        ) : (
          <div className={styles.canvasWrapper}>
            <div id="qr-code-reader" />
              {state !== undefined && Html5QrcodeScannerState.SCANNING <= state && <div className={styles.barcodeIconWrapper}><BarcodeIcon tick={tick} /></div>}
          </div>
        )
      }
    </>
  );
};

export default ReactCode;
