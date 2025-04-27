import { BrowserRouter, Routes, Route } from "react-router-dom"
import routers from "@routers/routers"
import './App.css'

function App() {
  return (
    <BrowserRouter>
        <Routes>
          {
            routers.map((item, index) => {
              return <Route
                path={item.path}
                element={<item.component />}
                key={index}
              />
            })
          }
        </Routes>
    </BrowserRouter>
  )
}

export default App
