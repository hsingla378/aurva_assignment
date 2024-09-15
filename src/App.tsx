import { ReactFlowProvider } from "@xyflow/react";
import NodeGraph from "./components/NodeGraph";

function App() {
  return (
    <ReactFlowProvider>
      <NodeGraph />
    </ReactFlowProvider>
  );
}

export default App;
