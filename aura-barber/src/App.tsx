import { ThemeProvider } from '@/lib/theme'

/* Placeholder do scaffold (Task 1). As rotas reais entram na Task 8. */
export default function App() {
  return (
    <ThemeProvider>
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh', fontFamily: 'system-ui' }}>
        <h1>Aura Barber</h1>
      </div>
    </ThemeProvider>
  )
}
