import React from 'react'

const Node = () => {
  return (
    <g className="node" transform="translate(400,300), scale(1)">
      <circle className="nodeCircle" r="4.5" /* style="fill: lightsteelblue;" */></circle>
      <text x="10" dy=".35em" className="nodeText" textAnchor="start" /* style="fill-opacity: 1;" */>Visualization</text>
      <circle className="ghostCircle" r="30" opacity="0.2" pointerEvents="mouseover" /* style="fill: red;" */></circle>
    </g>
  )
}

export default Node
