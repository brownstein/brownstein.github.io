import cx from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import openSourcererImage from "./os-screenshot.jpg";
import tauricImage from "./tauric-screenshot.jpg";
import rbTransparentImage from "./rb-transparent-bg.png";

import "./App.css";

type Section = "about" | "game" | "links";

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState<Section | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const about = aboutRef.current;
    const game = gameRef.current;
    const links = linksRef.current;

    if (!wrapper || !about || !game || !links) return;

    const ratios = new Map<Section, number>();

    const updateExpanded = () => {
      let bestSection: Section | null = null;
      let bestSectionRatio = 0;
      for (const [section, ratio] of ratios) {
        if (ratio >= bestSectionRatio) {
          bestSection = section;
          bestSectionRatio = ratio;
        }
      }
      setExpanded(bestSection);
    };

    const monitor = (section: Section, el: HTMLDivElement) => {
      const onUpdate: IntersectionObserverCallback = (entries) => {
        for (const entry of entries) {
          if (entry.target !== el) continue;
          ratios.set(section, entry.intersectionRatio);
          updateExpanded();
        }
      };
      const observer = new IntersectionObserver(onUpdate, {
        root: wrapper,
        rootMargin: "0px",
        threshold: [0, 0.1, 0.15, 0.25, 0.5, 1],
      });
      observer.observe(el);
      return () => {
        observer.disconnect();
      };
    };

    const cleanupFuncs = [
      monitor("about", about),
      monitor("game", game),
      monitor("links", links),
    ];

    const onScroll = () => {
      const { scrollTop } = wrapper;
      setScrolled(scrollTop > 0);
      // Unitless on purpose — App.css derives both the length and the rotation
      // angle from this by multiplication. See the note by @property there.
      wrapper.style.setProperty("--page-scroll", `${scrollTop}`);
    };

    wrapper.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      for (const func of cleanupFuncs) func();
      wrapper.removeEventListener("scroll", onScroll);
    };
  }, []);

  const selectSection = useCallback((section: Section) => {
    const wrapperEl = wrapperRef.current;
    let sectionEl: HTMLDivElement | null = null;
    switch (section) {
      case "about":
        sectionEl = aboutRef.current;
        break;
      case "game":
        sectionEl = gameRef.current;
        break;
      case "links":
        sectionEl = linksRef.current;
        break;
      default:
        break;
    }
    if (!wrapperEl || !sectionEl) return;
    const sectionRect = sectionEl.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    wrapperEl.scrollTo({
      top: sectionTop,
    });
  }, []);

  return (
    <div className={cx("wrapper", { scrolled })} ref={wrapperRef}>
      <header>
        <div className="headline">
          <img
            className="header-img"
            src={rbTransparentImage}
            alt="Pixel art image of myself holding a cat."
          />
          <div className="headings">
            <h1>Robert Brownstein</h1>
            <h2>Software Engineer</h2>
          </div>
        </div>
        <div className="sections">
          <div
            className={cx("section-link", { expanded: expanded === "about" })}
          ></div>
        </div>
      </header>
      <main>
        <div
          className={cx("section", expanded === "about" ? "current" : null)}
          ref={aboutRef}
        >
          <p>
            I'm a passionate full stack engineer with a knack for performant UX
            in DOM-centric environments (browsers / Electron). I focus on the
            TypeScript ecosystem, with heavy experience on the React, Three.js,
            and Express side. I also work in C++ and Python.
          </p>
          <p>
            Recently at <b>Boston Dynamics</b>, I worked primarily on Orbit, a
            web-based solution that controls Spot's behavior and collects sensor
            data to allow customers to set up recurring inspections to monitor
            industrial assets.
          </p>
          <p>
            These days I run{" "}
            <a href="https://gnarledhelix.com/">Gnarled Helix</a>, a small
            remote-first game studio, along with{" "}
            <a href="https://gnarledhelix.com/team/">
              a talented core team and their direct reports
            </a>
            .
          </p>
          <div className="resume-wrapper">
            <a
              className="link-large link-resume"
              href="Robert%20Brownstein%20Resume.pdf"
              target="_blank"
            >
              <div className="preview" />
              <div className="label">Here's my resume.</div>
            </a>
          </div>
        </div>
        <div
          className={cx("section", expanded === "game" ? "current" : null)}
          ref={gameRef}
        >
          <p>I recently open-sourced a failed game after 5+ years of work.</p>
          <div className="screenshot-wrapper">
            <img
              className="screenshot"
              alt="A screenshot of my video game, Open Sourcerer."
              src={openSourcererImage}
            />
          </div>
          <p>
            <a href="https://open-sourcerer.com">Open Sourcerer</a> was intended
            as an educational 2D platformer where players learned JavaScript and
            use it to solve puzzles and defeat enemies. We built a product on
            the untested assumption that we were capable of teaching CompSci
            without direct human interaction. That, and a series of other
            mistakes, lead to a series of great learning experiences that I'd be
            happy to tell you about over a beer.
          </p>
          <p>
            You can find it on Steam{" "}
            <a href="https://store.steampowered.com/app/4561260/Open_Sourcerer/">
              here.
            </a>
          </p>
          <p>
            We're also working on a different game with a different set of
            assumptions -
            <a href="https://gnarledhelix.com/factory-chess/">Factory Chess</a>{" "}
            is chess with factory / recycling mechanids. Captured pieces leave
            scrap where they died, and you lay belt to haul it back into new
            pieces. It's a prototype and we're still testing it — you can{" "}
            <a href="https://factorychess.com/">play it in your browser</a> and
            tell us what breaks.
          </p>
          <p>
            <a href="https://gnarledhelix.com/tauric-studio/">Tauric Studio</a>{" "}
            is the tool side of the studio: a 2D level editor that runs in the
            browser, where artists and designers open the same level and see
            each other's edits as they happen, with no export and re-import in
            between. It's live at{" "}
            <a href="https://tauric.tools/">tauric.tools</a>.
          </p>
        </div>
        <div
          className={cx("section", expanded === "links" ? "current" : null)}
          ref={linksRef}
        >
          <p>
            Like many engineers, I rely on open source software and try to
            contribute back to the ecosystem.
          </p>
          <p>
            <a href="https://brownstein.github.io/protosprite">Protosprite</a>{" "}
            is one such contribution, which provides a compact protobuf-based
            binary encoding format for 2D sprites and a related rendering
            package for Three.js. The{" "}
            <a href="https://github.com/brownstein/protosprite">
              source is on GitHub
            </a>
            , and the renderer ships as{" "}
            <a href="https://www.npmjs.com/package/protosprite-three">
              protosprite-three
            </a>
            .
          </p>
          <p>
            <a href="https://www.npmjs.com/package/three-aseprite">
              three-aseprite
            </a>{" "}
            is the other package I maintain. It draws Aseprite's own JSON sprite
            sheets as Three.js meshes, so an animation goes from the editor into
            a scene without a conversion step in between. There's{" "}
            <a href="https://brownstein.github.io/three-aseprite">a demo</a>.
            Both packages are MIT.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
