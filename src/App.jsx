// src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routers from './routers/routers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Preloader from "@components/Preloader/Preloader";
import AdminRoute from '@/contexts/AdminRoute';
import PrivateRoute from '@/contexts/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routers.map((item, index) => {
          const Component = item.component;

          let element = (
            <Suspense fallback={<Preloader />}>
              <Component />
            </Suspense>
          );

          // Nếu là trang admin => bọc AdminRoute
          if (item.isAdmin) {
            element = (
              <AdminRoute>
                {element}
              </AdminRoute>
            );
          }
          // Nếu là trang cần đăng nhập => bọc PrivateRoute
          else if (item.isPrivate) {
            element = (
              <PrivateRoute>
                {element}
              </PrivateRoute>
            );
          }

          return <Route key={index} path={item.path} element={element} />;
        })}
      </Routes>
      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}

export default App;
