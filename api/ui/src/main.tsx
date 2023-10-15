import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import './index.css'
import { API } from './api';
import Hello from './pages/Hello';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Hello/>,
    },
]);

const rootReducer = combineReducers({
    [API.reducerPath]: API.reducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(API.middleware),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ReduxProvider store={store}>
            <RouterProvider router={router} />
        </ReduxProvider>
    </React.StrictMode>,
)
