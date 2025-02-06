import { useState, useEffect } from "react";
import openSourcererPng from "./os-screenshot.png";

import "./App.css";

function App() {
  const [expanded, setExpanded] = useState<"game" | "links" | null>(null);

  const toggle = (section: typeof expanded) => {
    if (expanded === section) {
      setExpanded(null);
    } else {
      setExpanded(section);
    }
  };

  return (
    <>
      <div className={`headline ${expanded ? "small" : "fullsize"}`}>
        <h1>Robert Brownstein</h1>
        <h2>( Software Engineer )</h2>
      </div>
      <div className="content">
        <a
          className="link-large link-resume"
          href="Robert%20Brownstein%20Resume.pdf"
          target="_blank"
        >
          <div className="preview" />
          <div className="label">Resume</div>
        </a>
        <div
          className={`link-large link-game ${
            expanded === "game" ? "expanded" : "minimized"
          }`}
        >
          <a className="preview" onClick={() => toggle("game")} />
          <div className="link-content">
            <img alt="Screenshot from Open Sourcerer" src={openSourcererPng} />
            <p>
              Open Sourcerer, developed by Gnarled Helix LLC, is a 2D platformer
              in which the player learns programming to customize their spells.
            </p>
            <p>
              I deploy a playable build{" "}
              <a href="https://brownstein.github.io/osts-v3/">here</a> from time
              to time.
            </p>
          </div>
          <a className="label" onClick={() => toggle("game")}>
            Video Game
          </a>
        </div>
        <div
          className={`link-large link-links ${
            expanded === "links" ? "expanded" : "minimized"
          }`}
        >
          <a className="preview" onClick={() => toggle("links")} />
          <div className="link-content">
            <ul>
              <li>
                <a href="https://brownstein.github.io/three-aseprite/">
                  <div className="link-headline">Three-Asperite</div>
                  <div className="link-description">
                    (open source rendering package)
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <a className="label" onClick={() => toggle("links")}>
            Links
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
