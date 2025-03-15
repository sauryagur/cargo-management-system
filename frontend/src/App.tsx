import CargoManagementSystem from "./components/cargo-management-system"
import { ThemeProvider } from "./components/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <CargoManagementSystem />
    </ThemeProvider>
  )
}

export default App

