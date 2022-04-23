import debounce from 'debounce';
import { useState, useEffect } from 'react';
import { Background } from './Background';
import './App.css';
import resumeThumbnail from './resume-thumbnail.png';
import osThumbnail from './open-sourcerer.png';

const MOBILE_CUTOFF = 900;

function App() {
  const [mobile, setMobile] = useState<boolean>(window.innerWidth < MOBILE_CUTOFF);
  const [bgColor, setBgColor] = useState<[number, number, number]>([0.5, 0.6, 0.7]);
  useEffect(() => {
    let active = true;
    function resize() {
      setMobile(window.innerWidth < MOBILE_CUTOFF);
    }
    function pulse() {
      if (!active) {
        return;
      }
      setBgColor([
        Math.random(),
        Math.random(),
        Math.random()
      ]);
      setTimeout(pulse, 5000);
    }
    pulse();
    const debouncedResize = debounce(resize, 200);
    window.addEventListener('resize', debouncedResize);
    return () => {
      active = false;
      window.removeEventListener('resize', debouncedResize);
    };
  }, [setBgColor]);
  const colorTheme = (bgColor.reduce((acc, v) => (acc + v), 0) > 1.4)
    ? 'light'
    : 'dark';
  const tile1 = (
    <div className='tile borderless'>
      <h2>Full Stack Software Engineer</h2>
    </div>
  );
  const tile2 = (
    <div className='tile borderless'>
      <h3>I'm fluent in TypeScript, Python, WebGL, React, Node.js, AWS, Docker, SQL, and NoSQL. I'm passionate about computational geometry and great UX.</h3>
    </div>
  );
  const tile3 = (
    <div className='tile borderless'>
      <h3>Current Employer</h3>
      <p>Pending</p>
      <h3>Additional Projects</h3>
      <ul>
        <li><a href='https://github.com/socialtables/openfpc' target='_blank'>OpenFPC</a></li>
        <li><a href='https://github.com/socialtables/saml-protocol' target='_blank'>SAML-Protocol</a></li>
        <li><a href='http://brownstein.github.io/birdify/' target='_blank'>Birdify</a></li>
      </ul>
    </div>
  );
  return (
    <div className={`app ${colorTheme}`}>
      <Background color={bgColor}/>
      <div className='content-box'>
        <h1>Robert Brownstein</h1>
        { mobile ? <div className='row'>{tile1}{tile2}</div> : null }
        <div className='row'>
          <a className='tile big resume' href="Robert%20Brownstein%20Resume.pdf" target='_blank'>
            <img src={resumeThumbnail} />
            <span>resume</span>
          </a>
          <a className='tile big' href='https://brownstein.github.io/open-sourcerer-ts' target='_blank'>
            <img src={osThumbnail} />
            <span>side project</span>
          </a>
        </div>
        { mobile ? null : <div className='row'>{tile1}{tile2}{tile3}</div> }
        { mobile ? <div className='row'>{tile3}</div> : null }
      </div>
    </div>
  );
}

export default App;
