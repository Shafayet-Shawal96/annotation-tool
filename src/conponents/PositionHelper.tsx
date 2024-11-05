import React from "react";
import { state } from "../states/AnnotationState";
import { observer } from "mobx-react-lite";

export const PositionHelper = observer(function PositionHelper() {
  return (
    <>
      <div
        className="pointer-events-none absolute left-0 z-10 w-full backdrop-invert h-0.5 opacity-70"
        style={{
          top: state.mousePosition.y,
        }}
      ></div>
      <div
        className="pointer-events-none absolute top-0 z-10 backdrop-invert w-0.5 h-full opacity-70"
        style={{
          left: state.mousePosition.x,
        }}
      ></div>
    </>
  );
});
