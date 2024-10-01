import React, { useEffect, useRef, useState } from "react";
import ZoomableContainer from "./conponents/ZoomableContainer";
import PositionHelper from "./conponents/PositionHelper";
import { classess } from "./utils/variables";
import uuid from "react-native-uuid";
// import AnnotateBoxContainer from "./conponents/AnnotateBoxContainer";

type Position = {
  x: number;
  y: number;
};

interface Box {
  id: string;
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  name: string;
  color: string;
}

type ResizeDirection =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

function App() {
  const [imageHeight, setImageHeight] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [activity, setActivity] = useState<
    "" | "isDrawing" | "isDragging" | "isResizing"
  >("");
  const [showclasses, setShowClasses] = useState(true);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [selectedClass, setSelectedClass] = useState(0);
  const [resizeDirection, setResizeDirection] =
    useState<ResizeDirection | null>(null);

  const handleMouseDownParent = (e: React.MouseEvent) => {
    if (e.ctrlKey) return;
    e.stopPropagation();

    if (activity == "" && containerRef.current) {
      setSelectedBox(null);
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top;

      setCurrentBox({
        id: uuid.v4() as string,
        color: classess[selectedClass].color,
        name: classess[selectedClass].name,
        start_x:
          (x < 0 ? 0 : x > containerRect.width ? containerRect.width : x) /
          scale,
        start_y:
          (y < 0 ? 0 : y > containerRect.height ? containerRect.height : y) /
          scale,
        end_x:
          (x < 0 ? 0 : x > containerRect.width ? containerRect.width : x) /
          scale,
        end_y:
          (y < 0 ? 0 : y > containerRect.height ? containerRect.height : y) /
          scale,
      });

      setActivity("isDrawing");
    }
  };

  const handleBoxMouseDown = (box: Box, e: React.MouseEvent) => {
    if (!e.ctrlKey) return;

    e.stopPropagation();
    setShowClasses(false);
    setActivity("isDragging");
    setSelectedBox(box);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!e.ctrlKey) return;
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (activity !== "" && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const currentX = Math.max(
        Math.min(
          (e.clientX - containerRect.left) / scale,
          containerRect.width / scale
        ),
        0
      );
      const currentY = Math.max(
        Math.min(
          (e.clientY - containerRect.top) / scale,
          containerRect.height / scale
        ),
        0
      );

      if (activity === "isDrawing" && currentBox && !e.ctrlKey) {
        setCurrentBox({
          ...currentBox,
          end_x: currentX,
          end_y: currentY,
        });
      }

      if (activity === "isDragging" && selectedBox && e.ctrlKey) {
        const deltaX = e.movementX / scale;
        const deltaY = e.movementY / scale;

        setBoxes((prevBoxes) =>
          prevBoxes.map((box) => {
            if (box.id === selectedBox?.id) {
              const newX = Math.max(
                0,
                Math.min(
                  box.start_x + deltaX,
                  containerRect.width / scale -
                    Math.abs(box.start_x - box.end_x)
                )
              );
              const newY = Math.max(
                0,
                Math.min(
                  box.start_y + deltaY,
                  containerRect.height / scale -
                    Math.abs(box.start_y - box.end_y)
                )
              );
              return {
                ...box,
                start_x: newX,
                start_y: newY,
                end_x: box.end_x - (box.start_x - newX),
                end_y: box.end_y - (box.start_y - newY),
              };
            }
            return box;
          })
        );
      }

      if (
        activity === "isResizing" &&
        selectedBox &&
        resizeDirection &&
        e.ctrlKey
      ) {
        setBoxes((prevBoxes) =>
          prevBoxes.map((box) => {
            if (box.id === selectedBox!.id) {
              let newBox: Box | null = null;

              switch (resizeDirection) {
                case "top-left": {
                  newBox = {
                    ...box,
                    start_x: Math.min(
                      currentX,
                      box.start_x + Math.abs(box.start_x - box.end_x)
                    ),
                    start_y: Math.min(
                      currentY,
                      box.start_y + Math.abs(box.start_y - box.end_y)
                    ),
                  };
                  break;
                }
                case "top-right": {
                  newBox = {
                    ...box,
                    start_y: Math.min(
                      currentY,
                      box.start_y + Math.abs(box.start_y - box.end_y)
                    ),
                    end_x: box.start_x + Math.max(currentX - box.start_x, 0),
                  };
                  break;
                }
                case "bottom-left": {
                  newBox = {
                    ...box,
                    end_y: Math.min(
                      currentY,
                      box.end_y + Math.abs(box.end_y - box.start_y)
                    ),
                    start_x: currentX,
                  };
                  break;
                }
                case "bottom-right": {
                  newBox = {
                    ...box,
                    end_x: Math.min(
                      currentX,
                      box.end_x + Math.abs(box.end_x - box.start_x)
                    ),
                    end_y: Math.min(
                      currentY,
                      box.end_y + Math.abs(box.end_y - box.start_y)
                    ),
                  };
                  break;
                }
              }

              return newBox ?? box;
            }
            return box;
          })
        );
      }
    }
    if (e.ctrlKey && dragging) {
      setPosition({
        x: e.clientX - offset.x,

        y: e.clientY - offset.y,
      });
    }

    setMousePosition({
      x: e.pageX,
      y: e.pageY,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
    if (activity === "isDrawing" && currentBox) {
      if (
        !(
          currentBox?.start_x === currentBox?.end_x &&
          currentBox?.start_y === currentBox?.end_y
        )
      ) {
        setBoxes((prev) => [
          ...prev,
          {
            ...currentBox,
            start_x: Math.min(currentBox.start_x, currentBox.end_x),
            start_y: Math.min(currentBox.start_y, currentBox.end_y),
            end_x: Math.max(currentBox.start_x, currentBox.end_x),
            end_y: Math.max(currentBox.start_y, currentBox.end_y),
          },
        ]);
      }
      setCurrentBox(null);
    }
    if (activity) {
      setActivity("");
    }
  };

  const handleResizeMouseDown = (
    box: Box,
    direction: ResizeDirection,
    e: React.MouseEvent
  ) => {
    if (!e.ctrlKey) return;
    e.stopPropagation();
    setActivity("isResizing");
    setResizeDirection(direction);
    setSelectedBox(box);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" && selectedBox !== null) {
        setBoxes((prev) => prev.filter((item) => item.id !== selectedBox.id));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedBox]);

  useEffect(() => {
    window.scrollTo({
      top: window.innerHeight / 2,
      left: window.innerWidth / 2,
    });

    const img = new Image();
    img.src = "/annotate.jpg";

    img.onload = () => {
      const height = (img.naturalHeight / img.naturalWidth) * 600;
      setPosition({
        x: window.innerWidth - 150,
        y: window.innerHeight - height / 2,
      });
      setImageHeight(height);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event) {
        setIsCtrlPressed(true);
      }
      const validKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      if (validKeys.includes(event.key)) {
        if (+event.key <= classess.length) setSelectedClass(+event.key - 1);
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
    <div>
      <div
        onMouseDown={handleMouseDownParent}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="bg-[#374151] w-[200vw] h-[200vh] relative overflow-hidden cursor-crosshair"
      >
        <ZoomableContainer zoom={scale} setZoom={setScale}>
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
          >
            <div ref={containerRef} className="w-full h-full relative parent">
              {boxes.map((box) => (
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
                        onMouseDown={(e) =>
                          handleResizeMouseDown(box, "top-left", e)
                        }
                        className={`-left-[4px] -top-[4px] w-2 h-2 absolute bg-white ${
                          isCtrlPressed ? "cursor-nw-resize" : ""
                        }`}
                      />
                      <div
                        onMouseDown={(e) =>
                          handleResizeMouseDown(box, "top-right", e)
                        }
                        className={`-right-[4px] -top-[4px] w-2 h-2 absolute bg-white ${
                          isCtrlPressed ? "cursor-ne-resize" : ""
                        }`}
                      />
                      <div
                        onMouseDown={(e) =>
                          handleResizeMouseDown(box, "bottom-left", e)
                        }
                        className={`-left-[4px] -bottom-[4px] w-2 h-2 absolute bg-white ${
                          isCtrlPressed ? "cursor-sw-resize" : ""
                        }`}
                      />
                      <div
                        onMouseDown={(e) =>
                          handleResizeMouseDown(box, "bottom-right", e)
                        }
                        className={`-right-[4px] -bottom-[4px] w-2 h-2 absolute bg-white ${
                          isCtrlPressed ? "cursor-se-resize" : ""
                        }`}
                      />
                    </>
                  )}
                </div>
              ))}
              {currentBox && (
                <div
                  className="absolute z-10 border border-dashed"
                  style={{
                    position: "absolute",
                    left: Math.min(currentBox.start_x, currentBox.end_x),
                    top: Math.min(currentBox.start_y, currentBox.end_y),
                    width: Math.abs(currentBox.end_x - currentBox.start_x),
                    height: Math.abs(currentBox.end_y - currentBox.start_y),
                    backgroundColor: currentBox.color + "22",
                    borderColor: currentBox.color,
                  }}
                />
              )}
            </div>
          </div>
        </ZoomableContainer>
        {!isCtrlPressed && activity === "" && (
          <PositionHelper mousePosition={mousePosition} />
        )}
      </div>

      <div className="fixed left-0 h-16 right-0 top-0 bg-[#111827] z-20 border-b border-[#00FFCE]"></div>
      {selectedBox && (
        <div className="fixed top-[76px] left-[300px] w-72 bg-[#1F2937] z-20 border border-[#00FFCE]">
          <div className="my-4">
            <div className="flex items-center justify-between mx-4 mb-4">
              <h3 className="text-sm text-[#00ffce]">Change Class</h3>
              <button
                onClick={() => setSelectedBox(null)}
                className="bg-[#E5E7EB] rounded-md text-center text-xs px-1"
              >
                Close
              </button>
            </div>
            {classess.map(({ name, color }, key) => (
              <div
                key={key}
                onClick={() => {
                  setBoxes((prev) =>
                    prev.map((box) =>
                      box.id === selectedBox.id ? { ...box, name, color } : box
                    )
                  );
                  setSelectedBox(null);
                }}
                className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#4B5563] ${
                  selectedBox.name === name ? "bg-[#4B5563]" : ""
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
      )}

      <div className="fixed top-16 bottom-0 left-0 w-72 bg-[#1F2937] z-20 border-r border-[#00FFCE]">
        <h3 className="text-sm text-[#00ffce] mx-4 my-5">Annotation</h3>
        <div className="border-b border-gray-600 flex gap-6 px-6">
          <button
            onClick={() => setShowClasses(true)}
            className={`${
              showclasses
                ? "text-[#00ffce] border-b-2 border-[#00ffce]"
                : "text-gray-600 border-b-2 border-transparent"
            }`}
          >
            CLASSES
          </button>
          <button
            onClick={() => setShowClasses(false)}
            className={`${
              !showclasses
                ? "text-[#00ffce] border-b-2 border-[#00ffce]"
                : "text-gray-600 border-b-2 border-transparent"
            }`}
          >
            LAYERS
          </button>
        </div>
        {showclasses ? (
          <div className="mt-4">
            {classess.map(({ name, color }, key) => (
              <div
                key={key}
                onClick={() => setSelectedClass(key)}
                className={`flex items-center justify-between py-2 cursor-pointer hover:bg-[#4B5563] px-4 ${
                  selectedClass === key ? "bg-[#4B5563]" : ""
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
                  {boxes.reduce(
                    (acc, cur) => (cur.name === name ? acc + 1 : acc),
                    0
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            {boxes.map((box, key) => (
              <div
                key={key}
                onClick={() => setSelectedBox(box)}
                className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#4B5563] ${
                  selectedBox?.id === box.id ? "bg-[#4B5563]" : ""
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
                    setBoxes((prev) =>
                      prev.filter((item) => item.id !== box.id)
                    );
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
    </div>
  );
}

export default App;
