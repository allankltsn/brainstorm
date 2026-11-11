import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Landing, Prototype } from './App.jsx'

const BASE = import.meta.env.BASE_URL

// Páginas do GitHub Pages não conhecem /login: o 404.html redireciona para cá com ?p=/login.
const redirected = new URLSearchParams(location.search).get('p')
if (redirected) history.replaceState(null, '', BASE.replace(/\/$/, '') + redirected)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={BASE}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Prototype />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
