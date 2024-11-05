import Header from "./conponents/Header";
import Sidebar from "./conponents/Sidebar";
import SelectedBoxOptions from "./conponents/SelectedBoxOptions";
import { ImageContainer } from "./conponents/ImageContainer";

const App = () => {
  return (
    <div className="p-[50px] w-screen h-screen bg-red-500">
      <div className="bg-blue-200 w-full h-full">
        <ImageContainer />
      </div>

      {/* <Header /> */}
      {/* <SelectedBoxOptions /> */}

      {/* <Sidebar /> */}
    </div>
  );
};

export default App;
