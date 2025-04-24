
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ProductPage from "./client/ProductPage";

export default function Home() {
  return (
    <div className="p-20">
      <Header />

      <ProductPage />
    </div>
  );
}
