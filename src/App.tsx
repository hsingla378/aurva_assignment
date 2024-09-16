import { ReactFlowProvider } from "@xyflow/react";
import NodeGraph from "./components/NodeGraph";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ReactFlowProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <NodeGraph />
    </ReactFlowProvider>
  );
}

export default App;
