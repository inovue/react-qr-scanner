import README from '../README.mdx'
import { styles } from './App.css'

import { MdQrCodeScanner } from 'react-icons/md'
import { Scanner, ScannerState, ScannerStateType } from './stories/components/features/Scanner';
import { useState } from 'react';


function App() {
  const color = '#055671';
  const [state, setState] = useState<ScannerStateType>(ScannerState.NOT_STARTED);

  return (  
    <div className='container markdown-body'>
      <div className={styles.heroContainer}>
        <MdQrCodeScanner size={256} color={color}/>
        <div className={styles.scanBar} />
      </div>
      <div className={styles.buttons}>
        <button onClick={()=>window.location.href='#installation'} className={styles.button({outlined:true})}>Documentation</button>
        <button onClick={()=>setState(ScannerState.SCANNING)} className={styles.button()}>Try demo</button>
      </div>
      <README />
      { ScannerState.NOT_STARTED < state && 
        <div style={{position:'fixed', width:'100dvw', height:'100dvh', top:'0', left:'0'}}>
          <Scanner state={state} onScanSuccess={(result)=>console.log("result", result)}/>
        </div>
      }
      
    </div>
  )
}

export default App
