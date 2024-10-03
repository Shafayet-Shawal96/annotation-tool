import { Box, ResizeDirection } from "../states/AnnotationState";

const BoxesComponent = ({
  box,
  selectedBox,
  ctrlKeyPressed,
  handleResizeMouseDown,
  handleBoxMouseDown,
}: {
  box: Box;
  selectedBox: Box | null;
  ctrlKeyPressed: boolean;
  handleResizeMouseDown: (
    box: Box,
    direction: ResizeDirection,
    e: React.MouseEvent
  ) => void;
  handleBoxMouseDown: (box: Box, e: React.MouseEvent) => void;
}) => {
  return (
    <div
      key={box.id}
      onMouseDown={(e) => handleBoxMouseDown(box, e)}
      className={`absolute ${
        selectedBox?.id === box.id ? "border-2" : "border"
      } z-10`}
      style={{
        left: Math.min(box.start_x, box.end_x),
        top: Math.min(box.start_y, box.end_y),
        width: Math.abs(box.end_x - box.start_x),
        height: Math.abs(box.end_y - box.start_y),
        backgroundColor: box.color + "22",
        borderColor: box.color,
      }}
    >
      {selectedBox?.id === box.id && (
        <>
          <div
            onMouseDown={(e) => handleResizeMouseDown(box, "top-left", e)}
            className={`-left-[4px] -top-[4px] w-2 h-2 absolute bg-white ${
              ctrlKeyPressed ? "cursor-nw-resize" : ""
            }`}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(box, "top-right", e)}
            className={`-right-[4px] -top-[4px] w-2 h-2 absolute bg-white ${
              ctrlKeyPressed ? "cursor-ne-resize" : ""
            }`}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(box, "bottom-left", e)}
            className={`-left-[4px] -bottom-[4px] w-2 h-2 absolute bg-white ${
              ctrlKeyPressed ? "cursor-sw-resize" : ""
            }`}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(box, "bottom-right", e)}
            className={`-right-[4px] -bottom-[4px] w-2 h-2 absolute bg-white ${
              ctrlKeyPressed ? "cursor-se-resize" : ""
            }`}
          />
        </>
      )}
    </div>
  );
};

export default BoxesComponent;
