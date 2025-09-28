import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { RouterProvider } from 'react-router-dom';
import routes from './router/routes.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
);
