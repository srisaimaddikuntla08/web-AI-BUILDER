import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Pricing from "./pages/Pricing"
import Community from "./pages/Community"
import Preview from "./pages/Preview"
import View from "./pages/View"
import Myprojects from "./pages/Myprojects"
import Projects from "./pages/Projects"
import Navbar from "./components/Navbar"


function App() {
  

  return (
    <div>
    <Navbar/>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/pricing" element={<Pricing/>}/>
      <Route path="/community" element={<Community/>}/>
      <Route path="/projects/:projectId" element={<Projects/>}/>
      <Route path="/preview/:projectId" element={<Preview/>}/>   
      <Route path="/view/:projectId" element={<View/>}/>
      <Route path="/projects" element={<Myprojects/>}/>
      <Route path="/preview/:projectId/:versionId" element={<Preview/>}/>
     </Routes>
    </div>
  )
}

export default App
