import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { MdQrCodeScanner } from 'react-icons/md'
import {FaReact} from 'react-icons/fa'

function App() {
  const [count, setCount] = useState(0)
  var  color = '#000000' //'#087ea4'
  return (
    <div className="App">
      <div>
        <MdQrCodeScanner size={256} color={color}/>
        <FaReact size={64} color={color}/>
      </div>
      <h1>ReactCodeScanner</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
