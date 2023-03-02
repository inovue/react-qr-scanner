import React, { useEffect } from 'react'

import {Html5QrcodeSupportedFormats} from "html5-qrcode/esm/core";

import {ImQrcode} from "react-icons/im";
import {RiBarcodeFill} from "react-icons/ri";

import { styles } from "./BarcodeIcon.css";

export const Icon = {
  [Html5QrcodeSupportedFormats.QR_CODE]: ImQrcode,
  [Html5QrcodeSupportedFormats.AZTEC]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.CODABAR]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.CODE_39]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.CODE_93]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.CODE_128]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.DATA_MATRIX]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.MAXICODE]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.ITF]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.EAN_13]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.EAN_8]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.PDF_417]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.RSS_14]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.RSS_EXPANDED]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.UPC_A]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.UPC_E]: RiBarcodeFill,
  [Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION]: RiBarcodeFill
}

export type TickState = {
  state: BarcodeIconState;
} | undefined

export enum BarcodeIconState {
  DEFAULT = 0,
  SUCCESS = 1,
  ERROR = -1,
}

export type BarcodeIconProps = {
  tick?: TickState;
  format?: Html5QrcodeSupportedFormats;
  size?: number;
}

export const BarcodeIcon:React.FC<BarcodeIconProps> = ({
  tick,
  format=Html5QrcodeSupportedFormats.QR_CODE,
  size=120,
}) => {

  const [state, setState] = React.useState<BarcodeIconState>(BarcodeIconState.DEFAULT);
  const [tickTimeoutId, setTickTimeoutId] = React.useState<number|undefined>(undefined);

  useEffect(()=>{ 
    if(tick) setState(tick.state);
    if(tickTimeoutId) window.clearTimeout(tickTimeoutId);
    setTickTimeoutId(window.setTimeout(()=>{ setState(BarcodeIconState.DEFAULT); }, 300));
  }, [tick]);
  
  return (
    <>
      { React.createElement(Icon[format], {size,  className: `${styles.icon} ${styles.stateColor[state]}`}) }
    </>
  )
}
