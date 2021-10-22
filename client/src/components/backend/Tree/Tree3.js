import React from 'react';
import * as d3 from 'd3';
import uuid from 'react-uuid'
// import {flextree} from 'd3-flextree' 

// Material
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Box,
  Paper,
  Snackbar,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';

// Custom
import useD3hook from '../../../features/hooks/useD3hook'
import './style.css';
import { 
  SocketContext,
} from '../../../features/context/socketcontext_mindmap';
import AsyncLocalStorage from '@createnextapp/async-local-storage'


const Tree3 = (ddata) => {
  // Socket
  const socket = React.useContext(SocketContext);

  // States - socket
  const [isConnectedToSocket, setIsConnectedToSocket] = React.useState(socket.connected || false)
  const [connectedToRoom, setConnectedToRoom] = React.useState(false)
  const [connection, setConnection] = React.useState({
    name: 'Varkonyi', 
    email: 'email@email.com', 
    room: 'MindmapRoom',
    socket: {}, //socket,
    socketid: '', //socket.id,
  });

  // SVG relevant settings
  const [data, setData] = React.useState([])
  const [rootData, setRootData] = React.useState()
  const [width, setWidth] = React.useState(1192)
  const [height, setHeight] = React.useState(767)
  const margin = ({top: 10, right: 120, bottom: 10, left: 40})
  
  let treemap = d3.tree().nodeSize([40,100])

  //const [treemap, setTreemap] = React.useState()
  let root//, treemap
  //let x0 = Infinity;
  //let x1 = -x0;
  let settings = {
    margins: 30,
    i: 0,
    duration: 250,
    prevscale: 1,
    toolbox : {
      width: 150,
      height: 50,
    },
    colors: {
      nodeStroke:'rgb(116, 167, 211)',
      nodeFill:'#fff',
      nodeFill2:'lightsteelblue',
      nodeHighlight:'rgb(233 24 72)',
      linkStroke:'#c3c3c3',
      linkFill:'',
      linkHighlight:'rgb(233 24 72)',
      nodeTextStroke:'black',
      nodeTextFill:'black',
    },
  }

  let baseSvg = null;
  let nodesGroup = null
  let linksGroup = null 
  let zoomer = null

  // Dialog, textupdate
  const [openDialog, setOpenDialog] = React.useState(false)

  // States - Snackbar
  const [currentZoom, setCurrentZoom] = React.useState(localStorage.getItem('whiteboard.zoom'))
  const [snackstate, setSnacktate] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });
  const { vertical, horizontal, open } = snackstate;
  const handleCloseSnack = () => {
    setSnacktate({ ...snackstate, open: false });
  };
  const action = (
      <Button color="secondary" size="small" onClick={ (e) => {
        e.preventDefault();
        setCurrentZoom(1);
        //canvasRef.current.zoomToPoint(new fabric.Point(canvasRef.current.width / 2, canvasRef.current.height / 2), 1.0);
        //canvasRef.current.setZoom(1);
      }}>Set to default</Button>
  );

  const [textLeft, setTextLeft] = React.useState(0)
  const [textTop, setTextTop] = React.useState(0)
  const [textNode,setTextNode] = React.useState('')
  const [textDisplay,setTextDisplay] = React.useState('none')
  const [value, setValue] = React.useState('')

  React.useEffect(() => {
console.log('Effect #1')
    const container = document.getElementById('treecontainer');
    let container_style = getComputedStyle(container);

    // set the groups
    nodesGroup = d3.select('.nodes') // #baseG
    linksGroup = d3.select('.links')
    baseSvg = d3.select('#baseSvg')
    zoomer = d3.select('#baseSvg')

    baseSvg.on('mouse:wheel', function(e) {
      console.error(e)
    })
    const onResize = () => {
      //let sketchWrapper_style = getComputedStyle(sketchWrapper);
      let width = parseInt(container_style.getPropertyValue('width') );
      let height = parseInt(container_style.getPropertyValue('height'));
      if(width !== 0 || height !== 0) {
        if (window.innerWidth-settings.margins < width){
          width = window.innerWidth-settings.margins
        }
        setWidth(width)
        setHeight(height)
      }
    }
    window.addEventListener('resize', onResize, false);
    onResize();
    
  })

  React.useEffect(() => {
console.log('Effect #2')
    if(width > 0 && height > 0){
      d3.select('#baseSvg').attr('width', width).attr('height',height)
      //d3.select('#baseRect').attr('width', width).attr('height',height)
    }
  }, [width, height])

  React.useEffect(()=>{
console.log('Effect #3')
    // zoomer
    //   .call(zoom)
    //   .transition()
    //   .duration(settings.duration)
    //   .call(zoom.transform, d3.zoomIdentity.scale(settings.prevscale)) //.translate(t.x,t.y).scale(t.k))
    //console.log('d3.zoomIdentity', d3.zoomIdentity.scale(settings.prevscale))
    setData(ddata.ddata)
  },[])

  React.useEffect(() => {
console.log('Effect #4')
    console.log('Socket effect', socket)
    setIsConnectedToSocket(socket.connected)
    initSocketConnection()
    socket.on('connect', () => {
      console.log('socket connected from Tree');
      setIsConnectedToSocket(true)
      // setMessage('socket connected')
      // setActiontype('success')
      
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected from Tree');
      setIsConnectedToSocket(false)
      setConnectedToRoom(false)
      // setMessage('socket disconnected')
      // setActiontype('error')
    })
  },[socket])

  // Functions: Socket
  const initSocketConnection = React.useCallback(() => {
console.log('initSocketConnection')
    socket.emit('joinMindmapdRoom', {
      name: 'Varkonyi', 
      email: 'email@email.com', 
      room: 'MindmapRoom',
    }, (error) => {
      if(error) {
        alert(error);
      }
    });
    socket.on('welcome-message', (response) => {
      setConnection({
        ...connection, 
        socketid: response.userId,
      })
      setIsConnectedToSocket(true)
      setConnectedToRoom(true)
console.log('response', response)
console.log('response connection', connection)
console.log('connectedToRoom', connectedToRoom)
    })
    
  },[])

  // Dialog handling
  const handleClose = () => {
    setOpenDialog(false)
  }

  // TREE HELPER FUNCTIONS
  // Zoom helper
  const zoom = d3.zoom().on("zoom", e => {
// console.log('zoom')
// console.log(e)
    // let t = e.transform;
    let trans;
    nodesGroup.attr("transform", (trans = e.transform));
    linksGroup.attr("transform", (trans = e.transform));
  });

  // center node 
  const centerNode = (source, scale) => {
// console.log('source')
// console.log(source)
    let t = d3.zoomTransform(baseSvg.node()) //d3.zoomTransform(baseSvg.node());
    let x = -source.y0;
    let y = -source.x0;
    //scale = t.k
    x = x * scale + width / 2;
    y = y * scale + height / 2 ;

    nodesGroup.transition()
        .duration(settings.duration)
        .attr("transform", "translate(" + x + "," + y + "), scale(" + scale + ")");
    linksGroup.transition()
        .duration(settings.duration)
        .attr("transform", "translate(" + x + "," + y + "), scale(" + scale + ")");
    zoomer
      .transition()
      .duration(settings.duration)
      .call(zoom.transform, d3.zoomIdentity.translate(x,y).scale(scale))
  }

  // Events
  const clickEvent = (event, d) => {
// console.log(d)
    if (d.children) {
      d._children = d.children;
      d.children = null;
      let transf = d3.zoomTransform(d)
      settings.prevscale = transf.k
    } else {
      d.children = d._children;
      d._children = null;
      settings.prevscale = 1.7
    }
// console.log('click')
// console.log(d)
// //settings.prevscale = d3.zoomTransform(d)
// console.log(d3.zoomTransform(d))

    if(!(typeof d.children === 'undefined')) update(d)
    highlightPath(d)
    centerNode(d, settings.prevscale);
   
  }
  // remove the editbox
  const mouseOutEvent = (event, d) => {
    d3.select(event.target)
      .style('stroke', settings.colors.nodeTextStroke)
    d3.selectAll('.toolbox').remove()
  }
  // add editbox
  const mouseOverEvent = (event, d) => {
//console.log(event, d)
    d3.select(event.target)
      .style('stroke', 'red')
    return
    d3.select(event.target.parentElement).append('rect')
      .attr('class','toolbox')
      .attr('width','100')
      .attr('height', '30')
      .attr('y', '-15')
      .attr('x', function(d) {
        return d.children || d._children ? -110 : 10;
      })
      .attr('strokeWidth', '2')
      .attr('stroke','black')
      .attr('fill','none')
//console.log(event.target.previousElementSibling.classList.toggle("visible"))
  }

  const addChild = (event, d, side) => {
    //alert(side)
    var newNode = {
      type: 'node-type',
      name: 'new leaf',
      children: [],

    };
    //Creates a Node from newNode object using d3.hierarchy(.)
    var node = d3.hierarchy(newNode);
  
    //later added some properties to Node like child,parent,depth
    node.depth = d.depth + 1; 
    node.height = d.height - 1;
    node.parent = d; 
    node.id = Date.now();
    node.data.direction = side
    node.data.dierectionSW = side === 'left' ? -1 : 1
  
    //d is a node, to which we are adding the new node as a child
    // check if node closed and has _children
    if(d._children){
//console.log('closed and has children')
      d.children = d._children;
      d._children = null;
    }
    //If no child array, create an empty array
    if(!d.children){
      d.children = [];
      d.data.children = [];
    }
  
    //Push it to parent.children array  
    d.children.push(node);
    d.data.children.push(node.data);
  
    //Update tree
    update(d);
    highlightPath(node)
    centerNode(node.parent, 1.3)
  }
  const removeChild = (event, d) => {
    if(!d.parent) return
//console.log(d)
    if(!d.children){
      d.children = [];
      d.data.children = [];
    }
    var childrens = [];
    if(d.parent.children.length !== 1) {
      d.parent.children.forEach(function(child){
        if (child.id !== d.id){
          childrens.push(child);
        }
      })
      d.parent.children = childrens;
    } else {
      d.parent.children = null
    }
    update(d.parent)
  }

  // Collapse the node and all it's children
  const collapse = (d) => {
    if(d.children) {
      d._children = d.children
      d._children.forEach(collapse)
      d.children = null
    }
    
  }
  const highlightPath = (d) => {
    d3.selectAll(".node").style("stroke", settings.colors.nodeStroke)
    d3.selectAll(".link").style("stroke", settings.colors.linkStroke)
    d3.selectAll(".circle").style("stroke", settings.colors.linkStroke)
    while (d.parent) {
      d3.select('#node_circle-'+d.id).style("stroke", settings.colors.nodeHighlight)
      if (d.parent !== "null") {
        d3.select("#node_path-"+d.parent.id + "-" + d.id).style("stroke", settings.colors.linkHighlight)
      }
      d = d.parent;
    }
  }

  // Text handling
  // wrap long text
  const wrap = (text, width) => {
    text.each(function (d) { // DIFF add param d
//console.log(d)
      var text = d3.select(this),
          // DIFF: use datum to get name, instead of element text
          words = d.data.name.split(/\s+/).reverse(), 
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y")- settings.toolbox.height/3,
          dy = parseFloat(text.attr("dy")),
          tspan = text.text('').append("tspan")
                      .attr("x", -width/2)
                      .attr("y", y)
                      .attr("dy", dy + "rem");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
                      .attr("x", -width/2)
                      .attr("y", y)
                      .attr("dy", ++lineNumber * lineHeight + dy + "rem")
                      .text(word);
        }
      }  
      // DIFF: store the height via the datum, d
      let h = (20 * (lineNumber + 1)) < settings.toolbox.height ? settings.toolbox.height : (20 * (lineNumber + 1))
      d.height = h;
//console.log(d3.selectAll(this.parentNode))
      d3.select(this.parentNode.children[0]).attr('height', h);
    });
  }
  
  const editable = (event, d) => {
//console.log('editable', event, d) 
    setTextNode(d)
    setValue(d.data.name)
    setTextLeft(event.clientX-100)
    setTextTop(event.clientY-28) 
    setTextDisplay('block')
  }
    
  const updateContent = (event) => {
// console.log('updateContent')
// console.log('event',event)
// console.log('textNode',textNode)
    let state = textNode
    state.data.name = event.target.value
    setValue(event.target.value)
    setTextNode(state);
// console.log('event.target.value', event.target.value)
// console.log('state', state)
    d3.select('#node_text-'+state.id).text(event.target.value)
//console.log('d3.select(state.id)', root, d3.select('#'+state.id).text(event.target.value))
    
    update(textNode) //, d3.select('svg'))
  }

  // calculate tree nodes
  const update = (source, svg) => {
    settings.i = 0;
    if(typeof rootData !== 'undefined' && typeof root === 'undefined') {
      root = rootData
    }
    setRootData(root)
// console.log(rootData, root)
    // Assigns the x and y position for the nodes
    var treeData = treemap(root)

//console.log(treeData)
    // Compute the new tree layout.
    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);
    // circle version


    // Normalize for fixed-depth.
    nodes.forEach(function(d){ 
      d.y = d.depth * 180
      if(d.depth > 0 && d.data.dierectionSW) {
        d.x = d.data.dierectionSW * d.x
        d.y = d.data.dierectionSW * d.y
      }
    });


    // ****************** Nodes section ***************************
    // Update the nodes...
    const node = nodesGroup
      .selectAll('g.node') // svg.select('.nodes').selectAll('g.node')
      .data(nodes, d => d.id = d.id ||'node-' + uuid())
