import React from "react";

const TrendSphereLoader:React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="relative flex flex-col items-center">
        {/* Rotating Gradient Ring */}
        <div className="w-20 h-20 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>

        {/* Inner Glow */}
        <div className="absolute top-0 w-16 h-16 bg-gradient-to-r from-[#8402e7] to-[#e002c3] rounded-full blur-lg opacity-50"></div>

        {/* TrendSphere Text */}
        <p className="mt-4 text-lg text-[#e002c3] font-semibold animate-pulse">
          Loading TrendSphere...
        </p>
      </div>
    </div>
  );
};

export default TrendSphereLoader;
