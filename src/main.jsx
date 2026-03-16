import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@styles/global.css'
import App from './App.jsx'
import { AuthProvider } from '@/context/AuthContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import { UIProvider } from '@/context/UIContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <UIProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </UIProvider>
    </ErrorBoundary>
  </StrictMode>,
)

