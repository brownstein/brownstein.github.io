import debounce from 'debounce';
import { useState, useEffect } from 'react';
import { Background } from './Background';
import { Bird } from './Birdify';
import './App.css';
import resumeThumbnail from './resume-thumbnail.png';
import osThumbnail from './open-sourcerer.png';

const MOBILE_CUTOFF = 900;

function App() {
  const [birdActive, setBirdActive] = useState<boolean>(false);
  const [mobile, setMobile] = useState<boolean>(window.innerWidth < MOBILE_CUTOFF);
  const [bgColor, setBgColor] = useState<[number, number, number]>([0.9, 0.9, 0.9]);
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
      setTimeout(pulse, 10000);
    }
    setTimeout(pulse, 1000);
    const debouncedResize = debounce(resize, 200);
    window.addEventListener('resize', debouncedResize);
    return () => {
      active = false;
      window.removeEventListener('resize', debouncedResize);
    };
  }, [setBgColor]);
  useEffect(() => {
    function activateBird() {
      if (!birdActive) {
        setBirdActive(true);
      }
    }
    const birdTimeout = setTimeout(activateBird, 1500);
    return () => {
      clearTimeout(birdTimeout);
    };
  }, [setBirdActive, birdActive]);
  const colorTheme = (bgColor[0] + bgColor[1] * 2 + bgColor[2] * 0.5 > 1.5)
    ? 'light'
    : 'dark';
  const tile1 = (
    <div className='tile borderless'>
      <h2>Full Stack Software Engineer</h2>
    </div>
  );
  const tile2 = (
    <div className='tile borderless'>
      <h3>I'm fluent in TypeScript, Python, WebGL, React, Node.js, AWS, Docker, SQL, and NoSQL. I'm passionate about realtime spatial problems and great UX.</h3>
    </div>
  );
  const tile3 = (
    <div className='tile borderless'>
      <h3>Employment</h3>
      <ul>
        <li>2019 - 2022: Better ( IC )</li>
        <li>2016 - 2019: Social Tables ( IC / EM )</li>
        <li>Founded Goodapuss LLC in 2021</li>
      </ul>
      <h3>Open Source Projects</h3>
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
        <h1>Robert Brownstein { mobile ? null : <Bird active={birdActive}/>}</h1>
        { mobile ? <div className='row'>{tile1}{tile2}</div> : null }
        { mobile ? (
          <div className='bird-row'>
            <Bird active={birdActive}>{'{}'}</Bird>
            <Bird active={birdActive}>{'()'}</Bird>
            <Bird active={birdActive}>{'[]'}</Bird>
          </div>
        ) : null }
        <div className='row'>
          <a className='tile big resume' href="Robert%20Brownstein%20Resume.pdf" target='_blank'>
            <img src={resumeThumbnail} />
            <span className='label'>open resume</span>
          </a>
          <a className='tile big' href='https://brownstein.github.io/open-sourcerer-ts' target='_blank'>
            <img src={osThumbnail} />
            <div className='description'>
              Open Sourcerer is a 2D platformer in which the player learns JavaScript to defeat enemies and solve puzzles. Fully source-mapped, it serves as a perfect demo of my frontend skillset. Designed for desktop browsers.
            </div>
            <span className='label'>play side project</span>
          </a>
        </div>
        { mobile ? null : <div className='row'>{tile1}{tile2}{tile3}</div> }
        { mobile ? <div className='row'>{tile3}</div> : null }
      </div>
    </div>
  );
}

export default App;
