import { createBrowserRouter } from 'react-router';
import Home from '../pages/Home';
import BookMeeting from '../pages/BookMeeting';
import RootLayout from '../components/RootLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/book-meeting',
        element: <BookMeeting />,
      },
      {
        path: '*',
        element: <div>Page not found</div>,
      },
    ],
  },
]);

export default router;
