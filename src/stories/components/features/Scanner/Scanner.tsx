import React, { useState } from "react";
import { Html5QrcodeScannerState } from "html5-qrcode";
import { CameraDevice } from 'html5-qrcode/esm/camera/core';

import {Button} from '../../ui/Button/Button';
import { FaPlay, FaPause } from 'react-icons/fa';
import { MdFlipCameraAndroid, MdFlashlightOn, MdFlashlightOff } from 'react-icons/md';
import { SlClose } from 'react-icons/sl'

import {styles} from './style.css';
import {Decoder, Torch, Zoom} from '../Decoder/Decoder';
import {Card} from '../../ui/Card/Card';

export type ScannerProps = {
  state: Html5QrcodeScannerState;
  facingMode?: 'user' | 'environment';
  delay?: number;
  timeout?: number;
  format?: string;
  onScanned: (result: string) => void;
  onScanError?: (error: string) => void;
}

export const Scanner:React.FC = () => {
  const [state, setState] = useState<Html5QrcodeScannerState>(Html5QrcodeScannerState.SCANNING);
  const [torch, setTorch] = useState<Torch>();
  const [zoom, setZoom] = useState<Zoom>();

  const [cameras, setCameras] = useState<CameraDevice[]>();
  const [error, setError] = useState<Error>();

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Button onClick={()=>setState((_)=>Html5QrcodeScannerState.NOT_STARTED)}><SlClose /></Button>
        </div>
        <div className={styles.main}>
          {error && <Card type='error' title="ERROR" message={error.message}></Card>}
          <Decoder state={state} torch={torch} zoom={zoom} onChangeState={(v)=>setState(v)} onChangeTorch={(v)=>setTorch(v)} onChangeZoom={(v)=>setZoom(v)} onChangeCameras={(v)=>setCameras(v)} onError={(v)=>setError(v)} />
          
          { zoom && zoom.isSupported &&
            <div className={styles.zoom}>
              <Button onClick={(_)=>{setZoom(()=>({...zoom, value:zoom.value ? zoom.value-(zoom.step*5) : zoom.min}))}}>-</Button>
                <input type="range" min={zoom.min} max={zoom.max} step={zoom.step} value={zoom.value??zoom.min} onChange={(e)=>{setZoom(()=>({...zoom, value:Number(e.target.value)??zoom.min}))}}/> 
              <Button onClick={(_)=>{setZoom(()=>({...zoom, value:zoom.value ? zoom.value+(zoom.step*5) : zoom.max}))}}>+</Button>
            </div>
          }
        </div>
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
      </div>
    </div>
  )
}
