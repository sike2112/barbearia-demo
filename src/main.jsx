import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PortfolioPage from './portfolio/PortfolioPage.jsx'

// Roteamento mínimo: apenas duas rotas estáticas, sem biblioteca de rotas.
// O site principal (App) permanece intocado e é o padrão para qualquer
// caminho diferente de /portfolio.
const isPortfolio = window.location.pathname.replace(/\/$/, '') === '/portfolio'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPortfolio ? <PortfolioPage /> : <App />}
  </StrictMode>,
)
