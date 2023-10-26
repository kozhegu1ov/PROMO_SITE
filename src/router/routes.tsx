import { createBrowserRouter } from "react-router-dom";
import Home from "../views/Home/Home";
import Promo from "../views/Promo/Promo";
import { PROMO_PATH } from "./paths";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: PROMO_PATH,
    element: <Promo />,
  }
]);

export default routes;
