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
      <README />
    </div>
  )
}

export default App
