import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme/theme-provider";
import AppRoutes from "./routes/app-routes";

function App() {
  return (
    <BrowserRouter
      basename="/"
    >
      <ThemeProvider
        defaultTheme="light"
        storageKey="vite-ui-theme"
      >
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;