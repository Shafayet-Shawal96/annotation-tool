import React, { useEffect, useState } from "react";
import ZoomableContainer from "./conponents/ZoomableContainer";
import PositionHelper from "./conponents/PositionHelper";

type Position = {
  x: number;
  y: number;
};

function App() {
  const [imageHeight, setImageHeight] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!e.ctrlKey) return;
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMousePosition({
      x: e.pageX,
      y: e.pageY,
    });
    if (!e.ctrlKey) return;
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    window.scrollTo({
      top: window.innerHeight * 1.5 - window.innerHeight / 2,
      left: window.innerWidth * 1.5 - window.innerWidth / 2,
    });

    const img = new Image();
    img.src = "/annotate.jpg";

    img.onload = () => {
      const height = (img.naturalHeight / img.naturalWidth) * 600;
      setPosition({
        x: (window.innerWidth * 3) / 2 - 300,
        y: (window.innerHeight * 3) / 2 - height / 2,
      });
      setImageHeight(height);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.ctrlKey) {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="bg-[#374151] w-[300vw] h-[300vh] relative overflow-hidden"
    >
      <ZoomableContainer>
        <div
          onMouseDown={handleMouseDown}
          className="absolute w-[600px] cursor-grab"
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
            height: `${imageHeight}px`,
            backgroundImage: `url('/annotate.jpg')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            cursor: isCtrlPressed ? "grab" : "crosshair",
            opacity: isCtrlPressed ? "70%" : "100%",
          }}
        ></div>
      </ZoomableContainer>
      {!isCtrlPressed && <PositionHelper mousePosition={mousePosition} />}
    </div>
  );
}

export default App;
