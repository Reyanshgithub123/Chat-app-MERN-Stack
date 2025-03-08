import { Navigate, Route, Router, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { useAuthStore } from './store/userAuthstore';
import {Loader} from "lucide-react"
import { Toaster } from 'react-hot-toast';
function App() {

  const {authUser,checkAuth,isCheckingAuth}=useAuthStore();
  useEffect(() => {
    checkAuth()
  
   
  }, [checkAuth])
  console.log({authUser})

  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
    <Loader className='size-10 animate-spin'/>
  </div>
  )


  return (
   <div data-theme="retro">
   
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser ? <Home/>: <Navigate to="/login"/>} />
        <Route path='/signup' element={!authUser ? <Signup/>: <Navigate to="/"/>}/>
        <Route path='/login' element={!authUser ?<Login/>:<Navigate to="/"/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/settings' element={authUser ?<Settings />:<Navigate to="/login"/>}/>
      </Routes>

      <Toaster/>
   </div>
  );
}

export default App;
