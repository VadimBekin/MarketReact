import {createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from './App';
import Catalog from './Catalog/Catalog';
import Cart from './Cart/Cart';


const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App/>}>
            <Route index element={<Catalog/>} />
            <Route path='catalog' index element={<Catalog/>} />
            <Route path='cart' element={<Cart/>} />
        </Route>
    ),
    {
        basename: '/MarketReact',
    }
)
export default routes ;