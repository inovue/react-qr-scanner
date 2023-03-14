import React from 'react'
import {Html5QrcodeSupportedFormats} from "html5-qrcode/esm/core";
import {QR, EAN8, EAN13} from "./svg";
import { icon } from "./style.css";

export const Icon = {
  [Html5QrcodeSupportedFormats.QR_CODE]: QR,
  [Html5QrcodeSupportedFormats.AZTEC]: EAN13,
  [Html5QrcodeSupportedFormats.CODABAR]: EAN13,
  [Html5QrcodeSupportedFormats.CODE_39]: EAN13,
  [Html5QrcodeSupportedFormats.CODE_93]: EAN13,
  [Html5QrcodeSupportedFormats.CODE_128]: EAN13,
  [Html5QrcodeSupportedFormats.DATA_MATRIX]: EAN13,
  [Html5QrcodeSupportedFormats.MAXICODE]: EAN13,
  [Html5QrcodeSupportedFormats.ITF]: EAN13,
  [Html5QrcodeSupportedFormats.EAN_13]: EAN13,
  [Html5QrcodeSupportedFormats.EAN_8]: EAN8,
  [Html5QrcodeSupportedFormats.PDF_417]: EAN13,
  [Html5QrcodeSupportedFormats.RSS_14]: EAN13,
  [Html5QrcodeSupportedFormats.RSS_EXPANDED]: EAN13,
  [Html5QrcodeSupportedFormats.UPC_A]: EAN13,
  [Html5QrcodeSupportedFormats.UPC_E]: EAN13,
  [Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION]: EAN13
}

export type BarcodeIconProps = {
  format: Html5QrcodeSupportedFormats;
  rumble?: boolean;
  color?: 'success'|'error'|'base';
}

export const BarcodeIcon:React.FC<BarcodeIconProps> = ({
  format=Html5QrcodeSupportedFormats.QR_CODE,
  rumble=false,
  color='base',
}) => {
  
  return (
    <>
      { React.createElement(Icon[format], {className:icon({color:color, rumble:rumble})}) }
    </>
  )
}
