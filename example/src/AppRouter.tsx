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
const Reset = lazy(() => import('./enhancers/reset'));
const Counter = lazy(() => import('./examples/Counter'));

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
            {
              key: '/enhancers/reset',
              label: <Link to="/enhancers/reset">reset</Link>,
            },
          ],
        },
        {
          key: 'examples',
          label: 'examples',
          children: [
            {
              key: '/examples/counter',
              label: <Link to="/examples/counter">Counter</Link>,
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
            <Route path="enhancers">
              <Route
                path="connect"
                element={
                  <Suspense>
                    <Connect />
                  </Suspense>
                }
              />
              <Route
                path="reducer"
                element={
                  <Suspense>
                    <Reducer />
                  </Suspense>
                }
              />
              <Route
                path="reset"
                element={
                  <Suspense>
                    <Reset />
                  </Suspense>
                }
              />
            </Route>
            <Route path="examples">
              <Route
                path="counter"
                element={
                  <Suspense>
                    <Counter />
                  </Suspense>
                }
              ></Route>
            </Route>
          </Routes>
        </Layout.Content>
      </Layout>
    </BrowserRouter>
  );
}
