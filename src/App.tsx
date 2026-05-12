import { AppFlowEditor } from "./components/editor/AppFlowEditor";

function App() {
  console.log("App rendering...");
  console.log("AppFlowEditor:", AppFlowEditor);

  return (
    <div className="w-full h-screen bg-gray-100">
      <AppFlowEditor />
    </div>
  );
}

export default App;
