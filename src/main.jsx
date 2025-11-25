import { installErrorReporter } from './clientreporter.js'
installErrorReporter();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from '@vercel/analytics/react'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
      <SpeedInsights />
      <Analytics />
   
      
     
    </>
  </StrictMode>,
)

