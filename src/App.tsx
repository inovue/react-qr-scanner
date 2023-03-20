import README from '../README.mdx'
import { styles } from './App.css'

import { MdQrCodeScanner } from 'react-icons/md'
import {FaReact} from 'react-icons/fa'


function App() {
  const color = '#055671';
  return (  
    <div className='container'>
      <div className={styles.heroContainer}>
        <MdQrCodeScanner size={256} color={color}/>
        <div className={styles.scanBar} />
      </div>
      <div className="markdown-body">
        <README />
      </div>
    </div>
  )
}

export default App
