import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
const SignIn = lazy(() => import("../Pages/Auth/SignIn"));
const LoadingScreen = lazy(() => import("../components/Common/LoadingScreen"));

const RoutesContent: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex flex-row justify-center items-center">
          <LoadingScreen />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<SignIn onViewChange={() => {}} />} />
      </Routes>
    </Suspense>
  );
};

export default RoutesContent;