/*
      .join(
        enter => {
          console.log('enter',enter)
          enter
            .append('g')
            .attr('id', d => d.id)
            //.attr("transform", d => `translate(${source.y0},${source.x0})`)
            .attr("transform", d => `translate(${d.y},${d.x})`)
            .attr('class', 'node')
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1)
            .append('circle')
            .attr('class', 'circle')
            .attr('r', 6)
            .style('stroke', settings.colors.nodeStroke)
            .attr('id', (d) => 'node_circle-' + d.id )
            .style("fill", function(d) {
              return d._children ? settings.colors.nodeFill2 : settings.colors.nodeFill
            })
            .on('click', (event,d) => clickEvent(event,d))
          enter
            .append('text')
            .attr('class', 'title')
            .attr("transform", d => `translate(${d.y},${d.x})`)
            .attr('id', (d) => 'node_text-' + d.id )
            .attr("dy", function(d) { return d.children || d._children ? '-.7rem' : '0.2rem'; })
            .attr("x", function(d) { return d.children || d._children ? 0 : (d.data.direction === 'right' ? 13 : -13); })
            .attr("text-anchor", function(d) { return d.children || d._children ? "middle" : (d.data.direction === 'right' ? "start" : "end"); })
            .text(d => d.data.name )
            .attr("stroke-linejoin", "round")
            .attr("stroke", "black")

        },
        update => {
console.log('update', update)
update
.transition()
.attr("transform", d => `translate(${d.y},${d.x})`)
.attr("fill-opacity", 1)
.attr("stroke-opacity", 1)
.select('circle')
.attr('r', 6)
.style("fill", function(d) {
  return d._children ? settings.colors.nodeFill2 : settings.colors.nodeFill
})

        },
        exit => {
console.log('exit', exit)
          
          
        }
      )
*/
    
    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append('g')
      .attr('id', d => d.id)
      .attr("transform", d => `translate(${source.y0},${source.x0})`)
      .attr('class', 'node')
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      // .on("click", (event, d) => {
      //   clickEvent(event, d)
      // })
      // .on("click", (event, d) => {
      //   d.children = d.children ? null : d._children;
      //   update(d)
      //   highlightPath(d)
      //   centerNode(d,1.7)
      // })

    // Add Circle for the nodes
