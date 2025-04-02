import { Link } from "react-router-dom";
import logo from "@/assets/vams.svg";

const routes = [
  {
    name: "About Us",
    path: "/aboutus",
  },
  {
    name: "Support",
    path: "/",
  },
  {
    name: "Contacts",
    path: "/contacts",
  },
];

export default function Footer() {
  return (
    <footer className="items-center py-5 bg-gray-200 text-black w-full">
      <div className="container mx-auto px-5 flex justify-around my-10">
        {routes.map((route) => (
          <Link
            key={route.name}
            to={route.path}
            className="text-black hover:text-gray-400 underline underline-offset-4"
          >
            {route.name}
          </Link>
        ))}
      </div>
      <img src={logo} alt="VAMS" className="object-cover block mx-auto" />
      <p className="text-xs text-center my-3">
        &copy; 2024-2025 VAMS Ltd
        <br />
        Privacy Policy &amp;&amp; Terms of Service
      </p>
    </footer>
  );
}
