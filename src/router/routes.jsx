import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import Home from "../pages/Home.jsx";
import WeatherPage from "../pages/WeatherPage.jsx";
import WeatherOld from "../pages/WeatherOld.jsx";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<Home />} />
      <Route path="/weatherold" element={<WeatherOld />} />
      <Route path="/weatherpage" element={<WeatherPage />}>
        <Route path="/weatherpage/:city" element={<WeatherPage />} />
      </Route>
    </>
  )
);

export default routes;
