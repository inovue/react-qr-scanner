import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { usePrevious } from "react-use";

import { CameraDevice } from 'html5-qrcode/esm/camera/core';

import { SlInfo, SlExclamation, SlClose } from 'react-icons/sl'
import { IconBaseProps } from "react-icons";

export type DecoderProps = {
  state: Html5QrcodeScannerState;
  torch?: Torch;
  zoom?: Zoom;
  onChangeState: (state:Html5QrcodeScannerState) => void;
  onChangeTorch?: (torch:Torch|undefined) => void;
  onChangeZoom?: (zoom:Zoom|undefined) => void;
  id?: string;
}
export const Decoder:React.FC<DecoderProps> = ({state, torch, zoom, onChangeState, onChangeTorch, onChangeZoom, id='qr-code-reader'}) => {
  const decoderRef = useRef<Html5Qrcode>();
  const prevState = usePrevious(state);
  
  useEffect(()=>{
    if(!decoderRef.current) decoderRef.current = new Html5Qrcode(id);
    return ()=>{ stop(true); }
  }, [])

  useEffect(()=>{
    console.log('prevState, state', prevState, state );
    request(state);
  }, [state])

  useEffect(()=>{
    if(!decoderRef.current) return;
    if(torch?.value === undefined) return;
    if(torch?.value === null) return;
    decoderRef.current.getRunningTrackCameraCapabilities().torchFeature().apply(torch.value).then(()=>{
      console.log('Torch applied', torch);
    });
  }, [torch])

  useEffect(()=>{
    if(!decoderRef.current) return;
    if(!zoom?.value) return;
    if( zoom.value < zoom.min || zoom.max < zoom.value) return;
    decoderRef.current.getRunningTrackCameraCapabilities().zoomFeature().apply(zoom.value).then(()=>{
      console.log('Zoom applied', zoom);
    });
  }, [zoom])

  const start = async () => {
    if(!decoderRef.current) return;
    await decoderRef.current.start({facingMode:'environment'},{fps: 10, qrbox: 250},(_,r)=>{console.log(r)},(_,r)=>{});
    onChangeTorch && onChangeTorch(getTorch(decoderRef.current));
    onChangeZoom && onChangeZoom(getZoom(decoderRef.current));
  }
  const stop = async (clear:boolean=false) => {
    if(!decoderRef.current) return;
    if(Html5QrcodeScannerState.SCANNING <= state) await decoderRef.current.stop();
    if(clear) decoderRef.current.clear();
    onChangeTorch && onChangeTorch(undefined);
    onChangeZoom && onChangeZoom(undefined);
  }
  

  const request = async (nextState:Html5QrcodeScannerState) => {
    if(!decoderRef.current) return;
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
        if(prevState !== Html5QrcodeScannerState.SCANNING) await start();
        decoderRef.current.pause(true);
        break;
      case Html5QrcodeScannerState.NOT_STARTED:
        await stop();
        break;
    }
    onChangeState && onChangeState(nextState);
  }
  return <div id={id} />
}

export type Torch = {
  isSupported: boolean;
  value: boolean | null;
}
export type Zoom = {
  isSupported: boolean;
  min: number;
  max: number;
  step: number;
  value: number | null;
}

export const getTorch = (decoder:Html5Qrcode):Torch => {
  const capabilities = decoder.getRunningTrackCameraCapabilities();
  const torchFeature = capabilities.torchFeature();
  return {
    isSupported: torchFeature.isSupported(),
    value: torchFeature.value(),
  }
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
  const [cameras, environmentError] = useCameras();
  const Screen = useMemo(()=>{
    console.log('cameras', cameras,'environmentError', environmentError)
    if(cameras === undefined && environmentError === undefined){
      return <InfoScreen type='info' message='Loading...' />
    }else{
      if(environmentError){
        return <InfoScreen type='error' message={environmentError.message} />
      } else if(!cameras || cameras.length === 0){
        return <InfoScreen type='warn' message='Camera not found' />
      }else{
        return <ScannerScreen />
      }
    }
  }, [cameras, environmentError])
  return Screen
}




export type InfoScreenType = 'info'|'warn'|'error';
export type InfoScreenProps = {
  type?: InfoScreenType;
  title?: string;
  message?:string;
  children?:React.ReactNode;
}
const InfoScreenIcon:React.FC<{type:InfoScreenType} & IconBaseProps> = (props) => {
  switch(props.type){
    case 'info': return <SlInfo {...props} />;
    case 'warn': return <SlExclamation {...props} />;
    case 'error': return <SlClose {...props} />;
  }
}
export const InfoScreen:React.FC<InfoScreenProps> = ({type, title,  message, children}) => {
  return (
    <div className="card">
      {type && <InfoScreenIcon type={type}/>}
      {title && <div className="card-title">{title}</div>}
      {message && <div className="card-message">{message}</div>}
      {children && <div className="card-contents">{children}</div>}
    </div>
  )
}

export const ScannerScreen:React.FC = () => {
  const [state, setState] = useState<Html5QrcodeScannerState>(Html5QrcodeScannerState.SCANNING);
  const [torch, setTorch] = useState<Torch>();
  const [zoom, setZoom] = useState<Zoom>();

  return (
    <div>
      <Decoder state={state} torch={torch} zoom={zoom} onChangeState={(v)=>setState(v)} onChangeTorch={(v)=>setTorch(v)} onChangeZoom={(v)=>setZoom(v)} />
      <section>
        <p>Decoder</p>
        <button onClick={()=>setState((_)=>Html5QrcodeScannerState.SCANNING)}>Play</button>
        <button onClick={()=>setState((_)=>Html5QrcodeScannerState.PAUSED)}>Pause</button>
        <button onClick={()=>setState((_)=>Html5QrcodeScannerState.SCANNING)}>Resume</button>
        <button onClick={()=>setState((_)=>Html5QrcodeScannerState.NOT_STARTED)}>Stop</button>
      </section>
      <section>
        <p>Torch</p>
        {torch && torch.isSupported ? 
          <button onClick={()=>setTorch(()=>({...torch, value:!torch.value}))}>{!torch.value?'ON':'OFF'}</button> :
          <p>not spported.</p>
        }
      </section>
      <section>
        <p>Zoom</p>
        { zoom && zoom.isSupported ?
          <div>
            <p>{`min:${zoom.min} max:${zoom.max} step:${zoom.step} value:${zoom.value}`}</p>
            <input type="range" min={zoom.min} max={zoom.max} step={zoom.step} value={zoom.value??zoom.min} onChange={(e)=>{setZoom(()=>({...zoom, value:Number(e.target.value)??zoom.min}))}}/> 
          </div>:
          <p>not spported.</p>
        }
      </section>
    </div>
  )
}


export const useCameras = ():[CameraDevice[] | undefined, Error | undefined] => {
  const [cameras, setCameras] = useState<CameraDevice[]>();
  const [error, setError] = useState<Error>();
  useEffect(() => {
    Html5Qrcode.getCameras().then(v => {
      console.log('Cameras', v)
      setCameras(v);
    }).catch((e:Error) => {
      console.error('Environment Error', e);
      setError(e);
    });
  }, []);
  return [cameras, error];
}

