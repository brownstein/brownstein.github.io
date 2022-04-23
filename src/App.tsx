import debounce from 'debounce';
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import { Background } from './Background';
import './App.css';

function App() {
  const [bgColor, setBgColor] = useState<[number, number, number]>([0.5, 0.6, 0.7]);
  useEffect(() => {
    const onScroll = () => {
      setBgColor([
        Math.random(),
        Math.random(),
        Math.random()
      ]);
    };
    const debouncedScroll = debounce(onScroll, 200);
    window.addEventListener('scroll', debouncedScroll);
    const int = setInterval(onScroll, 2000);
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      clearInterval(int);
    };
  }, [setBgColor]);
  return (
    <div className="App">
      <Background color={bgColor}/>
      <header className="App-header">
        <h1>Robert Brownstein</h1>
        <a href="Robert%20Brownstein%20Resume.pdf">Here's my resume.</a>
      </header>
    </div>
  );
}

export default App;
