import React from "react";

const TombolSetor = ({ onClick }: { onClick: () => void }) => (
  <div className="w-full flex-col items-center p-6 mb-20">
    <button
      onClick={onClick}
      className="w-full p-2 font-semibold text-white rounded-md hover:bg-opacity-90"
      style={{ backgroundColor: "#000000" }}
    >
      Setor
    </button>
  </div>
);

export default TombolSetor;