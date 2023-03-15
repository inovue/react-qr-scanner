import React, { useEffect, useState } from "react";
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
import { useTimeout } from "react-use";
import { BarcodeIcon, IconColor } from "../../ui/BarcodeIcon/BarcodeIcon";
import { Html5QrcodeError, Html5QrcodeResult } from "html5-qrcode/esm/core";

export type ScannerProps = {
  state: Html5QrcodeScannerState;
  facingMode?: 'user' | 'environment';
  delay?: number;
  timeout?: number;
  format?: Html5QrcodeSupportedFormats;
  onScanSuccess: (result: Html5QrcodeResult) => void;
  onScanError?: (error: Html5QrcodeError) => void;
}

export const Scanner:React.FC<ScannerProps> = ({delay=1000, timeout=30000, format=Html5QrcodeSupportedFormats.QR_CODE, onScanSuccess, onScanError}) => {
  const [state, setState] = useState<Html5QrcodeScannerState>(Html5QrcodeScannerState.SCANNING);
  const [torch, setTorch] = useState<Torch>();
  const [zoom, setZoom] = useState<Zoom>();

  const [cameras, setCameras] = useState<CameraDevice[]>();
  const [error, setError] = useState<Error>();

  const [scannerResult, setScannerResult] = useState<Html5QrcodeResult>();
  const [scannerError, setScannerError] = useState<Html5QrcodeError>();
  const [iconColor, setIconColor] = useState<IconColor>();
  const [isUnrumble, clearRumble, resetRumble] = useTimeout(300);

  const [isTimeout, clearTimeout, resetTimeout] = useTimeout(timeout);
  const [isUnbusy, clearBusy, resetBusy] = useTimeout(delay);

  useEffect(()=>{
    if(Html5QrcodeScannerState.NOT_STARTED<state){
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
  
  useEffect(()=>{ !!isTimeout() && setState(Html5QrcodeScannerState.NOT_STARTED) }, [isTimeout()]);
  useEffect(()=>{ !!isUnrumble() && setIconColor('base'); }, [isUnrumble()]);

  const addZoom = (zoom:Zoom, value:number) => {
    const appliedValue = zoom.value ? zoom.value + value : zoom.min + value;
    return appliedValue < zoom.min ? zoom.min : zoom.max < appliedValue ? zoom.max : appliedValue;
  }

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        {cameras !== undefined && 
          <div className={styles.header}>
            { Html5QrcodeScannerState.NOT_STARTED < state && 
              <Button onClick={()=>setState((_)=>Html5QrcodeScannerState.NOT_STARTED)}>
                <SlClose />
              </Button>
            }
          </div>
        }
        <div className={styles.main}>
          {cameras === undefined && !error && <Card type='loading'></Card>}
          {error && <Card type='error' title="ERROR" message={error.message}></Card>}
          
          <Decoder state={state} torch={torch} zoom={zoom} 
            onChangeState={(v)=>setState(v)} 
            onChangeTorch={(v)=>setTorch(v)} 
            onChangeZoom={(v)=>setZoom(v)} 
            onChangeCameras={(v)=>setCameras(v)} 
            onError={(v)=>setError(v)} 
            onScanSuccess={ (_, result)=>{console.log(result); setScannerResult(result);}}
            onScanError={(_, error)=>{console.log(error); /* setScannerError(error); */}}
          />
          {cameras !== undefined &&  Html5QrcodeScannerState.NOT_STARTED < state && 
            <div className={styles.barcodeIcon}>
              <BarcodeIcon format={format} rumble={!isUnrumble()} color={iconColor}/>
            </div>
          }

          { zoom && zoom.isSupported && Html5QrcodeScannerState.NOT_STARTED < state &&
            <div className={styles.zoom}>
              <Button size="sm" onClick={(_)=>{setZoom(()=>({...zoom, value:addZoom(zoom, zoom.step*-5)}))}}><AiOutlineZoomOut /></Button>
                <input type="range" min={zoom.min} max={zoom.max} step={zoom.step} value={zoom.value??zoom.min} onChange={(e)=>{setZoom(()=>({...zoom, value:Number(e.target.value)??zoom.min}))}}/> 
              <Button size="sm" onClick={(_)=>{setZoom(()=>({...zoom, value:addZoom(zoom, zoom.step*5)}))}}><AiOutlineZoomIn /></Button>
            </div>
          }
        </div>
        {cameras !== undefined && !error && 
          <div className={styles.footer}>
            <div className={styles.buttonGroup}>
              <Button disabled={!cameras || cameras.length <= 0}><MdFlipCameraAndroid /></Button> 
              {state === Html5QrcodeScannerState.SCANNING ?
                <Button onClick={()=>setState((_)=>Html5QrcodeScannerState.PAUSED)}><FaPause /></Button>:
                <Button onClick={()=>setState((_)=>Html5QrcodeScannerState.SCANNING)}><FaPlay /></Button>
              }
              <Button disabled={!torch || !torch.isSupported} onClick={()=>setTorch(()=>(torch ? {...torch, value:!torch.value} : undefined))}>
                {!torch?.value?<MdFlashlightOn />:<MdFlashlightOff />}
              </Button>
            </div>
          </div>
        }
      </div>
    </div>
  )
}
