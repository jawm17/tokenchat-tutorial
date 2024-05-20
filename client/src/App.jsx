import { Route, Routes, BrowserRouter } from "react-router-dom";
import PrivateRoutes from './utils/PrivateRoutes'
import axios from "axios";
import Portfolio from "./pages/portfolio/Portfolio";
import Home from "./pages/home/Home";
import Explore from "./pages/explore/Explore";
import Chat from "./pages/chat/Chat";
import Trade from "./pages/trade/Trade";
import Promo from "./pages/promo/Promo";

axios.defaults.baseURL = import.meta.env.VITE_API_URL_LIVE;
axios.defaults.withCredentials = true;


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Explore />} />
        <Route element={<Explore />} path="/explore" exact />
        <Route element={<Chat />} path="/chat/:contractAddress" />
        <Route element={<Trade />} path="/trade/:contractAddress" />
        <Route element={<Portfolio />} path="/portfolio" />
        <Route element={<Promo />} path="/promo" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
