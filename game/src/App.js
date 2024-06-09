import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Waitlist from './Pages/Waitlist';
import Thankyou from './Pages/Thankyou';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/waitlist" element={<Waitlist />} exact/>
      <Route path="/thankyou" element={<Thankyou />} exact/>
    </Routes>

    </Router>
  );
}

export default App;
