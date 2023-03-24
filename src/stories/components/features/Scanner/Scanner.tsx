import React, { useEffect, useMemo, useState } from "react";
import { Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { CameraDevice } from 'html5-qrcode/esm/camera/core';

import {Button} from '../../ui/Button/Button';
import { FaPlay, FaPause } from 'react-icons/fa';
import { MdFlipCameraAndroid, MdFlashlightOn, MdFlashlightOff } from 'react-icons/md';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import { SlClose } from 'react-icons/sl'

import {styles} from './style.css';
import {Decoder, Torch, Zoom} from '../Decoder/Decoder';
import {Card} from '../../ui/Card/Card';
import { useOrientation, useTimeout } from "react-use";
import { BarcodeIcon, IconColor } from "../../ui/BarcodeIcon/BarcodeIcon";
import { Html5QrcodeError, Html5QrcodeResult } from "html5-qrcode/esm/core";
import { Html5QrcodeCameraScanConfig } from "html5-qrcode/esm/html5-qrcode";
import { style } from "@vanilla-extract/css";

export const ScannerState = {
  UNKNOWN: Html5QrcodeScannerState.UNKNOWN,
  NOT_STARTED: Html5QrcodeScannerState.NOT_STARTED,
  SCANNING: Html5QrcodeScannerState.SCANNING,
  PAUSED: Html5QrcodeScannerState.PAUSED,
}
export type ScannerStateType = typeof ScannerState[keyof typeof ScannerState]

export type ScannerProps = {
  state: ScannerStateType;
  mode?: 'user' | 'environment';
  config?: Html5QrcodeCameraScanConfig;
  delay?: number;
  timeout?: number;
  format?: Html5QrcodeSupportedFormats;
  fitScreen?: boolean;
  onScanSuccess: (result: Html5QrcodeResult) => void;
  onScanError?: (error: Html5QrcodeError) => void;
}

export const Scanner:React.FC<ScannerProps> = ({mode='environment', config={fps: 10, qrbox: 250}, delay=1000, timeout=60000, format=Html5QrcodeSupportedFormats.QR_CODE, fitScreen=false ,onScanSuccess, onScanError}) => {
  const [state, setState] = useState<ScannerStateType>(ScannerState.SCANNING);
  const [torch, setTorch] = useState<Torch>();
  const [zoom, setZoom] = useState<Zoom>();

  const [cameraId, setCameraId] = useState<string | MediaTrackConstraints>({facingMode: mode});
  const [cameras, setCameras] = useState<CameraDevice[]>();

  const [error, setError] = useState<Error>();

  const [scannerResult, setScannerResult] = useState<Html5QrcodeResult>();
  const [scannerError, setScannerError] = useState<Html5QrcodeError>();
  const [iconColor, setIconColor] = useState<IconColor>();
  const [isUnrumble, clearRumble, resetRumble] = useTimeout(300);

  const [isTimeout, clearTimeout, resetTimeout] = useTimeout(timeout);
  const [isUnbusy, clearBusy, resetBusy] = useTimeout(delay);

  const OrientationState = useOrientation();
  const orientation = useMemo(()=>OrientationState.type.includes('landscape') ? 'landscape' : 'portrait', [OrientationState.type]);
  

  useEffect(()=>{
    if(ScannerState.NOT_STARTED<state){
      resetTimeout();
    }
  },[state]);

  useEffect(()=>{
    if(!!scannerResult && isUnbusy()){
      setIconColor('success'); resetRumble();
      resetTimeout();
      resetBusy();
      onScanSuccess && onScanSuccess(scannerResult);
    }
  }, [scannerResult]);

  useEffect(()=>{
    if(!!scannerError && isUnbusy()){
      setIconColor('error'); resetRumble();
      resetTimeout();
      resetBusy();
      onScanError && onScanError(scannerError);
    }
  }, [scannerError]);
  
  useEffect(()=>{ 0<timeout && !!isTimeout() && setState(ScannerState.NOT_STARTED) }, [isTimeout()]);
  useEffect(()=>{ !!isUnrumble() && setIconColor('base'); }, [isUnrumble()]);

  const setNextCameraId = () => {
    if(!cameraId || !cameras || cameras.length < 2) return;
    const cameraIdIndex = cameras.findIndex((camera)=>camera.id === cameraId);
    const nextCameraIdIndex = cameraIdIndex < cameras.length-1 ? cameraIdIndex+1 : 0;
    const nextCameraId = cameras[nextCameraIdIndex].id;
    setCameraId(nextCameraId);
    resetTimeout();
  }
  const toggleTorch = ()=>{
    setTorch(()=>(torch ? {...torch, value:!torch.value} : undefined))
    resetTimeout();
  }

  const addZoom = (zoom:Zoom, value:number) => {
    const appliedValue = zoom.value ? zoom.value + value : zoom.min + value;
    return appliedValue < zoom.min ? zoom.min : zoom.max < appliedValue ? zoom.max : appliedValue;
  }

  return (
    <div className={styles.container({orientation:orientation, fitScreen:fitScreen})}>
      {cameras !== undefined && 
        <div className={styles.toolbar({orientation:orientation})}>
          { ScannerState.NOT_STARTED < state && 
            <Button onClick={()=>setState((_)=>ScannerState.NOT_STARTED)}>
              <SlClose />
            </Button>
          }
        </div>
      }
      <div className={styles.main}>
        {cameras === undefined && !error && <Card type='loading'></Card>}
        {!!error ?
          <Card type='error' title="ERROR" message={error.message}></Card>:
          <>
            <Decoder 
              state={state} 
              cameraId={cameraId}
              config={config}
              torch={torch} 
              zoom={zoom} 
              onChangeState={(v)=>setState(v)} 
              onChangeTorch={(v)=>setTorch(v)} 
              onChangeZoom={(v)=>setZoom(v)} 
              onChangeCameraId={(v)=>!!v && setCameraId(v)} 
              onChangeCameras={(v)=>setCameras(v)} 
              onError={(v)=>setError(v)} 
              onScanSuccess={ (_, result)=>{console.log(result); setScannerResult(result);}}
              onScanError={(_, error)=>{/*console.log(error); setScannerError(error); */}}
            />
            {cameras !== undefined &&  ScannerState.NOT_STARTED < state && 
              <div className={styles.barcodeIcon}>
                <BarcodeIcon format={format} rumble={!isUnrumble()} color={iconColor}/>
              </div>
            }

            { zoom && zoom.isSupported && ScannerState.NOT_STARTED < state &&
              <div className={styles.zoom({orientation:orientation})}>
                <Button size="sm" onClick={(_)=>{setZoom(()=>({...zoom, value:addZoom(zoom, zoom.step*-5)}))}}><AiOutlineZoomOut /></Button>
                  <input className={styles.zoomRange({orientation:orientation})} type="range" min={zoom.min} max={zoom.max} step={zoom.step} value={zoom.value??zoom.min} onChange={(e)=>{setZoom(()=>({...zoom, value:Number(e.target.value)??zoom.min}))}}/> 
                <Button size="sm" onClick={(_)=>{setZoom(()=>({...zoom, value:addZoom(zoom, zoom.step*5)}))}}><AiOutlineZoomIn /></Button>
              </div>
            }
          </>
        }
        
      </div>
      {cameras !== undefined && !error && 
        <div className={styles.toolbar({orientation:orientation})}>
          <Button disabled={!cameras || cameras.length < 2 || state < ScannerState.SCANNING } onClick={setNextCameraId}><MdFlipCameraAndroid /></Button> 
          {state === ScannerState.SCANNING ?
            <Button onClick={()=>setState((_)=>ScannerState.PAUSED)}><FaPause /></Button>:
            <Button onClick={()=>setState((_)=>ScannerState.SCANNING)}><FaPlay /></Button>
          }
          <Button disabled={!torch || !torch.isSupported} onClick={toggleTorch}>
            {!torch?.value?<MdFlashlightOn />:<MdFlashlightOff />}
          </Button>
        </div>
      }
    </div>
  )
}
