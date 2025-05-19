import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/User/Home/Home";
import PublicMap from "./pages/User/PublicMap/PublicMap";
import MapManagement from "./pages/User/MapManagement/MapManagement";
import MyLibrary from "./pages/User/MyHistory/MyHistory";
import Profile from "./pages/User/Profile/Profile";
import {
  PageEnum,
  AdminPageEnum,
  TechnicianPageEnum,
} from "./defination/enums/page.enum";
import PrivateRoute from "./components/Common/PrivateRoute";
import AuthLogin from "./pages/User/Auth/AuthLogin";
import AuthSignUp from "./pages/User/Auth/AuthSignUp";
import AuthForgotPass from "./pages/User/Auth/AuthForgotPass";
import AuthVerifyEmail from "./pages/User/Auth/AuthVerifyEmail";
import NotFound from "./pages/NotFound/NotFound";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import UsersManagement from "./pages/Admin/Users/UsersManagement";
import TechniciansManagement from "./pages/Admin/Technicians/TechniciansManagement";
import TaskManagement from "./pages/Technician/TaskManagement/TaskManagement";
import { getDefaultHomePage } from "./utils/auth.util";
import MapTechnician from "./pages/Technician/MapTechnician/MapTechnician";
const App: React.FC = () => {
  const [defaultPage, setDefaultPage] = useState<string | null>(null);

  useEffect(() => {
    const initializeDefaultPage = () => {
      const page = getDefaultHomePage();
      setDefaultPage(page);
    };
    initializeDefaultPage();
  }, []);

  if (defaultPage === null) {
    return <div>Loading...</div>; // Hiển thị trạng thái tải trong khi xác định trang mặc định
  }
  return (
    <Router>
      <Routes>
        {/* DEFAULT ROUTE */}
        <Route
          path="/"
          element={<Navigate to={getDefaultHomePage()} replace />}
        />
        {/* AUTH ROUTES */}
        <Route path={PageEnum.LOGIN} element={<AuthLogin />} />
        <Route path={PageEnum.SIGN_UP} element={<AuthSignUp />} />
        <Route path={PageEnum.VERIFY} element={<AuthVerifyEmail />} />
        <Route path={PageEnum.FORGOT_PASSWORD} element={<AuthForgotPass />} />

        {/* PUBLIC ROUTES */}
        <Route
          path={PageEnum.INDEX}
          element={<Navigate to={PageEnum.HOME} replace />}
        />
        <Route path={PageEnum.HOME} element={<Home />} />
        <Route path={PageEnum.PUBLIC_MAP} element={<PublicMap />} />
        <Route path={PageEnum.NOT_FOUND} element={<NotFound />} />

        {/* USER ROUTES */}
        <Route
          path={PageEnum.PROFILE}
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path={PageEnum.MAPMANAGEMENT}
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <MapManagement />
            </PrivateRoute>
          }
        />
        <Route
          path={PageEnum.HISTORY}
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <MyLibrary />
            </PrivateRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path={AdminPageEnum.DASHBOARD}
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path={AdminPageEnum.USER_MANAGEMENT}
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <UsersManagement />
            </PrivateRoute>
          }
        />
        <Route
          path={AdminPageEnum.TECHNICIAN_MANAGEMENT}
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <TechniciansManagement />
            </PrivateRoute>
          }
        />

        {/* TECHNICIAN ROUTE */}
        <Route
          path={TechnicianPageEnum.TASK_MANAGEMENT}
          element={
            <PrivateRoute allowedRoles={["technical"]}>
              <TaskManagement />
            </PrivateRoute>
          }
        />
         <Route
          path={TechnicianPageEnum.MAP}
          element={
            <PrivateRoute allowedRoles={["technical"]}>
              <MapTechnician />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
