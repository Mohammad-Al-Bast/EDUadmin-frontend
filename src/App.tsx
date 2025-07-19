import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import NotFound from './pages/not-found';

const Home = () => <div><h1>Home Page</h1><p>Welcome to our app!</p></div>;
const About = () => <div><h1>About Page</h1><p>Learn more about us.</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
