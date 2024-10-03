import { observer } from "mobx-react-lite";
import { state } from "../states/AnnotationState";
import NewBoxComponent from "./NewBoxComponent";
import BoxesComponent from "./BoxesComponent";
import { forwardRef } from "react";

const BoxesContainer = observer(
  forwardRef<HTMLDivElement>((_, ref) => {
    return (
      <div
        onMouseDown={state.handleMouseDownImageContainer}
        className="absolute w-[600px] cursor-grab"
        style={{
          top: `${state.imageContainerPosition.y}px`,
          left: `${state.imageContainerPosition.x}px`,
          height: `${state.imageHeight}px`,
          backgroundImage: `url('/annotate.jpg')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          cursor: state.ctrlKeyPressed ? "grab" : "crosshair",
          opacity: state.ctrlKeyPressed ? "70%" : "100%",
        }}
      >
        <div ref={ref} className="w-full h-full relative parent">
          {state.boxes.map((box) => (
            <BoxesComponent
              key={box.id}
              box={box}
              ctrlKeyPressed={state.ctrlKeyPressed}
              selectedBox={state.selectedBox}
              handleBoxMouseDown={state.handleBoxMouseDown}
              handleResizeMouseDown={state.handleResizeMouseDown}
            />
          ))}
          <NewBoxComponent />
        </div>
      </div>
    );
  })
);

export default BoxesContainer;
