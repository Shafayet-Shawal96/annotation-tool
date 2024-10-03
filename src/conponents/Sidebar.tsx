import { observer } from "mobx-react-lite";
import { state } from "./../states/AnnotationState";
import { classess } from "../utils/variables";

const Sidebar = observer(() => {
  return (
    <div className="fixed top-16 bottom-0 left-0 w-72 bg-[#1F2937] z-20 border-r border-[#00FFCE]">
      <h3 className="text-sm text-[#00ffce] mx-4 my-5">Annotation</h3>
      <div className="border-b border-gray-600 flex gap-6 px-6">
        <button
          onClick={state.showClassTrue}
          className={`${
            state.showClass
              ? "text-[#00ffce] border-b-2 border-[#00ffce]"
              : "text-gray-600 border-b-2 border-transparent"
          }`}
        >
          CLASSES
        </button>
        <button
          onClick={state.showClassFalse}
          className={`${
            !state.showClass
              ? "text-[#00ffce] border-b-2 border-[#00ffce]"
              : "text-gray-600 border-b-2 border-transparent"
          }`}
        >
          LAYERS
        </button>
      </div>
      {state.showClass ? (
        <div className="mt-4">
          {classess.map(({ name, color }, key) => (
            <div
              key={key}
              onClick={() => state.setSelectedClassIndex(key)}
              className={`flex items-center justify-between py-1.5 cursor-pointer hover:bg-[#4B5563] px-4 ${
                state.selectedClassIndex === key ? "bg-[#4B5563]" : ""
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
              <div className="bg-[#E5E7EB] rounded-full min-w-6 text-center text-xs">
                {state.boxes.reduce(
                  (acc, cur) => (cur.name === name ? acc + 1 : acc),
                  0
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          {state.boxes.map((box, key) => (
            <div
              key={key}
              onClick={() => state.setSelectedBox(box)}
              className={`flex items-center justify-between px-4 py-1.5 cursor-pointer hover:bg-[#4B5563] ${
                state.selectedBox?.id === box.id ? "bg-[#4B5563]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: box.color }}
                  className="w-4 h-4 rounded-full"
                ></div>
                <div style={{ color: box.color }}>
                  <span className="ml-2">{box.name}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  state.removeBox(box.id);
                }}
                className="bg-[#E5E7EB] rounded-md text-center text-xs px-1"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default Sidebar;
