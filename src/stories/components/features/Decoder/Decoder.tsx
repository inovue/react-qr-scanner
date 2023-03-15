import React, { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { usePrevious } from "react-use";

import { CameraDevice } from 'html5-qrcode/esm/camera/core';
import { QrcodeSuccessCallback, QrcodeErrorCallback } from "html5-qrcode/esm/core";


export type DecoderProps = {
  state: Html5QrcodeScannerState;
  torch?: Torch;
  zoom?: Zoom;
  onChangeState: (state:Html5QrcodeScannerState) => void;
  onChangeTorch?: (torch:Torch|undefined) => void;
  onChangeZoom?: (zoom:Zoom|undefined) => void;
  onChangeCameras?: (cameras:CameraDevice[]|undefined) => void;
  onError?: (error:Error) => void;

  onScanSuccess?: QrcodeSuccessCallback;
  onScanError?: QrcodeErrorCallback;

  id?: string;
}
export const Decoder:React.FC<DecoderProps> = ({
  state, torch, zoom, 
  onChangeState, 
  onChangeTorch, 
  onChangeZoom, 
  onChangeCameras, 
  onError, 
  onScanSuccess,
  onScanError,
  id='qr-code-reader'
}) => {
  const decoderRef = useRef<Html5Qrcode>();
  const prevState = usePrevious(state);
  
  useEffect(()=>{
    return ()=>{ stop(true); }
  }, []);

  useEffect(()=>{
    console.log('prevState, state', prevState, state );
    request(state);
  }, [state]);

  useEffect(()=>{
    if(!decoderRef.current) return;
    if(torch?.value === undefined || torch?.value === null) return;
    decoderRef.current.getRunningTrackCameraCapabilities().torchFeature().apply(torch.value).then(()=>{
      console.log('Torch applied', torch);
    });
  }, [torch]);

  useEffect(()=>{
    if(!decoderRef.current) return;
    if(zoom?.value === undefined || zoom?.value === null) return;
    const appliedValue = zoom.value < zoom.min ? zoom.min : zoom.max < zoom.value ? zoom.max : zoom.value;
    decoderRef.current.getRunningTrackCameraCapabilities().zoomFeature().apply(appliedValue).then(()=>{
      console.log('Zoom applied', zoom);
    });
  }, [zoom]);


  const start = async () => {
    if(!decoderRef.current) return;
    await decoderRef.current.start({facingMode:'environment'},{fps: 10, qrbox: 250}, onScanSuccess, onScanError);
    onChangeTorch && onChangeTorch(getTorch(decoderRef.current));
    onChangeZoom && onChangeZoom(getZoom(decoderRef.current));
  }
  const stop = async (clear:boolean=false) => {
    if(!decoderRef.current) return;
    if(Html5QrcodeScannerState.SCANNING <= decoderRef.current.getState()) await decoderRef.current.stop();
    if(clear) decoderRef.current.clear();
    onChangeTorch && onChangeTorch(undefined);
    onChangeZoom && onChangeZoom(undefined);
  }
  

  const request = async (nextState:Html5QrcodeScannerState) => {
    if(!decoderRef.current){
      decoderRef.current = new Html5Qrcode(id);
      await Html5Qrcode.getCameras().then(cameras => {
        onChangeCameras && onChangeCameras(cameras);
      }).catch((error:Error) => {
        console.log('[init] error', error);
        onError && onError(error);
      })
    }
    
    switch(nextState) {
      case Html5QrcodeScannerState.SCANNING:
        if(prevState === undefined){
          await start();
        } else if( prevState === Html5QrcodeScannerState.PAUSED) {
          decoderRef.current.resume();
        } else if (Html5QrcodeScannerState.NOT_STARTED <= prevState) {
          if(Html5QrcodeScannerState.SCANNING <= prevState) await stop();
          await start();
        }else{
          console.log('Unhandled state:', prevState);
        }
        break;
      case Html5QrcodeScannerState.PAUSED:
        if(decoderRef.current.getState() < Html5QrcodeScannerState.SCANNING){
          await start();
          await sleep(100);
        }
        decoderRef.current.pause(true);
        break;
      case Html5QrcodeScannerState.NOT_STARTED:
        await stop();
        break;
    }
    onChangeState && onChangeState(nextState);
  }
  return <div id={id} />;
}

export type Torch = {
  isSupported: boolean;
  value: boolean | null;
}
export const getTorch = (decoder:Html5Qrcode):Torch => {
  const capabilities = decoder.getRunningTrackCameraCapabilities();
  const torchFeature = capabilities.torchFeature();
  return {
    isSupported: torchFeature.isSupported(),
    value: torchFeature.value(),
  }
}

export type Zoom = {
  isSupported: boolean;
  min: number;
  max: number;
  step: number;
  value: number | null;
}
export const getZoom = (decoder:Html5Qrcode):Zoom => {
  const capabilities = decoder.getRunningTrackCameraCapabilities();
  const zoomFeature = capabilities.zoomFeature();
  return {
    isSupported: zoomFeature.isSupported(),
    min: zoomFeature.min(),
    max: zoomFeature.max(),
    step: zoomFeature.step(),
    value: zoomFeature.value(),
  }
}


export const sleep = (msec:number) => new Promise(resolve => setTimeout(resolve, msec));