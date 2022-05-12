import DynamicTable from "./components/DynamicTable";
import Header from "./components/Header";
import { createTheme, ThemeProvider } from "@material-ui/core";
import "./styles.css";

const darkTheme = createTheme({
  palette: {
    type: "dark",
  },
});

export default function App() {
  return (
    // <ThemeProvider theme={darkTheme}>
    <div className="App">
      <Header />
      <DynamicTable />
    </div>
    // </ThemeProvider>
  );
}