console.log(nodeEnter)
    nodeEnter.append('circle')
      .attr('class', 'circle')
      .attr('r', 6)
      .style('stroke', settings.colors.nodeStroke)
      .attr('id', (d) => 'node_circle-' + d.id )
      .style("fill", function(d) {
        return d._children ? settings.colors.nodeFill2 : settings.colors.nodeFill
      })
      .on('click', (event,d) => clickEvent(event,d)) 

    // Add labels for the nodes
    nodeEnter.append('text')
      .attr('class', 'title')
      .attr('id', (d) => 'node_text-' + d.id )
      .attr("dy", function(d) { return d.children || d._children ? '-.7rem' : '0.2rem'; })
      .attr("x", function(d) { return d.children || d._children ? 0 : (d.data.direction === 'right' ? 13 : -13); })
      .attr("text-anchor", function(d) { return d.children || d._children ? "middle" : (d.data.direction === 'right' ? "start" : "end"); })
      .text(d => d.data.name )
      .attr("stroke-linejoin", "round")
      .attr("stroke", "white")
      .on("mouseover", mouseOverEvent)
      .on("mouseout", mouseOutEvent)
      .on('click', (event,d) => editable(event,d, 'title'))
      //.clone(true).lower()
      
    // UPDATE
    const nodeUpdate = node.merge(nodeEnter).transition()
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1);

    // Transition to the proper position for the node
    // nodeUpdate.transition()
    //   .duration(settings.duration)
    //   .attr("transform", d => `translate(${d.y},${d.x})`)

    // // Update the node attributes and style
    // nodeUpdate.select('circle')
    //   .attr('r', 6)
    //   .style("fill", function(d) {
    //     return d._children ? settings.colors.nodeFill2 : settings.colors.nodeFill
    //   })
    //   .attr('cursor', 'pointer');

    // Remove any exiting nodes
    const nodeExit = node.exit().transition().remove()
      .duration(settings.duration)
      .attr("transform", d => `translate(${source.y},${source.x})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);

    // // On exit reduce the node circles size to 0
    // nodeExit.select('circle')
    //   .attr('r', 1e-6)
    //   .duration(settings.duration)

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
      .style('fill-opacity', 1e-6)
      .attr("stroke-opacity", 0)
      .duration(settings.duration)

    //wrap(d3.selectAll('text'), settings.toolbox.width-20)
    // ****************** links section ***************************

    // Update the links...
    const link = linksGroup.selectAll('path.link') // svg.select('.links').selectAll('path.link')
      .data(links, function(d) { return d.id || (d.id = settings.i++) });

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append('path')
      .attr("class", "link")
      .attr("id", function(d){ return ("node_path-"  + d.parent.id + "-" + d.id) })
      .attr('d', function(d){
        const o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

    // UPDATE
    link.merge(linkEnter)
      .transition()
      .duration(settings.duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

    // Remove any exiting links
    link.exit()
      .transition()
      .remove()
      .duration(settings.duration)
      .attr('d', function(d) {
        const o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
/**/
    // Store the old positions for transition.
    nodes.forEach(function(d){
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
//console.log(s,d)
      let path = `M ${s.y } ${s.x } 
                  C ${(s.y + d.y) / 2} ${s.x },
                  ${(s.y + d.y) / 2} ${d.x }, 
                  ${d.y} ${d.x }`
      return path
    }
/**/
/*
    // box version

    function diagonal(s, d) {
  //console.log(s,d)
      let path = `M ${s.y - settings.toolbox.width/2} ${s.x }
                  C ${(s.y + d.y) / 2} ${s.x},
                    ${(s.y + d.y) / 2} ${d.x},
                    ${d.y + settings.toolbox.width/2} ${ d.x}`
       return path
    }
    // Normalize for fixed-depth.
    nodes.forEach(function(d){ 
//console.log(d.height)
      d.y = d.depth * 180
      d.x = d.x*5.5  //* 5//(Math.floor(Math.random() * 5) + 1) //d.x *  5 //(d.depth < 3 ? 1 : 4)
    });
  
    // ****************** Nodes section ***************************
    // Update the nodes...
    var node = nodesGroup.selectAll('g.node') // svg.select('.nodes').selectAll('g.node')
      .data(nodes, function(d) {
        return d.id || (d.id = 'node-' + uuid()) 
      })//i++) }) //uuid()) });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      //.on('click', clickEvent)
      //.on("dblclick", dblClickEvent)
      //.on("mouseover", hoverEvent)
      //.on("mouseout", hoverEvent)

    nodeEnter.append("svg:rect")
      .attr('class', 'node')
      .attr("width", settings.toolbox.width)
      .attr("height", function (d) {
          return settings.toolbox.height;
      })
      .attr("y", -settings.toolbox.height/2)// DIFF: place the rect at y = 0
      .attr('x', function(d) {
        return d.children || d._children ? -settings.toolbox.width/2 : -settings.toolbox.width/2;
      })
      .attr("rx", 10)
      .attr("ry", 10)
      .attr('id', function(d){ 
        //console.log('circle id', d)
        return 'node_circle-' + d.id
      })
      .style('stroke', settings.colors.nodeStroke)
      .style('strokeWidth',1)
      .style("fill", function (d) {
        return d._children ? "transparent": "transparent" //"lightsteelblue" : "#c3c";
      })
      .on("click", clickEvent);

    nodeEnter.append("text")
      .attr('class', 'nodetext')
      .attr("x", function (d) {
        return d._children ? -settings.toolbox.width : settings.toolbox.width;
      })
      .attr('dx', 5)
      .attr("y", 5)
      .attr("dy", "-0.1rem")// DIFF: move text so that its top is at 0
      .attr("height", function(d){
        return d.height ? d.height = settings.toolbox.height : d.height = settings.toolbox.height
      })
      .text(function (d) {
        return d.name;
      })
      .on("mouseout", function(e,d){
        d.name = e.target.textContent
console.log(e,d)
      })
      .on("dblclick", function(d) { 

        var text = d3.select(this)//[0][0]
        console.log(text) //text.selectSubString(0,0)
      });
      
    wrap(d3.selectAll('text'), settings.toolbox.width-20);
  //console.log(nodes)

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition nodes to their new position.
    nodeUpdate.transition()
      .duration(settings.duration)
      .attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
      })
      .style("opacity", 1)

    // node.transition()
    //   .duration(settings.duration)
    //   .attr("transform", function (d) {
    //       return "translate(" + d.y + "," + d.x + ")";
    //   })
    //   .style("opacity", 1);
    var nodeExit = node.exit().transition()
      .duration(settings.duration)
      .attr("transform", function (d) {
  //console.log('node transition',d)
        return "translate(" + source.y + "," + source.x + ")";
      })
      .style("opacity", 1e-6)
      .remove();

    // Update the links…
    var link = linksGroup.selectAll("path.link")
      .data(links, function (d) {
        return d.id || (d.id = i++)
      });

    //linksGroup.selectAll("path.link")//.attr()

    // Enter any newlinks at the parent's previous position.
    var linkEnter = link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("id", function(d){ 
  //console.log('.link id', d)
        return ("node_path-"  + d.parent.id + "-" + d.id)
      })
      .attr("d", function (d) {
        // DIFF: provide source.height to diagonal
        var s = {x: source.x,y: source.y, height: source.height};
        var t = {x: d.x, y: d.y , height: d.height}
  //console.log('449:',s,t)
        return diagonal(s,t);
      })

      // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
      .duration(settings.duration)
      .attr('d', function(d){ 
        return diagonal(d, d.parent) 
      });

    // Transition links to their new position.
    // link.transition()
    //   .duration(settings.duration)
    //   //.attr("d", diagonal);

    // Transition back to the parent element position
    linkUpdate.transition()
      .duration(settings.duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

    // Transition exiting nodes to the parent's new position.
    var linkExit = link.exit().transition()
      .duration(settings.duration/10)
      .attr("d", function (d) {
        var s = {x: source.x0,y: source.y0,height: source.height};
        var t = {x: d.x0, y: d.y0, height: d.height}
//console.log('449:',s,t)
        return diagonal(s,t);
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
   */
    
  }

  // initialise tree
  const build = React.useCallback((svg) => {
console.log('build')
    svg.attr("viewBox", [0, 0, width, height])

    d3.zoom().scaleExtent([.1, 10]).on("zoom", zoom)

    // declares a tree layout and assigns the size
    treemap = d3.tree().nodeSize([40,100])
console.log('build data', data)
    
    root = createRoot(data);

    update(root, svg, treemap);
    centerNode(root, settings.prevscale)
    
    zoomer.on('dblclick', function(event) {
// console.log(event)
      event.preventDefault()
      //if(event.target.id !== 'baseRect') return
      d3.selectAll("circle").style("stroke", settings.colors.nodeStroke);
      d3.selectAll(".link").style("stroke", settings.colors.lineStroke);
    })
    zoomer.on('click', event => {
      //console.log(event)
      if(event.target.nodeName === 'svg' ) setTextDisplay('none')
    })
  },[data])

  const createRoot = () => {
console.log('createRoot data', data)
    let direction = '',
        j = 0;
    let rootdata = d3.hierarchy(data, function(d) { 
                if(j === 0) {
                } else {
                  if(d.direction) {
                    direction = d.direction
                  } else {
                    d.direction = direction
                  }
                  d.dierectionSW = direction === 'left' ? -1 : 1
                }
                j++
                return d.children
              })

    // Collapse after the second level
    if (rootdata.children)
      rootdata.children.forEach(collapse);

    // Assigns parent, children, height, depth
    rootdata.x0 = height / 2;
    rootdata.y0 = 0;
    setRootData(rootdata)
    return rootdata
  }

  // Custom hook
  const ref = useD3hook( (svg) => {
//console.log(data,Object.keys(data.data).length)
    if((data && Object.keys(data).length === 0) ) return
    if((width === 0 && height === 0)) return
console.log('useD3Hook data', data)
    build(svg);
    
    //center root
    zoomer
      .call(zoom)
    //   .call(zoom.transform, d3.zoomIdentity.translate(width/2,height/2))//.scale(2) )

  },[data, width, height]) // , Object.keys(data).length Object.keys(data).length
  
  // Data handling
  const storeData = async (key, value) => {
    try {
      await AsyncLocalStorage.setItem(key, value)
    } catch(e) {
      console.log('error saving data to localStorage')
    }
  }
  const readData = async (key) => {
    try {
      const response = await AsyncLocalStorage.getItem(key)
      const result = await JSON.parse(response)
console.log(result)
//createRoot(data)
setData(result)
      return result
    } catch(e) {
      console.log('error reading data from localStorage', e)
      return {'name':'root', 'children':null}
    }
  }
  const loadJson = () => {
    // Check localStorage --> app.js
    readData('dendogram.data')
    //createRoot(readData('dendogram.data'))
    // Load from file
    // d3.json('jsonurl').then(function(error, data){
    //   console.log(error, data)
    // })
  }
  const saveJson = () => {
    // Check localStorage --> app.js
    // Save to file nad localStorage
    storeData('dendogram.data', JSON.stringify(rootData.data))
    //localStorage.setItem('dendogram.data', JSON.stringify(rootData.data))
    localStorage.setItem('dendogram.update', Date.now())
    localStorage.setItem('dendogram.owner', 'John Doe')
  }
  const newTree = () => {
    setData({
      "name": "new root",
      "children":[]
    })
  }

  const textUpdate = (root) => {
//console.log('textupdate', textNode)
    const dsw = typeof textNode.data === 'undefined' ? 1 : textNode.data.dierectionSW
    const depth = typeof textNode.depth === 'undefined' ? 0 : textNode.depth
//console.log(dsw === 1 ? 'row':'row-reverse')
        return (
          <Paper elevation={3}
            sx={{
              position:'absolute',
              display:textDisplay,
              left:textLeft,
              top:textTop-60,
              border:'1px dashed red'
            }}
            onBlur={(e) => {
              e.preventDefault()
              setTextDisplay('none')
              setValue('')
              update(textNode)
            }}
          >
            <Box sx={{display:'flex', flexDirection: (dsw === 1 && depth !== 0) ? 'row-reverse':'row'}}>
              <AddCircleOutlineIcon 
                sx={{ color: 'action.active', mr: 1, ml:1, my: 1 }}
                onClick={(e) => {
                  addChild(e, textNode, dsw === 1 ? 'right':'left')
                  setTextDisplay('none')
                }}
              />
              <TextField id="text-editor-input" label="" 
                required 
                multiline maxRows={4} 
                autoFocus 
                size="small"
                variant="standard"
                /* inputRef={input => input && input.focus()} */
                value={value}
                onChange={(e) => updateContent(e)}
                 />
              {depth !== 0 ? 
              <RemoveCircleOutlineIcon 
                sx={{ color: 'action.active', mr:1,ml: 1, my: 1 }}
                onClick={(e) => {
                  removeChild(e, textNode)
                  setTextDisplay('none')
                }}
              />
              :
              <AddCircleTwoToneIcon 
                sx={{ color: 'action.active', mr: 1, ml:1, my: 1 }}
                onClick={(e) => {
                  addChild(e, textNode, dsw === 1 ? 'left':'right')
                  setTextDisplay('none')
                }}
              />
              }
            </Box>
    
          </Paper>
          
        )
  }

  // order of 'g' elemnts are important for the right zIndex ordering
  return (
    <React.Fragment>
      <Button onClick={(e) => setOpenDialog(!openDialog)}>dialog</Button>
      <Button onClick={(e) => {saveJson()}} >Save json</Button>
      <Button onClick={(e) => {loadJson()}} >Load json</Button>
      <Button onClick={(e) => {newTree()}} >New</Button>
      <React.Fragment>
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleCloseSnack}
            message={`Zoom: ${currentZoom}`}
            key={vertical + horizontal}
            action={action}
          />
        </React.Fragment>
      <div id="treecontainer" >
        <svg
          ref={ref}
          id='baseSvg'
          style={{
            minHeight: '100%',
            width: "100%",
            marginRight: "0px",
            marginLeft: "0px",
            backgroundColor:'#fff',
          }}
        >
          <g className="links" />
          <g className="nodes" id='baseG'/>
        </svg>
      </div>
      
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
      {textUpdate(root)}
    </React.Fragment>
  );
}

export default Tree3
