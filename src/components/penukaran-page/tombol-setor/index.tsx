import React from "react";

const TombolSetor = ({ onClick }: { onClick: () => void }) => (
  <div className="flex flex-col items-center p-6 mb-20">
    <button
      onClick={onClick}
      className="w-full p-2 text-white rounded-md hover:bg-opacity-90"
      style={{ backgroundColor: "#276561" }}
    >
      Setor
    </button>
  </div>
);

export default TombolSetor;