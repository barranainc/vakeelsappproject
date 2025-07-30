import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import paralegal from "./app/routes/paralegal";
import adminRoutes from "./app/routes/admin";
import Layout from "./app/layout";
import useAuth from "./app/hooks/useAuth";
import "./App.css";
import ToasterContainer from "./app/components/toaster";
import Login from "./app/views/auth/Login";

function App() {
  const { user, role } = useAuth();

  return (
    <BrowserRouter>
      <ToasterContainer />
      <Routes>
        <Route path={"/login"} element={<Login />} />
        <Route path={"/"} element={<Login />} />

        {role === "admin" ? (
          <Route
            path="/"
            element={user ? <Layout /> : <Navigate to="/login" />}
          >
            {adminRoutes.map((item) => (
              <Route
                key={item.path}
                path={item.path}
                element={item.component}
              />
            ))}
            <Route path="*" element={<Navigate to="/admin-dashboard" />} />
          </Route>
        ) : (
          <Route
            path="/"
            element={user ? <Layout /> : <Navigate to="/login" />}
          >
            {paralegal.map((item) => (
              <Route
                key={item.path}
                path={item.path}
                element={item.component}
              />
            ))}

            <Route path="*" element={<Navigate to="/paralegal-dashboard" />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
