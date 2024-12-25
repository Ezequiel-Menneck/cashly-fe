import { createBrowserRouter, RouterProvider } from 'react-router';
import ErrorPage from './layout/error-page';
import Layout from './layout/layout';
import { Crypto } from './pages/crypto/crypto';
import Financial from './pages/financial/financial';
import Home from './pages/home/home';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: '/financial',
                element: <Financial />
            },
            {
                path: '/crypto',
                element: <Crypto />
            }
        ]
    }
]);

function AppRoutes() {
    return <RouterProvider router={router} />;
}

export default AppRoutes;
