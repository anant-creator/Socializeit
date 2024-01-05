import { Routes, Route, useNavigate } from  'react-router-dom';
import Login from './components/Login';
import Home from './container/Home';
import { useEffect } from 'react';
import { fetchUser } from './utils/fetchUser';
import { Search } from './components';


function App() {
  const navigate = useNavigate();
    
  useEffect(() => {
    const user = fetchUser();
    
    if (!user) return navigate('/login');
  }, []);

  return (
    <Routes>
      <Route path="/*" element={<Home/>}/>
      <Route path=":categoryId/" element={<Home/>}/>
      <Route path="login" element={<Login/>}/>
    </Routes>
  )
}


export default App;