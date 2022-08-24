import { Layout, Menu } from "antd";
import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

const Counter = lazy(() => import("./Counter"));

function AppMenu() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultOpenKeys={pathname.split("/")}
      selectedKeys={[pathname]}
      items={[
        {
          key: "counter",
          label: <Link to="/counter">Counter</Link>,
        },
      ]}
    />
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Layout.Sider>
          <AppMenu />
        </Layout.Sider>
        <Layout.Content>
          <Routes>
            <Route
              path="counter"
              element={
                <Suspense>
                  <Counter />
                </Suspense>
              }
            />
          </Routes>
        </Layout.Content>
      </Layout>
    </BrowserRouter>
  );
}
