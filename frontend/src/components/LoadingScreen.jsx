import React from "react";
import { FaSpinner } from "react-icons/fa";
import Logo from "./logo"; // Make sure the path is correct

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <Logo className="mb-4 w-24 h-24" /> {/* Adjust the size of the logo */}
  </div>
);

export default LoadingScreen;
