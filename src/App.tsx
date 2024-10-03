import Header from "./conponents/Header";
import Sidebar from "./conponents/Sidebar";
import SelectedBoxOptions from "./conponents/SelectedBoxOptions";
import ImageContainer from "./conponents/ImageContainer";

const App = () => {
  return (
    <div>
      <ImageContainer />

      <Header />
      <SelectedBoxOptions />

      <Sidebar />
    </div>
  );
};

export default App;
