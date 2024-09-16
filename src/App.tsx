import { ReactFlowProvider } from "@xyflow/react";
import NodeGraph from "./components/NodeGraph";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";

function App() {
  return (
    <ReactFlowProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <NodeGraph />
    </ReactFlowProvider>
  );
}

export default App;
