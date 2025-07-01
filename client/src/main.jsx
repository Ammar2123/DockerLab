import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const root = document.getElementById('root')
console.log('Mounting to', root) // Should log in browser + Electron console

ReactDOM.createRoot(root).render(
    <App />

)
