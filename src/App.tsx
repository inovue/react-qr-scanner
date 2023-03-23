import README from '../README.mdx'
import { styles } from './App.css'

import { MdQrCodeScanner } from 'react-icons/md'


function App() {
  const color = '#055671';
  return (  
    <div className='container markdown-body'>
      <div className={styles.heroContainer}>
        <MdQrCodeScanner size={256} color={color}/>
        <div className={styles.scanBar} />
      </div>
      <div className={styles.buttons}>
        <button onClick={()=>window.location.href='#installation'} className={styles.button({outlined:true})}>Documentation</button>
        <button onClick={()=>window.location.href='#'} className={styles.button()}>Try demo</button>
      </div>
      <README />
    </div>
  )
}

export default App
