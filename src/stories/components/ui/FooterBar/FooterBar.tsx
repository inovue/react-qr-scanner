import React from 'react'
import { styles } from './FooterBar.css'
import { Html5QrcodeScannerState } from 'html5-qrcode'

import {FaPause, FaPlay, FaExchangeAlt} from 'react-icons/fa'
import {MdClose} from 'react-icons/md'
import {IoMdFlashlight} from 'react-icons/io'

export type FooterBarProps = {
  state?: Html5QrcodeScannerState
  onStart?: () => void
  onPause?: () => void
  onStop?: () => void
  onDeviceChange?: () => void
}

export const FooterBar:React.FC<FooterBarProps> = ({
  state,
  onStart,
  onPause,
  onStop,
  onDeviceChange
}) => {
  const onStartHandler = () => { onStart && onStart(); }
  const onPauseHandler = () => { onPause && onPause(); }
  const onStopHandler = () => { onStop && onStop(); }
  const onDeviceChangeHandler = () => { onDeviceChange && onDeviceChange(); }

  return (
    <div className={styles.wrapper}>
      <div className={styles.buttons}>
        <button className={styles.buttonWrapper} onClick={onDeviceChangeHandler} ><FaExchangeAlt color='white' size={16} /></button>
        {state === Html5QrcodeScannerState.SCANNING && 
          <button className={styles.buttonWrapper} onClick={onPauseHandler}><FaPause color='white' size={16} /></button>
        }
        {(state === Html5QrcodeScannerState.PAUSED || state === Html5QrcodeScannerState.NOT_STARTED) && 
          <button className={styles.buttonWrapper} onClick={onStartHandler}><FaPlay color='white' size={16} /></button>
        }
        <button className={styles.buttonWrapper} onClick={onStopHandler}><MdClose color='white' size={16}/></button>
        <button className={styles.buttonWrapper} onClick={onStopHandler}><IoMdFlashlight color='white' size={16}/></button>
      </div>
    </div>
  )
}
