import { makeAutoObservable } from "mobx";
import { classess } from "../utils/variables";

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
    if (
      Math.abs(box.start_x - box.end_x) > 5 &&
      Math.abs(box.start_y - box.end_y) > 5
    ) {
      this.boxes = [...this.boxes, box];
    }
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
    if (this.selectedBox) {
      this.boxes = this.boxes.map((box) =>
        box.id === this.selectedBox?.id
          ? { ...box, name: classess[index].name, color: classess[index].color }
          : box
      );
      this.selectedBox = {
        ...this.selectedBox,
        name: classess[index].name,
        color: classess[index].color,
      };
    } else {
      this.selectedClassIndex = index;
    }
  };

  ctrlKeyPressed = false;

  handleKeyDownEvent = (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      this.ctrlKeyPressed = true;
    }
    // if (event.key === "Delete" && this.selectedBox !== null) {
    //   this.removeBox(this.selectedBox.id);
    //   this.selectedBox = null;
    // }
  };

  handleKeyUpEvent = (event: KeyboardEvent) => {
    if (!event.ctrlKey) {
      this.ctrlKeyPressed = false;
    }
  };

  activity: null | "draw" | "pan" | "resize" = null;

  setActivity(activity: typeof this.activity) {
    this.activity = activity;
  }

  panStart = { x: 0, y: 0 };

  startPan(start: typeof this.panStart) {
    this.panStart = start;
  }

  pan = { x: 0, y: 0 };

  endPan() {
    this.pan = {
      x: this.pan.x + this.panStart.x - this.mousePosition.x,
      y: this.pan.y + this.panStart.y - this.mousePosition.y,
    };
  }

  imageWidth = 0;
  imageHeight = 0;

  setImageDimensions = (width: number, height: number) => {
    this.imageWidth = width;
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

  scaleFactor = 0;

  zoomIn() {
    this.scaleFactor += 1;

    const cX = this.containerWidth / 2 - this.pan.x;
    const cY = this.containerHeight / 2 - this.pan.y;

    const mX = this.mousePosition.x;
    const mY = this.mousePosition.y;

    const dX = mX - cX;
    const dY = mY - cY;

    const adjustX =
      dX * Math.pow(1.3, this.scaleFactor) -
      dX * Math.pow(1.3, this.scaleFactor - 1);
    const adjustY =
      dY * Math.pow(1.3, this.scaleFactor) -
      dY * Math.pow(1.3, this.scaleFactor - 1);

    this.pan.x += adjustX;
    this.pan.y += adjustY;
  }

  zoomOut() {
    this.scaleFactor -= 1;

    const cX = this.containerWidth / 2;
    const cY = this.containerHeight / 2;

    const mX = this.mousePosition.x;
    const mY = this.mousePosition.y;

    const dX = mX - cX;
    const dY = mY - cY;

    const adjustX =
      dX * Math.pow(1.3, this.scaleFactor) -
      dX * Math.pow(1.3, this.scaleFactor + 1);
    const adjustY =
      dY * Math.pow(1.3, this.scaleFactor) -
      dY * Math.pow(1.3, this.scaleFactor + 1);

    this.pan.x += adjustX;
    this.pan.y += adjustY;
  }

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

  scaleOffset = 1;

  setScaleOffset(scaleOffset: number) {
    this.scaleOffset = scaleOffset;
  }

  containerWidth = 0;
  containerHeight = 0;

  setContainerDimensions(w: number, h: number) {
    this.containerWidth = w;
    this.containerHeight = h;
  }

  get finalScale() {
    return state.scaleOffset * Math.pow(1.3, this.scaleFactor);
  }

  get finalImageDimensions() {
    const w = state.imageWidth * this.finalScale;
    const h = state.imageHeight * this.finalScale;

    const ret = {
      width: w,
      height: h,
      minWidth: w,
      minHeight: h,
    };

    return ret;
  }

  get finalPanningOffset() {
    if (this.activity !== "pan") {
      return { x: 0, y: 0 };
    }

    const dX_pixels = this.mousePosition.x - this.panStart.x;
    const dY_pixels = this.mousePosition.y - this.panStart.y;

    return {
      x: -dX_pixels,
      y: -dY_pixels,
    };
  }

  get finalPanOffset() {
    const dX_pixels = this.mousePosition.x - this.pan.x;
    const dY_pixels = this.mousePosition.y - this.pan.y;

    return {
      x: -dX_pixels,
      y: -dY_pixels,
    };
  }

  get finalImagePosition() {
    const { width, height } = this.finalImageDimensions;

    const x = (this.containerWidth - width) / 2;
    const y = (this.containerHeight - height) / 2;

    const { x: panning_x, y: panning_y } = this.finalPanningOffset;
    const { x: pan_x, y: pan_y } = this.pan;

    return {
      left: x - panning_x - pan_x,
      top: y - panning_y - pan_y,
    };
  }
}

export const state = new State();
