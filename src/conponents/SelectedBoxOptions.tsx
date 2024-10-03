import { observer } from "mobx-react-lite";
import { state } from "../states/AnnotationState";
import { classess } from "../utils/variables";

const SelectedBoxOptions = observer(() => {
  if (!state.selectedBox) return <></>;
  return (
    <div className="fixed top-[76px] left-[300px] w-72 bg-[#1F2937] z-20 border border-[#00FFCE]">
      <div className="my-4">
        <div className="flex items-center justify-between mx-4 mb-4">
          <h3 className="text-sm text-[#00ffce]">Change Class</h3>
          <button
            onClick={state.setSelectedBoxNull}
            className="bg-[#E5E7EB] rounded-md text-center text-xs px-1"
          >
            Close
          </button>
        </div>
        {classess.map(({ name, color }, key) => (
          <div
            key={key}
            onClick={() => state.updateBoxClass(name, color)}
            className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#4B5563] ${
              state.selectedBox?.name === name ? "bg-[#4B5563]" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                style={{ backgroundColor: color }}
                className="w-4 h-4 rounded-full"
              ></div>
              <div className="text-white">
                {key + 1}. <span className="ml-2">{name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default SelectedBoxOptions;
