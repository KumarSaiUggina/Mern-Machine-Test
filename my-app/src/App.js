import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import UpdateEmployeePage from "./pages/UpdateEmployeePage";
import CreateEmployeePage from "./pages/CreateEmployeePage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import EmployeeListPage from "./pages/EmployeeListPage";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
    index: true,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/createEmployee",
        element: <CreateEmployeePage />,
      },
      {
        path: "/employeeList",
        element: <EmployeeListPage />,
      },
      { path: "/updateEmployee/:id", element: <UpdateEmployeePage /> },
    ],
  },
  {
    path: "*",
    element: <p>404 Error - Nothing here...</p>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
