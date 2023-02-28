import React, { useEffect, useRef } from "react";
import {Html5Qrcode, Html5QrcodeScannerState} from "html5-qrcode";
import { QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode/esm/core";
import {Html5QrcodeCameraScanConfig} from "html5-qrcode/esm/html5-qrcode";

type ReactCodeProps = {
  cameraId?: string | MediaTrackConstraints;
  onQrCodeSuccess?: QrcodeSuccessCallback;
  onQrCodeError?: QrcodeErrorCallback;
  holdTime?: number;
  timeout?: number;
  config?: Html5QrcodeCameraScanConfig
}

const ReactCode: React.FC<ReactCodeProps> = ({
  cameraId={facingMode: "environment"}, 
  holdTime=1000, 
  timeout=30000, 
  config={ fps: 10, qrbox: 250 }, 
  onQrCodeSuccess, 
  onQrCodeError
}) => {
  
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  
  const [scannerState, setScannerState] = React.useState<Html5QrcodeScannerState>(Html5QrcodeScannerState.UNKNOWN);
  const [scannedAt, setScannedAt] = React.useState<number>(Date.now());
  const [timeoutIntervalId, setTimeoutIntervalId] = React.useState<number|undefined>(undefined);
  
  useEffect(()=>{
    window.clearInterval(timeoutIntervalId);
    if(scannerState === Html5QrcodeScannerState.SCANNING){
      setTimeoutIntervalId(window.setInterval(()=>{
        pause();
      }, timeout));
    }
  }, [scannerState, scannedAt]);
  
  
  const pause = () => {
    if(!qrScannerRef.current) throw new Error("qrScannerRef is null");
    qrScannerRef.current.pause();
    setScannerState(Html5QrcodeScannerState.PAUSED);
  }
  const resume = () => {
    if(!qrScannerRef.current) throw new Error("qrScannerRef is null");
    qrScannerRef.current.resume();
    setScannerState(Html5QrcodeScannerState.SCANNING);
  }

  const onQrCodeSuccessWrapper:QrcodeSuccessCallback = (decodedText, result) => {
    const now = Date.now();
    if((scannedAt + holdTime) > now){
      setScannedAt(now);
      if(onQrCodeSuccess) onQrCodeSuccess(decodedText, result);
    }
  }
  const onQrCodeErrorWrapper:QrcodeErrorCallback = (errorMessage, error) => {
    if(onQrCodeError) onQrCodeError(errorMessage, error);
  }
  
  useEffect(()=>{
    (async() => {
      qrScannerRef.current = new Html5Qrcode("qr-code-reader");
      if(!qrScannerRef.current) throw new Error("qrScannerRef is null");
      await qrScannerRef.current.start( cameraId, config, onQrCodeSuccessWrapper, onQrCodeErrorWrapper );
    })();
    return () => {
      (async() => {
        if(!qrScannerRef.current) throw new Error("qrScannerRef is null");
        await qrScannerRef.current.stop();
        qrScannerRef.current.clear();
      })();
    };
  }, []);

  return (
    <>
      <div id="qr-code-reader"></div>
    </>
  );
};

export default ReactCode;
