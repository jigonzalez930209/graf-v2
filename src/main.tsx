import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import { GraftProvider, INITIAL_STATE } from './graf/context/GraftProvider'

import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GraftProvider initialState={INITIAL_STATE}>
      <App />
    </GraftProvider>
  </React.StrictMode>
)
