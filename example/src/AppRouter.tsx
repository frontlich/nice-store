import { Layout, Menu } from 'antd';
import { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

const Connect = lazy(() => import('./enhancers/connect'));
const Reducer = lazy(() => import('./enhancers/reducer'));

function AppMenu() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultOpenKeys={pathname.split('/')}
      selectedKeys={[pathname]}
      items={[
        {
          key: 'enhancers',
          label: 'enhancers',
          children: [
            {
              key: '/enhancers/connect',
              label: <Link to="/enhancers/connect">connect</Link>,
            },
            {
              key: '/enhancers/reducer',
              label: <Link to="/enhancers/reducer">reducer</Link>,
            },
          ],
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
              path="/enhancers/connect"
              element={
                <Suspense>
                  <Connect />
                </Suspense>
              }
            />
            <Route
              path="/enhancers/reducer"
              element={
                <Suspense>
                  <Reducer />
                </Suspense>
              }
            />
          </Routes>
        </Layout.Content>
      </Layout>
    </BrowserRouter>
  );
}
