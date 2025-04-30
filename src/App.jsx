import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import routers from "@routers/routers"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routers.map((item, index) => (
          <Route
            path={item.path}
            element={<item.component />}
            key={index}
          />
        ))}
      </Routes>
      <ToastContainer position="top-right" />
    </BrowserRouter>
  )
}

export default App
