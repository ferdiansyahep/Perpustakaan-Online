
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard';
import Koleksi from './pages/Koleksi';
import Detail from './pages/Detail';
import About from './pages/About';
import Login from './pages/Login';
import Addbook from './pages/Addbook';
function App() {

  return (
    <>
     <Router>
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tambah" element={<Addbook />} />
        <Route path="/koleksi" element={<Koleksi />} />
        <Route path="/books/:id" element={<Detail />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer /> 
    </Router>
    </>
  )
}

export default App
