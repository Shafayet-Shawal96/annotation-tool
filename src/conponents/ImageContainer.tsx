import React, { useEffect, useRef } from "react";
import ZoomableContainer from "./ZoomableContainer";
// import PositionHelper from "./PositionHelper";
import { classess } from "../utils/variables";
import uuid from "react-native-uuid";
import { observer } from "mobx-react-lite";
import { state } from "../states/AnnotationState";
import BoxesContainer from "./BoxesContainer";
import PositionHelper from "./PositionHelper";

const ImageContainer = observer(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDownParent = (e: React.MouseEvent) => {
    if (e.ctrlKey) return;
    e.stopPropagation();

    if (!state.activity && containerRef.current) {
      state.setSelectedBoxNull();
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top;

      state.setNewBox({
        id: uuid.v4() as string,
        color: classess[state.selectedClassIndex].color,
        name: classess[state.selectedClassIndex].name,
        start_x:
          (x < 0 ? 0 : x > containerRect.width ? containerRect.width : x) /
          state.scale,
        start_y:
          (y < 0 ? 0 : y > containerRect.height ? containerRect.height : y) /
          state.scale,
        end_x:
          (x < 0 ? 0 : x > containerRect.width ? containerRect.width : x) /
          state.scale,
        end_y:
          (y < 0 ? 0 : y > containerRect.height ? containerRect.height : y) /
          state.scale,
      });

      state.setActivity("isDrawing");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (state.activity && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const currentX = Math.max(
        Math.min(
          (e.clientX - containerRect.left) / state.scale,
          containerRect.width / state.scale
        ),
        0
      );
      const currentY = Math.max(
        Math.min(
          (e.clientY - containerRect.top) / state.scale,
          containerRect.height / state.scale
        ),
        0
      );

      if (state.activity === "isDrawing" && state.newBox && !e.ctrlKey) {
        state.setNewBox({
          ...state.newBox,
          end_x: currentX,
          end_y: currentY,
        });
      }

      if (state.activity === "isDragging" && state.selectedBox && e.ctrlKey) {
        const deltaX = e.movementX / state.scale;
        const deltaY = e.movementY / state.scale;

        state.moveBox(
          deltaX,
          deltaY,
          containerRect.width,
          containerRect.height
        );
      }

      if (
        state.activity === "isResizing" &&
        state.selectedBox &&
        state.resizeDirection &&
        e.ctrlKey
      ) {
        state.resizeBox(currentX, currentY);
      }
    }
    if (e.ctrlKey && state.imageContainerOffset) {
      state.setImageContainerPosition({
        x: e.clientX - state.imageContainerOffset.x,

        y: e.clientY - state.imageContainerOffset.y,
      });
    }

    state.setMousePosition({
      x: e.pageX,
      y: e.pageY,
    });
  };

  const handleMouseUp = () => {
    if (state.activity === "isDrawing" && state.newBox) {
      if (
        !(
          state.newBox?.start_x === state.newBox?.end_x &&
          state.newBox?.start_y === state.newBox?.end_y
        )
      ) {
        state.addBoxes({
          ...state.newBox,
          start_x: Math.min(state.newBox.start_x, state.newBox.end_x),
          start_y: Math.min(state.newBox.start_y, state.newBox.end_y),
          end_x: Math.max(state.newBox.start_x, state.newBox.end_x),
          end_y: Math.max(state.newBox.start_y, state.newBox.end_y),
        });
      }
      state.setNewBox(null);
    }
    state.setImageContainerOffset(null);
    state.setActivity(null);
  };

  useEffect(() => {
    window.scrollTo({
      top: window.innerHeight / 2,
      left: window.innerWidth / 2,
    });

    const img = new Image();
    img.src = "/annotate.jpg";

    img.onload = () => {
      const height = (img.naturalHeight / img.naturalWidth) * 600;
      state.setImageContainerPosition({
        x: window.innerWidth - 150,
        y: window.innerHeight - height / 2,
      });
      state.setImageHeight(height);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const validKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      if (validKeys.includes(event.key)) {
        if (+event.key <= classess.length)
          state.setSelectedClassIndex(+event.key - 1);
      } else {
        state.handleKeyDownEvent(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", state.handleKeyUpEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", state.handleKeyUpEvent);
    };
  }, []);
  return (
    <div
      onMouseDown={handleMouseDownParent}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="bg-[#374151] w-[200vw] h-[200vh] relative overflow-hidden cursor-crosshair"
    >
      <ZoomableContainer zoom={state.scale} setZoom={state.setScale}>
        <BoxesContainer ref={containerRef} />
      </ZoomableContainer>
      {!state.ctrlKeyPressed && !state.activity && (
        <PositionHelper mousePosition={state.mousePosition} />
      )}
    </div>
  );
});

export default ImageContainer;
