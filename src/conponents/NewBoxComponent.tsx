import { observer } from "mobx-react-lite";
import { state } from "../states/AnnotationState";

const NewBoxComponent = observer(() => {
  if (!state.newBox) return <></>;
  return (
    <div
      className="absolute z-10 border border-dashed"
      style={{
        position: "absolute",
        left: Math.min(state.newBox.start_x, state.newBox.end_x),
        top: Math.min(state.newBox.start_y, state.newBox.end_y),
        width: Math.abs(state.newBox.end_x - state.newBox.start_x),
        height: Math.abs(state.newBox.end_y - state.newBox.start_y),
        backgroundColor: state.newBox.color + "22",
        borderColor: state.newBox.color,
      }}
    />
  );
});

export default NewBoxComponent;
