import { makeAutoObservable } from "mobx";

export type Box = {
  id: string;
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  name: string;
  color: string;
};

export type ResizeDirection =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export class State {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  showClass = true;
  toggleShowClass = () => {
    this.showClass = !this.showClass;
  };
  showClassTrue = () => {
    this.showClass = true;
  };
  showClassFalse = () => {
    this.showClass = false;
  };

  boxes: Box[] = [];
  addBoxes = (box: Box) => {
    this.boxes = [...this.boxes, box];
  };
  removeBox = (id: string) => {
    this.boxes = this.boxes.filter((item) => item.id !== id);
  };
  updateBoxClass = (name: string, color: string) => {
    this.boxes = this.boxes.map((box) =>
      box.id === this.selectedBox?.id ? { ...box, name, color } : box
    );
    this.selectedBox = null;
  };
  moveBox = (deltaX: number, deltaY: number, width: number, height: number) => {
    if (this.selectedBox) {
      this.boxes = this.boxes.map((box) => {
        if (box.id === this.selectedBox?.id) {
          const newX = Math.max(
            0,
            Math.min(
              box.start_x + deltaX,
              width / state.scale - Math.abs(box.start_x - box.end_x)
            )
          );
          const newY = Math.max(
            0,
            Math.min(
              box.start_y + deltaY,
              height / state.scale - Math.abs(box.start_y - box.end_y)
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
      });
    }
  };
  resizeBox = (currentX: number, currentY: number) => {
    if (this.selectedBox && this.resizeDirection) {
      this.boxes = this.boxes.map((box) => {
        if (box.id === this.selectedBox?.id) {
          let newBox: Box | null = null;

          switch (this.resizeDirection) {
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
      });
    }
  };

  newBox: Box | null = null;
  setNewBox = (box: Box | null) => {
    this.newBox = box;
  };

  selectedBox: Box | null = null;
  setSelectedBox = (box: Box) => {
    this.selectedBox = box;
  };
  setSelectedBoxNull = () => {
    this.selectedBox = null;
  };

  selectedClassIndex = 0;
  setSelectedClassIndex = (index: number) => {
    this.selectedClassIndex = index;
  };

  ctrlKeyPressed = false;
  handleKeyDownEvent = (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      this.ctrlKeyPressed = true;
    }
    if (event.key === "Delete" && this.selectedBox !== null) {
      this.removeBox(this.selectedBox.id);
    }
  };
  handleKeyUpEvent = (event: KeyboardEvent) => {
    if (!event.ctrlKey) {
      this.ctrlKeyPressed = false;
    }
  };

  activity: null | "isDrawing" | "isDragging" | "isResizing" = null;
  setActivity = (
    activity: null | "isDrawing" | "isDragging" | "isResizing"
  ) => {
    this.activity = activity;
  };

  imageHeight = 0;
  setImageHeight = (height: number) => {
    this.imageHeight = height;
  };
  imageContainerOffset: {
    x: number;
    y: number;
  } | null = null;
  setImageContainerOffset = (
    offset: {
      x: number;
      y: number;
    } | null = null
  ) => {
    this.imageContainerOffset = offset;
  };
  imageContainerPosition: {
    x: number;
    y: number;
  } = {
    x: 0,
    y: 0,
  };
  setImageContainerPosition = (coor: { x: number; y: number }) => {
    this.imageContainerPosition = coor;
  };

  scale = 1;
  setScale = (scale: number) => {
    this.scale = scale;
  };

  handleMouseDownImageContainer = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!e.ctrlKey) return;

    this.imageContainerOffset = {
      x: e.clientX - this.imageContainerPosition.x,
      y: e.clientY - this.imageContainerPosition.y,
    };
  };

  handleBoxMouseDown = (box: Box, e: React.MouseEvent) => {
    if (!e.ctrlKey) return;

    e.stopPropagation();
    this.activity = "isDragging";
    this.selectedBox = box;
  };

  resizeDirection: ResizeDirection | null = null;
  handleResizeMouseDown = (
    box: Box,
    direction: ResizeDirection,
    e: React.MouseEvent
  ) => {
    if (!e.ctrlKey) return;
    e.stopPropagation();
    this.activity = "isResizing";
    this.resizeDirection = direction;
    this.selectedBox = box;
  };

  mousePosition = {
    x: 0,
    y: 0,
  };
  setMousePosition = (coor: { x: number; y: number }) => {
    this.mousePosition = coor;
  };
}

export const state = new State();
