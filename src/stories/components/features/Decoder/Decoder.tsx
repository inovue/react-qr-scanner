import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { usePrevious } from "react-use";

import { CameraDevice } from 'html5-qrcode/esm/camera/core';


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
    console.log('torch', torch);
    if(!decoderRef.current) return;
    if(torch?.value === undefined) return;
    if(torch?.value === null) return;
    decoderRef.current.getRunningTrackCameraCapabilities().torchFeature().apply(torch.value).then(()=>{
      console.log('Torch applied');
    });
  }, [torch])

  useEffect(()=>{
    console.log('zoom', zoom);
    if(!decoderRef.current) return;
    if(!zoom?.value) return;
    if( zoom.value < zoom.min || zoom.max < zoom.value) return;
    decoderRef.current.getRunningTrackCameraCapabilities().zoomFeature().apply(zoom.value).then(()=>{
      console.log('Zoom applied');
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
    await decoderRef.current.stop();
    if(clear) decoderRef.current.clear();
    onChangeTorch && onChangeTorch(undefined);
    onChangeZoom && onChangeZoom(undefined);
  }
  

  const request = async (nextState:Html5QrcodeScannerState) => {
    if(!decoderRef.current) return;
    switch(nextState) {
      case Html5QrcodeScannerState.SCANNING:
        if( prevState === Html5QrcodeScannerState.PAUSED) {
          decoderRef.current.resume();
        } else if (prevState === Html5QrcodeScannerState.NOT_STARTED || prevState === Html5QrcodeScannerState.SCANNING || prevState === undefined) {
          if(prevState === Html5QrcodeScannerState.SCANNING) await stop();
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


export const Scanner:React.FC = () => {
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


export const useCameras = () => {
  const [cameras, setCameras] = useState<CameraDevice[]|undefined>();
  useEffect(() => {
    Html5Qrcode.getCameras().then(cameras => setCameras(cameras));
  }, []);
  return cameras;
}

