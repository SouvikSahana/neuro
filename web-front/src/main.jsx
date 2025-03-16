import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StateProvider } from './StateProvider.jsx'
import reducer,{initialState} from './reducer.js'
import {BrowserRouter as Router } from "react-router-dom"

createRoot(document.getElementById('root')).render(
  <StateProvider initialState={initialState} reducer={reducer}>
    <Router>
      <App />
     </Router>
  </StateProvider>
)
