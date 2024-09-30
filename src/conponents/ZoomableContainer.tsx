import React, { useState, useRef, useCallback } from "react";

interface ZoomableContainerProps {
  children: React.ReactNode;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}

const ZoomableContainer: React.FC<ZoomableContainerProps> = ({
  children,
  zoom,
  setZoom,
}) => {
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (!e.ctrlKey) return;

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomScale =
          zoom > 2
            ? 0.4
            : zoom > 3
            ? 0.6
            : zoom > 4
            ? 0.8
            : zoom > 5
            ? 1
            : zoom > 6
            ? 1.2
            : 0.1;

        const deltaZoom = -Math.sign(e.deltaY) * zoomScale;
        const newZoom = Math.max(1 / 7, Math.min(7, zoom + deltaZoom));

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
