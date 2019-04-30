import React from 'react'
import Header from './components/Header'
import Home from './pages/Home'
import Tokeniser from './pages/Tokeniser'
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css'


const App: React.FC = () => {

  return (
    <Router>
      <div>
        <Header />

        <Route exact path="/" component={Home} />
        <Route path="/tokeniser" component={Tokeniser} />
      </div>
    </Router>
  )
}

export default App
