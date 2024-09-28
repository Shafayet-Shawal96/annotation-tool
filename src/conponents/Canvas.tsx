import React from "react";

function Canvas() {
  return (
    <div className="bg-[#374151] w-[100vw] h-[100vh] flex justify-center items-center">
      <canvas className="bg-white" width={600} height={900} />
    </div>
  );
}

export default Canvas;
