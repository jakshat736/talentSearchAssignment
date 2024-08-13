import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Home from "./Components/Home";
import { useState } from "react";
import { SessionContext } from "./Components/SessionContext";
import { productsData } from "./Components/Data";


function App() {
  const [products, setProducts] = useState(productsData)
  return (
    <div >
      <SessionContext.Provider value={{ products, setProducts }}>
      <Router>
        <Routes>
          <Route element={<Home />} path="/" />
        </Routes>
      </Router>
      </SessionContext.Provider>
    </div>
  );
}

export default App;
