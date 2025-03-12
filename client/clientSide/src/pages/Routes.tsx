import { Routes, Route } from "react-router-dom";
import App from "./../App";
import Layout from "../layout/Layout";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<App />} />
        <Route path="login" element={<LoginPage/>}></Route>
        <Route path="dashboard" element={<Dashboard/>}></Route>

      </Route>
    </Routes>
  );
};

export default AppRoutes;