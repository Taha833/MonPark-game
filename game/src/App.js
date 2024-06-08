import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Waitlist from './Pages/Waitlist';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/waitlist" element={<Waitlist />} exact/>
    </Routes>

    </Router>
  );
}

export default App;
