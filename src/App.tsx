import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme/theme-provider";
import { Toaster } from "./components/ui/sonner";
import AppRoutes from "./routes/app-routes";

function App() {
  return (
    <BrowserRouter basename="/">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AppRoutes />
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
