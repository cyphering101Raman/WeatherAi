import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import Home from "../pages/Home.jsx";
import WeatherPage from "../pages/WeatherPage.jsx";
import WeatherOld from "../pages/WeatherOld.jsx";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<Home />} />
      <Route path="/classic-ui" element={<WeatherOld />} />
      <Route path="/weather" element={<WeatherPage />}>
        <Route path="/weather/:city" element={<WeatherPage />} />
      </Route>
    </>
  )
);

export default routes;
