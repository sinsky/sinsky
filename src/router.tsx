import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Experience from "./pages/Experience";
import Introduction from "./pages/Introduction";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <>Sorry error...</>,
    children: [
      {
        index: true,
        element: <Introduction />,
      },
      {
        path: "/work",
        element: <Experience />,
      },
    ],
  },
]);

export { router };
