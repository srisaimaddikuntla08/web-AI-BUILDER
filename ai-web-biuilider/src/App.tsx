import { Route, Routes, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Pricing from "./pages/Pricing"
import Community from "./pages/Community"
import Preview from "./pages/Preview"
import View from "./pages/View"
import Myprojects from "./pages/Myprojects"
import Projects from "./pages/Projects"
import Navbar from "./components/Navbar"
import {Toaster} from 'sonner'
import AuthPage from "./pages/auth/AuthPage"
import  Settings  from "./pages/Settings"
import Loading from "./pages/loading"



function App() {


  const {pathname} = useLocation();

  const hideNavBar = pathname.startsWith('/projects') && pathname !== '/projects' || pathname.startsWith("/view/") || pathname.startsWith('/preview/')
  

  return (
    <div>
      <Toaster/>
      {!hideNavBar && <Navbar/>}
     <Routes>
      <Route  path="/projects/:projectId" element={<Projects/>}/>
      <Route path="/" element={<Home/>}/>
      <Route path="/pricing" element={<Pricing/>}/>
      <Route path="/community" element={<Community/>}/>
      <Route path="/preview/:projectId" element={<Preview/>}/>   
      <Route path="/view/:projectId" element={<View/>}/>
      <Route path="/projects" element={<Myprojects/>}/>
      <Route path="/account/settings" element={<Settings/>}/>
      <Route path="/auth/:pathname" element={<AuthPage/>}/>
      <Route path="/preview/:projectId/:versionId" element={<Preview/>}/>
      <Route path="/loading" element={<Loading/>}/>
     </Routes>
    </div>
  )
}

export default App
