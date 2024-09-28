import React from "react";

function PositionHelper({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  return (
    <>
      <div
        className="absolute left-0 top-0 z-10 border-r-2 border-b-2 border-white border-dashed"
        style={{
          right: window.innerWidth * 2 - mousePosition.x + 1,
          bottom: window.innerHeight * 2 - mousePosition.y - 4,
        }}
      ></div>
      <div
        className="absolute right-0 bottom-0 z-10 border-t-2 border-l-2 border-white border-dashed"
        style={{
          left: mousePosition.x - 3,
          top: mousePosition.y + 2,
        }}
      ></div>
    </>
  );
}

export default PositionHelper;
