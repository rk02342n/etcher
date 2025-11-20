import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ErrorPage from './components/common/ErrorPage';
import Home from './components/Home';
import Login from './components/Login';
import ManageCatalogue from './components/ManageCatalogue';
import GraphQL from './GraphQL';
import Authors from './components/Authors';
import EditAuthor from './components/EditAuthor';
import Author from './components/Author';
import AllPosts from './components/AllPosts';
import EditPost from './components/EditPost';
import Pinata from './components/Pinata.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element:<App />,
    errorElement:<ErrorPage />,
    children: [
      {index: true, element: <Home />},
      {
        path:"/allposts", 
        element: <AllPosts />,
      },
      {
        path:"/authors", 
        element: <Authors />,
      },
      {
        path:"/authors/:id", 
        element: <Author />,
      },
      {
        path:"/post/0", 
        element: <EditPost />,
      },
      {
        path:"/admin/author/0", 
        element: <EditAuthor />,
      },
      {
        path:"/manage-catalogue", 
        element: <ManageCatalogue />,
      },
      {
        path:"/graphql", 
        element: <GraphQL />,
      },
      {
        path:"/login", 
        element: <Login />,
      },
      {
        path:"/pinata", 
        element: <Pinata />,
      },
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

