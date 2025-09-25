import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { Header } from './components/layout/Header';
import { ChatPage } from './pages/ChatPage';

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
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
