import { useState } from "react";
import openSourcererImage from "./os-screenshot.jpg";
import rbTransparentImage from "./rb-transparent-bg.png";

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
    <div className="wrapper">
      <div className={`headline ${expanded ? "small" : "fullsize"}`}>
        <img
          className="header-img"
          src={rbTransparentImage}
          alt="Pixel art image of myself holding a cat."
        />
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
            <img alt="Open Sourcerer logo" src={openSourcererImage} />
            <p>
              Open Sourcerer, developed by Gnarled Helix LLC, is a 2D platformer
              in which the player learns JavaScript to control their spells.
            </p>
            <p>
              I've been working on this game for a while with a team of 10, and
              am excited to be launching in Q3 of 2026.
            </p>
            <p>
              You can find more information{" "}
              <a href="https://store.steampowered.com/app/4561260/Open_Sourcerer/?beta=0">
                on Steam
              </a>
              .
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
                <a
                  className="link-headline"
                  href="https://brownstein.github.io/protosprite"
                >
                  Protosprite
                </a>
                <p className="link-description">
                  Protosprite is an open-source format and rendering package for
                  sprites, the basic building block of renderable content in 2D
                  games. It uses a compact, protobuf-based binary encoding to
                  compress exports from the popular editing tool "Aseprite", and
                  provides a three.js renderer.
                </p>
              </li>
              <li>
                <a className="link-headline" href="https://open-sourcerer.com">
                  Open Sourcerer Website
                </a>
                <p className="link-description">
                  Learn more about my game and the team behind it.
                </p>
              </li>
            </ul>
          </div>
          <a className="label" onClick={() => toggle("links")}>
            Links
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
