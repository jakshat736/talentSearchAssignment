import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Home from "./Components/Home";
import { useState } from "react";
import { SessionContext } from "./Components/SessionContext";


function App() {
  const [products, setProducts] = useState()
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
