import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx';
import ErrorPage from './pages/Error';
import Home from './pages/Home.js';
import LandingPage from './pages/LandingPage.js';
import Profile from './pages/Profile.js';
import UserHistory from './pages/History.js';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <LandingPage />
            },
            {
                path: '/profile',
                element: <Profile />
            },
            {
                path:'/me',
                element: <Home /> 
            },
            {
                path:'/history',
                element: <UserHistory />
            }
        ]
    }
])


const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
