import React from 'react';
import { Routes, Route } from "react-router-dom";
import Header from './components/commons/Header';
import Home from './pages/Home';
import Login from './components/users/Login';
import Register from './components/users/Register';
import Categories from './pages/Categories';
import Users from './pages/Users';
import NotFound from './pages/NotFound';
import DatesAndOperationsForm from './pages/DatesAndOperationsForm';

const App = () => {
  return (
    <main className='main'>
      <Header />
      <Routes basename={process.env.PUBLIC_URL} >
        <Route path="/" element={<Home />} />
        <Route path="/previsions" element={<DatesAndOperationsForm page='previsions' />} />
        <Route path="/depenses" element={<DatesAndOperationsForm page='depenses' />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/users" element={<Users />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
};

export default App;