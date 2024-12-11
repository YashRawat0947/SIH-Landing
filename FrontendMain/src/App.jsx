
import { BrowserRouter,Routes,Route } from "react-router-dom"
import Encrypt from "./Encrypt"
import Ticket from "./Ticket"
import Admin from "./Admin"
import AdminLogin from "./AdminLogin"
import Landing from "./Landing"



const App = () => {
  return (
    <div className='  font-nunito-sans scroll-none '>
    
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Landing/>}></Route>
      <Route path="/encrypt" element={<Encrypt/>}></Route>
      <Route path="/ticket" element={<Ticket/>}></Route>
      <Route path="/admin" element={<Admin/>}></Route>
      <Route path="/adminlogin" element={<AdminLogin/>}></Route>
      </Routes>
        
      </BrowserRouter>
    </div>
  )
}

export default App