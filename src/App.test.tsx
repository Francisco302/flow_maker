import { AppFlowEditor } from "./components/editor/AppFlowEditor";

function App() {
    console.log("App component rendering...");

    return (
        <div style={{ width: '100%', height: '100vh', background: '#f0f0f0' }}>
            <div style={{ padding: '20px' }}>
                <h1 style={{ color: 'black' }}>Testing...</h1>
                <p style={{ color: 'black' }}>If you see this, React is working!</p>
            </div>
            <AppFlowEditor />
        </div>
    );
}

export default App;
