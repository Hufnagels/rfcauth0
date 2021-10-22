import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback
} from "react";
import * as d3 from "d3";

const Line = ({ thickness, points }) => {
  const line = useMemo(() => {
    return d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveBasisOpen);
  }, []);

  return (
    <path
      d={line(points)}
      style={{
        stroke: "black",
        strokeWidth: thickness,
        strokeLinejoin: "round",
        strokeLinecap: "round",
        fill: "none"
      }}
    />
  );
};

export const FreeDraw = ({ x, y, width, height, thickness }) => {
  const [drawing, setDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState({ thickness, points: [] });
  const [lines, setLines] = useState([]);

  const drawingAreaRef = useRef();

  const mouseMove = useCallback(
    function (event) {
      const [x, y] = d3.pointer(event);
      if (drawing) {
        setCurrentLine((line) => ({
          ...line,
          points: [...line.points, { x, y }]
        }));
      }
    },
    [drawing]
  );

  function enableDrawing() {
    setCurrentLine({ thickness, points: [] });
    setDrawing(true);
  }

  function disableDrawing() {
    setDrawing(false);
    setLines((lines) => [...lines, currentLine]);
  }

  useEffect(() => {
    const area = d3.select(drawingAreaRef.current);
    area.on("mousemove", mouseMove);
    return () => area.on("mousemove", null);
  }, [mouseMove]);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      ref={drawingAreaRef}
      onMouseDown={enableDrawing}
      onMouseUp={disableDrawing}
    >
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        style={{ fill: "transparent" }}
      />
      <g className='freedraw'>
        {lines.map((line, i) => (
          <Line thickness={line.thickness} points={line.points} key={i} />
        ))}
        <Line thickness={currentLine.thickness} points={currentLine.points} />
      </g>
    </g>
  );
};
