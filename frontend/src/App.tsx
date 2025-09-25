import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { Header } from './components/layout/Header';
import { ChatPage } from './pages/ChatPage';
import { BillPage } from './pages/BillPage';

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/bills/:id" element={<BillPage />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
