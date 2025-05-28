import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { DataProvider } from './context/DataContext'
import './styles/index.css'

// Ensure the root element exists
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>,
)
