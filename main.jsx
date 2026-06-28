import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// On s'assure que React est disponible globalement si un composant le cherche
window.React = React;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
