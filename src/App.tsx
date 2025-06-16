import React from "react";
import { Toaster } from "react-hot-toast";
import RoutesContent from "./Routes/RoutesContent";

const App: React.FC = () => {
  return (
    <div className="font-inter antialiased">
      <Toaster position="top-right" />
      <RoutesContent />
    </div>
  );
};

export default App;
