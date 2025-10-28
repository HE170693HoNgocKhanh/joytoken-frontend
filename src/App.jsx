import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import { Fragment } from "react";

export function App() {
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            let Layout = Fragment;

            if (route.isAdminRoute) {
              Layout = AdminLayout;
            } else if (route.isShowHeader) {
              Layout = DefaultComponent;
            }

            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}
export default App;
