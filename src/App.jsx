import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routers from './routers/routers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Preloader from '@components/Preloader/Preloader';
import AdminRoute from '@/contexts/AdminRoute';
import PrivateRoute from '@/contexts/PrivateRoute';
import OnlyAdmin from '@/contexts/OnlyAdmin';

import AdminLayout from '@/layouts/AdminLayout/AdminLayout';
import ClientLayout from '@/layouts/ClientLayout/ClientLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routers.map((item, index) => {
          const PageComponent = item.component;

          let element = (
            <Suspense fallback={<Preloader />}>
              <PageComponent />
            </Suspense>
          );

          // Layout wrapper
          if (item.isAdmin) {
            element = <AdminLayout>{element}</AdminLayout>;
          } else {
            element = <ClientLayout>{element}</ClientLayout>;
          }

          // Route guards
          if (item.isOnlyAdmin) {
            element = <OnlyAdmin>{element}</OnlyAdmin>;
          } else if (item.isAdmin) {
            element = <AdminRoute>{element}</AdminRoute>;
          } else if (item.isPrivate) {
            element = <PrivateRoute>{element}</PrivateRoute>;
          }

          return <Route key={index} path={item.path} element={element} />;
        })}
      </Routes>
      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}

export default App;
