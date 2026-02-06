import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import routes from './Routes';
import React from 'react';

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <RouterProvider router={routes}/>
    </React.StrictMode>
)