import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import HomePage from './pages/HomePage';
import ProductCategory from './pages/ProductCategory';
import NewProduct from './pages/NewProduct';
import ViewProducts from './pages/ViewProducts';
import DeliveryRegion from './pages/DeliveryRegion';
import Orders from './pages/Orders';
import Reports from './pages/Reports';

function App() {
  
  return (
    <>
      <Router basename='CeyBazaar-Admin'>
        <Routes>
          <Route path='/' element={<LoginPage/>}/>
          <Route path='/Home' element={<DashboardLayout><HomePage/></DashboardLayout>}/>
          <Route path='/Product-Category' element={<DashboardLayout><ProductCategory/></DashboardLayout>}/>
          <Route path='/New-Product' element={<DashboardLayout><NewProduct/></DashboardLayout>}/>
          <Route path='/View-Products' element={<DashboardLayout><ViewProducts/></DashboardLayout>}/>
          <Route path='/Delivery-Region' element={<DashboardLayout><DeliveryRegion/></DashboardLayout>}/>
          <Route path='/Orders' element={<DashboardLayout><Orders/></DashboardLayout>}/>
          <Route path='/Reports' element={<DashboardLayout><Reports/></DashboardLayout>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
