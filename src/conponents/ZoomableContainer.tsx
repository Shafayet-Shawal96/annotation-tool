import React, { useState, useRef, useCallback } from "react";

interface ZoomableContainerProps {
  children: React.ReactNode;
}

const ZoomableContainer: React.FC<ZoomableContainerProps> = ({ children }) => {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (!e.ctrlKey) return;
      e.preventDefault();

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const deltaZoom = -Math.sign(e.deltaY) * 0.1;
        const newZoom = Math.max(1, Math.min(5, zoom + deltaZoom));

        const scaleFactor = newZoom / zoom;
        const newPanX = mouseX - (mouseX - panX) * scaleFactor;
        const newPanY = mouseY - (mouseY - panY) * scaleFactor;

        setZoom(newZoom);
        setPanX(newPanX);
        setPanY(newPanY);
      }
    },
    [zoom, panX, panY, setZoom]
  );

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative" as const,
      }}
    >
      <div
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: "0 0",
          transition: "transform 0.1s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ZoomableContainer;
