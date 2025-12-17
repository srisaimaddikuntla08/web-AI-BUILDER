import { Route, Routes, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Pricing from "./pages/Pricing"
import Community from "./pages/Community"
import Preview from "./pages/Preview"
import View from "./pages/View"
import Myprojects from "./pages/Myprojects"
import Projects from "./pages/Projects"
import Navbar from "./components/Navbar"


function App() {


  const {pathname} = useLocation();

  const hideNavBar = pathname.startsWith('/projects') && pathname !== '/projects' || pathname.startsWith("/view/") || pathname.startsWith('/preview/')
  

  return (
    <div>
      {!hideNavBar && <Navbar/>}

     <Routes>
      <Route  path="/projects/:projectId" Component={Projects}/>
      <Route path="/" element={<Home/>}/>
      <Route path="/pricing" element={<Pricing/>}/>
      <Route path="/community" element={<Community/>}/>
      <Route path="/preview/:projectId" element={<Preview/>}/>   
      <Route path="/view/:projectId" element={<View/>}/>
      <Route path="/projects" element={<Myprojects/>}/>
      <Route path="/preview/:projectId/:versionId" element={<Preview/>}/>
     </Routes>
    </div>
  )
}

export default App
