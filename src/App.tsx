import { ModeToggle } from "./components/theme/mode-toggle"
import { ThemeProvider } from "./components/theme/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="text-red-500">
        Hello, World!
      </div>
      <ModeToggle />
    </ThemeProvider>
  )
}

export default App
