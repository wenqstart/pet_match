import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Dating from "./pages/Dating";
import Expenses from "./pages/Expenses";
import Memories from "./pages/Memories";
import AddPet from "./pages/AddPet";
import PetDetail from "./pages/PetDetail";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "dating", Component: Dating },
      { path: "expenses", Component: Expenses },
      { path: "memories", Component: Memories },
      { path: "add-pet", Component: AddPet },
      { path: "pet/:id", Component: PetDetail },
      { path: "*", Component: NotFound },
    ],
  },
]);
