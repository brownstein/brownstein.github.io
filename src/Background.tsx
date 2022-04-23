import debounce from 'debounce';
import EventEmitter from 'events';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import Delaunator from 'delaunator';

export interface IBackgroundProps {
  color?: [number, number, number];
  pointCount?: number;
}

interface IPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: [number, number, number];
  changeCounter: number;
}

// utils borrowed from https://mapbox.github.io/delaunator
function edgesOfTriangle(t: number) { return [3 * t, 3 * t + 1, 3 * t + 2]; }
function pointsOfTriangle(delaunay: Delaunator<number[]>, t: number) {
  return edgesOfTriangle(t).map(e => delaunay.triangles[e]);
}
function forEachTriangle<T>(points: T[], delaunay: Delaunator<number[]>, callback: (index: number, pts: T[]) => void) {
  for (let t = 0; t < delaunay.triangles.length / 3; t++) {
    callback(t, pointsOfTriangle(delaunay, t).map(p => points[p]));
  }
}

export const Background: FC<IBackgroundProps> = ({
  color = [1, 1, 1],
  pointCount = 1000
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorChangeEmitter = useMemo<EventEmitter>(() => new EventEmitter(), []);
  const colorRef = useRef<[number, number, number]>(color);
  const [canvasSize, setCanvasSize] = useState<[number, number]>([
    Math.floor(window.innerWidth),
    Math.floor(window.innerHeight)
  ]);

  useEffect(() => {
    // initialize webgl
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      return;
    }
    const program = gl.createProgram();
    if (!program) {
      return;
    }
    const vtxShaderSrc = (document.getElementById("2d-vertex-shader") as HTMLScriptElement).text;
    const fragShaderSrc = (document.getElementById("2d-fragment-shader") as HTMLScriptElement).text;
    const vtxShader = gl.createShader(gl.VERTEX_SHADER);
  	const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vtxShader || !fragShader) {
      return;
    }
  	gl.shaderSource(vtxShader, vtxShaderSrc);
  	gl.shaderSource(fragShader, fragShaderSrc);
    gl.compileShader(vtxShader);
  	gl.compileShader(fragShader);
  	gl.attachShader(program, vtxShader);
  	gl.attachShader(program, fragShader);
  	gl.linkProgram(program);
  	gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());

    // bind attributes
    const aPositionLoc = gl.getAttribLocation(program, "a_position");
  	const aColorLoc = gl.getAttribLocation(program, "a_color");
  	gl.enableVertexAttribArray(aPositionLoc);
  	gl.enableVertexAttribArray(aColorLoc);
  	gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, true, 24, 0);
  	gl.vertexAttribPointer(aColorLoc, 4, gl.FLOAT, true, 24, 8);

    // set up state
    let running = true;
    let lastUpdatedAt = new Date().getTime();
    let points: IPoint[] = [];
    let currentColor = [...color];
    let changeCounter = 0;
    let changeProgress = 0;

    function seedPoints() {
      while (points.length < pointCount) {
        points.push({
          x: Math.random() * 4 - 2,
          y: Math.random() * 4 - 2,
          vx: 0,
          vy: 0,
          color: [
            Math.min(1, currentColor[0] + Math.random() * 0.1),
            Math.min(1, currentColor[1] + Math.random() * 0.1),
            Math.min(1, currentColor[2] + Math.random() * 0.1)
          ],
          changeCounter
        });
      }
    }

    function movePoints(): boolean {
      let anythingMoving = false;
      points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.9;
        p.vy *= 0.9;
        if (Math.abs(p.vx) + Math.abs(p.vy) < 0.0001) {
          p.vx = 0;
          p.vy = 0;
        }
        anythingMoving = anythingMoving || !!(p.vx || p.vy);
      });
      return anythingMoving;
    }

    function recolorAndTossPoints() {
      points.forEach(p => {
        if (p.changeCounter >= changeCounter) {
          return;
        }
        const pDistance = Math.sqrt(p.x * p.x + p.y * p.y);
        if (pDistance <= changeProgress) {
          p.changeCounter++;
          p.color = [...currentColor] as [number, number, number];
          p.color[0] += Math.random() * 0.1;
          p.color[1] += Math.random() * 0.1;
          p.color[2] += Math.random() * 0.1;
          p.vx = (Math.random() - 0.5) * 0.02;
          p.vy = (Math.random() - 0.5) * 0.02;
        }
      });
    }

    colorChangeEmitter.on('changeColor', (color: [number, number, number]) => {
      lastUpdatedAt = new Date().getTime();
      currentColor = color;
      changeCounter++;
      changeProgress = 0;
    });

    function doFrame() {
      if (!running || !gl) {
        return;
      }

      const now = new Date().getTime();
      const hasUpdates = (now - lastUpdatedAt) < 1000;

      if (!hasUpdates) {
        requestAnimationFrame(doFrame);
        return;
      }

      // animate
      changeProgress += 0.05;
      if (movePoints()) {
        lastUpdatedAt = now;
      };
      recolorAndTossPoints();

      // find triangles in our point set
      const rawPointsArr: number[] = [];
      points.forEach(p => rawPointsArr.push(p.x, p.y));
      const delaunay = new Delaunator(rawPointsArr);
      const triangleBuff: number[] = [];
      let triangleBuffLen = 0;
      forEachTriangle<IPoint>(points, delaunay, (_, pts) => {
        const color = pts[0].color;
        pts.forEach(p => triangleBuff.push(
          p.x,
          p.y,
          color[0],
          color[1],
          color[2],
          1
        ));
        triangleBuffLen += 3;
      });

      // render those triangles
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleBuff), gl.DYNAMIC_DRAW);
      gl.drawArrays(gl.TRIANGLES, 0, triangleBuffLen);

      // kick off next frame
      requestAnimationFrame(doFrame);
    }

    function resize() {
      if (!canvas) {
        return;
      }
      // there's actually a bug somewhere here; expanding the window leaves
      // a white space to the right; pausing resolution to focus on core features
      lastUpdatedAt = new Date().getTime();
      const width = Math.floor(window.innerWidth);
      const height = Math.floor(window.innerHeight);
      gl?.viewport(0, 0, width, height);
      setCanvasSize([width, height]);
    }

    const debouncedResize = debounce(resize, 100);

    // go
    seedPoints();
    doFrame();

    window.addEventListener('resize', debouncedResize);

    return () => {
      running = false;
      window.removeEventListener('resize', debouncedResize);
      // TODO: cleanup code for WebGL context
    };
  }, [colorChangeEmitter, colorRef, pointCount]);

  // we communcate with the rendering loop using an event emitter so that
  // the initializer runs only once but we can still handle prop updates
  if (colorRef.current !== color) {
    colorRef.current = color;
    colorChangeEmitter.emit('changeColor', color);
  }

  return <canvas className='background' ref={canvasRef} width={`${canvasSize[0]}px`} height={`${canvasSize[1]}px`} />;
};
