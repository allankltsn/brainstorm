import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Brand, Landing, Prototype } from './App.jsx'

const BASE = import.meta.env.BASE_URL

// Páginas do GitHub Pages não conhecem /login: o 404.html redireciona para cá com ?p=/login.
// Só rotas conhecidas são aceitas; qualquer outro valor de ?p= é ignorado (SEC-BL-04 / REV-BL-04).
const KNOWN = new Set(['/', '/login', '/brand'])
const redirected = new URLSearchParams(location.search).get('p')
const target = redirected && redirected.length > 1 ? redirected.replace(/\/+$/, '') : redirected
if (target && KNOWN.has(target)) history.replaceState(null, '', BASE.replace(/\/$/, '') + target)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={BASE}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Prototype />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
