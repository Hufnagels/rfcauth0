import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
// import io from 'socket.io-client';
// import PropTypes from 'prop-types'
import { useAuth0 } from '@auth0/auth0-react';
import useSocket from 'use-socket.io-client';
import { fabric } from 'fabric'
import { v4 as uuid } from 'uuid'

//Material
import { makeStyles } from '@mui/styles';
import { styled, useTheme } from '@mui/material/styles';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

// Custom
import dataJson from "../../pages/admin/Whiteboard/src/data.json";

// Toolbar imports
// Material
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

// Material icons
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';
import CreateIcon from '@mui/icons-material/Create';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import ZoomOutOutlinedIcon from '@mui/icons-material/ZoomOutOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import PanToolIcon from '@mui/icons-material/PanTool';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';

// custom
import ToolbarWrapper from '../../ToolbarWrapper';

/* 
function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
} */

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    position: 'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
  },
  board: {
    width:'100%',
    height:'100%',
    position: 'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    borderWidth: '1px',
    borderStyle: 'dashed', 
    borderColor: 'black', //theme.palette.primary.main,
    background: 'transparent',
    // backgroundColor: theme.palette.secondary.light,
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  },
  sketch: {
    width:'100%',
    height:'100%',
  },
}));

const SketchWrapper = styled('div')(({ theme }) => ({
  position:'relative',
  width: '100%',
  height:'100%',
}));

let headers = new Headers();
headers.append('Access-Control-Allow-Origin', `http://${window.location.hostname}:3000`)//'http://localhost:3000');
headers.append('Access-Control-Allow-Credentials', 'true');

const LabeledRect = fabric.util.createClass(fabric.Rect, {

  type: 'labeledRect',
  // initialize can be of type function(options) or function(property, options), like for text.
  // no other signatures allowed.
  initialize: function(options) {
    options || (options = { });

    this.callSuper('initialize', options);
    this.set('label', options.label || '');
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      label: this.get('label')
    });
  },

  _render: function(ctx) {
    this.callSuper('_render', ctx);

    ctx.font = '20px Helvetica';
    ctx.fillStyle = '#333';
    ctx.fillText(this.label, -this.width/2, -this.height/2 + 20);
  }
});

const Board3 = () => {
  const classes = useStyles();
  //Toolbar section begin
  let currentMode;
  const [tool, setTool] = useState(null);
  const handleChange = (event, nextView) => {
    event.preventDefault();
    console.log('handelchange', event)
    currentMode = nextView;
    if( nextView !== null){
      setTool(nextView);
      toolsRef.current=nextView;
    }
    canvasRef.current.isDrawingMode = (toolsRef.current === drawingMode.pencil) ? true : false;
    canvasRef.current.selection = (toolsRef.current === drawingMode.pan || toolsRef.current === drawingMode.select) ? true : false;
    if (nextView === drawingMode.pencil) {
      updateFreeDrawingBrush();
    }
  };
  const drawingMode = {
    pan:'Pan',
    select:'Select',
    pencil:'Pencil',
    line:'Line',
    rect:'Rectangle',
    fillrect: 'FilledRectangle',
    circle:'Circle',
    fillcircle: 'FilledCircle',
    text: 'Text',
    default:null,
  }

  // Toolbar section end
  const imgDown = useRef();
  const canvasRef = useRef(null);
  const toolsRef = useRef(null);
  const colorsRef = useRef('#f6b73c');
  
  const [socket] = useSocket(`http://${window.location.hostname}:4000`, {
    withCredentials: true,
    headers: headers
  });
  socket.connect();
  const { user } = useAuth0();
  const { name, picture, email } = user;
  const [connection, setConnection] = useState({
    username: name,
    roomname: 'whiteboardRoom',
    email:email,
    socket: null, //socket,
    socketid: null, //socket.id,
  });

  // let sketchWrapper = null;
  let mousepressed = false;

  const [lineColor, setLineColor] = useState('#f6b73c')
  const [lineWith, setLineWith] = useState(5)
  const [isDrawing, setIsDrawing] = useState(false);
  const [sketcher, setSketcher] = useState({
    lineWidth: 3,
    lineColor: "#f6b73c",
    fillColor: "#68CCCA",
    backgroundColor: "transparent",
    drawings: [],
    canUndo: false,
    canRedo: false,
    shadowWidth: 0,
    shadowOffset: 0,
    tool: 'Tools.DefaultTool',
    enableRemoveSelected: false,
    fillWithColor: false,
    fillWithBackgroundColor: false,
    isDrawing: false,
    text: "add text",
    enableCopyPaste: true,

    // controlledSize: false,
    // sketchWidth: 600,
    // sketchHeight: 600,
    // stretched: true,
    // stretchedX: false,
    // stretchedY: false,
    // originX: "left",
    // originY: "top",
    
  });
  const [canvasf, setCanvasf] = useState('');
  const [canvasData, setCanvasData] = useState(dataJson)

  const getCanvasPosition = (el) => {
    var viewportOffset = el.getBoundingClientRect();
    // these are relative to the viewport, i.e. the window
    return {top:viewportOffset.top, left:viewportOffset.left}
  }
  useEffect(()=>{
    const sketchWrapper = document.getElementById('sketchWrapper');
    let sketchWrapper_style = getComputedStyle(sketchWrapper);
    initFabricCanvas();

    const onResize = () => {
      let width = parseInt(sketchWrapper_style.getPropertyValue('width'));
      let height = parseInt(sketchWrapper_style.getPropertyValue('height'));
      if(width !== 0 || height !== 0) {
        canvasRef.current.setDimensions({
          width: width, 
          height:height
        });
        canvasRef.current.renderAll();
        console.info('W-H: ', width, height)
      }
    }
    window.addEventListener('resize', onResize, false);
    onResize();
    setCanvasf(canvasRef.current)
    canvasFn(canvasRef.current);
    
    return () => {
      window.removeEventListener("resize", onResize);
    }
  },[])

  useEffect(() => {

    socket.on('connect', () => {
      setConnection({...connection, 
        socket,
        socketid: socket.id 
      });
    })
    socket.emit('joinRoom', {username: connection.username, email: connection.email, roomname: connection.roomname})
    socket.on('connection-message', (response) => {
      console.log('connection-message: ', response)
      setConnection({...connection, username: response.username});
      setConnection({...connection, socketid: response.socketid});
    })
    //socket.off('onObjectAdded')
    socket.on('onObjectAdded', response => {
console.log('onObjectAdded: ', response)
      const { username, email, roomname, data, id } = response;
console.log(username, email, roomname, data, id)
console.log(data.hasOwnProperty('id'), data.id)
console.log(data.hasOwnProperty('owner'), data.owner)
fabric.util.enlivenObjects([data], (objects) => {
  objects.forEach(function(o) {
    canvasRef.current.add(o);
  });
  
  canvasRef.current.renderAll();
})
return
      if((data.hasOwnProperty('id') && data.id !== '') && (data.owner !== connection.email)){
        
        
        switch (typeof data){
          case 'string':
            displaySocketDataFromJSONString(data, canvasRef.current);
            break;
          case 'object':
            displaySocketDataFromJSONString(JSON.stringify(data), canvasRef.current);
            break;
          default:
            break;
        }
        
        // var canvasString = "{\"objects\":[";
        // canvasString += JSON.stringify(data);
        // canvasString += "], \"background\":\"\"}";
        // var tmpCanvas = new fabric.Canvas();
        // tmpCanvas.loadFromJSON(canvasString);
        // for(var k in tmpCanvas.getObjects()) {
        //   canvasRef.current.add(tmpCanvas._objects[k]);
        // }
      }
      canvasRef.current.renderAll();
console.log(canvasRef.current.toDatalessJSON)

    })

    socket.on('onObjectModified', (response) => {
      console.log('onObjectModified: ', response)
      const { username, roomname, data, id } = response;
      console.log(username, roomname, data, id)
      if(typeof data === 'undefined' || data === '') return
      canvasRef.current.getObjects().forEach(object => {
        if (object.id === id) {
          object.set(data)
          object.setCoords()
          canvasRef.current.renderAll()
        }
      })
      // canvasRef.current.render()
      //console.log(canvasRef.current)
    })
    socket.on('onObjectRemoved', (response) => {
      console.log('onObjectRemoved: ', response)
      const { username, email, roomname, /* data, */ id } = response;
      console.log(username, email, roomname, id)
      if(typeof id === 'undefined' || id === '') return
      canvasRef.current.getObjects().forEach(object => {
        if (object.id === id) {
          canvasRef.current.remove(object)
          canvasRef.current.renderAll()
        }
      })
      // canvasRef.current.render()
      console.log(canvasRef.current)
    })
    socket.on('onPathCreated', (response) => {
      console.log('onPathCreated: ', response)
      const { username, email, roomname, data, id } = response;
      console.log(username, email, roomname, id)
      if(typeof id === 'undefined' || id === '') return
      displaySocketDataFromJSONString(data, canvasRef.current);
      // fabric.loadSVGFromString(data, function(objects, options) {
      //   var obj = fabric.util.groupSVGElements(objects, options);
      //   canvasRef.current.add(obj).centerObject(obj).renderAll();
      //   obj.setCoords();
      //   obj.id = id;
      //   obj.owner = email;
      // });
    })
    
    return () => {
      socket.off();
    }
  },[socket])

  useEffect(() => {
    if (canvasf) {
      canvasf.on('path:created', function(e){
console.info('path:created')
console.info(e)
console.log(JSON.stringify(e.path))
e.path.id = uuid();
e.path.owner = connection.email;
// console.info(e)
// console.log(e.path.toSVG())
        socket.emit('onPathCreated', {
          username: connection.username,
          email: connection.email,
          roomname: connection.roomname, 
          data: JSON.stringify(e.path), // e.path.toSVG(), // JSON.stringify(e),
          id: e.path.id,
        })
      })

      canvasf.on('object:added', function(e){
console.info('object:added')
// console.log(e)
// console.log(e.target)
console.info(e.target.id, e.target.owner)
// console.log(e.target.hasOwnProperty('id'), e.target.id)
// console.log(e.target.hasOwnProperty('owner'), e.target.owner)
// console.log(e.target.hasOwnProperty('type'), e.target.type)
// console.log(JSON.stringify(e))
// console.log(e.target.toJSON([]))
// console.log(JSON.stringify(e.target.toJSON()))
// console.log(e.target.toDatalessJSON())
console.log(e.target.toObject())
// var c = this.toJSON();
// this.clear();
// this.loadFromJSON(c);
this.requestRenderAll();
return
        if((e.target.hasOwnProperty('id') && e.target.id !== '') && (e.target.hasOwnProperty('owner') && e.target.owner == connection.email)){
          socket.emit('onObjectAdded', {
            username: connection.username,
            email: connection.email,
            roomname: connection.roomname, 
            data: e.target.toObject(),//JSON.stringify(e.target), //e.target.toJSON([]), //e.target, //JSON.stringify(e.target),
            id: e.target.id,
          })
        }
      })

      canvasf.on('object:modified', function(e){
console.info('object:modified')
console.log(e.target)
console.info(e.target.id)
        if(!e.target.hasOwnProperty('id') || e.target.id === '') return
        socket.emit('onObjectModified', {
          username: connection.username, 
          roomname: connection.roomname, 
          data: e.target, //JSON.stringify(e.target), //e.target, // JSON.stringify(e.target),
          id: e.target.id,
        })
      })

      canvasf.on('object:removed', function(e){
console.info('object:removed')
console.info(e.target.id)
return
        if(!e.target.hasOwnProperty('id') || e.target.id === '') return
        socket.emit('onObjectRemoved', {
          username: connection.username, 
          email: connection.email,
          roomname: connection.roomname, 
          //data: e.target, //JSON.stringify(e.target),
          id: e.target.id,
        })
      })

      // canvasf.on('selection:created', function(e){
      //   console.info('selection:created')
      //   console.info(e)
      // })

      // canvasf.on('after:render', function(e){
      //   console.info('after:render')
      //   console.info(e)
      // })
    }
  },[canvasf])

  const initFabricCanvas = () => {
    canvasRef.current = new fabric.Canvas('canvas',{
      isDrawingMode: false,
      lineWidth: 5,
      freeDrawingBrush:{
        color:colorsRef.current,
        width: 5
      }
    });
    // fabric.Object.prototype.transparentCorners = true;
    // fabric.Object.prototype.cornerColor = 'red';
    // fabric.Object.prototype.cornerStyle = 'rectangle';

    fabric.Object.prototype.toObject = (function (toObject) {
      return function () {
          return fabric.util.object.extend(toObject.call(this), {
              id: this.id,
              owner:this.owner
          });
      };
    })(fabric.Object.prototype.toObject);

    fabric.CustomIText = fabric.util.createClass(fabric.IText, {
      type        : 'custom-itext',
      initialize  : function(element, options) {
          this.callSuper('initialize', element, options);
          options && this.set('textID', options.textID);
      },
      toObject: function() {
          return fabric.util.object.extend(this.callSuper('toObject'), {
            id: this.id,
            owner:this.owner
          });
      }
    });    
    fabric.CustomIText.fromObject = function(object) {
        return new fabric.CustomIText(object.text, object);
    };
    // canvasRef.current.freeDrawingBrush.onMouseDown = (function(onMouseDown) {
    //   return function(pointer) {
    //     console.log('down');
    //     this.createdOn = Date.now();
    //     this.id = uuid();
    //     this.owner = connection.email;
    //     onMouseDown.call(this, pointer);
    //   }
    // })(canvasRef.current.freeDrawingBrush.onMouseDown);


    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: 16,
      cursorStyle: 'pointer',
      mouseUpHandler: deleteObject,
      render: renderIcon,
      cornerSize: 24
    });
    function deleteObject(eventData, transform) {
      var target = transform.target;
      var canvas = target.canvas;
          canvas.remove(target);
          canvas.requestRenderAll();
    }
    function renderIcon(ctx, left, top, styleOverride, fabricObject) {
      var size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(img, -size/2, -size/2, size, size);
      ctx.restore();
    }
    var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

    var img = document.createElement('img');
    img.src = deleteIcon;
  }

  const canvasFn = (canvas) => {
    const offset = getCanvasPosition(document.getElementById('canvas'));
// console.log(offset)
// console.log('canvasFn', canvas)
    let origX, origY, drawingObject = null;
    canvas.selectionColor = 'rgba(0,255,0,0.3)';
    
    //loadJSONData(canvas, canvasData);

    canvas.on('mouse:move', function(e) {
      const event = e.e;
      canvas.selection=false;
      if(mousepressed) console.info('mouse:move toolsRef',toolsRef.current)
      //Pan
      //if (mousepressed && toolsRef.current == drawingMode.pan && this.isDragging) {
      switch (toolsRef.current) {
        case drawingMode.pan:
          if (!this.isDragging) return
console.info('begin pan')
          var vpt = this.viewportTransform;
          vpt[4] += event.clientX - this.lastPosX;
          vpt[5] += event.clientY - this.lastPosY;
          this.requestRenderAll();
          this.lastPosX = event.clientX;
          this.lastPosY = event.clientY;
          break;
        case drawingMode.pencil:
          this.isDrawingMode = true;
          break;
        case drawingMode.line:
          if(drawingObject !== null){
            var pointer = canvas.getPointer(event);
            drawingObject.set({ x2: pointer.x, y2: pointer.y });
            this.requestRenderAll();
          }
          break;
        case drawingMode.rect:
        case drawingMode.fillrect:
          if(drawingObject !== null){
            var pointer = canvas.getPointer(event);
            //drawingObject = canvas.getActiveObject();
            if(origX>pointer.x){
                drawingObject.set({ left: Math.abs(pointer.x) });
            }
            if(origY>pointer.y){
                drawingObject.set({ top: Math.abs(pointer.y) });
            }
  
            drawingObject.set({ width: Math.abs(origX - pointer.x) });
            drawingObject.set({ height: Math.abs(origY - pointer.y) });
            this.requestRenderAll()
          }
          break;
        case drawingMode.circle:
        case drawingMode.fillcircle:
          if(drawingObject !== null){
            var pointer = canvas.getPointer(event);
            var radius = Math.max(Math.abs(origY - pointer.y),Math.abs(origX - pointer.x))/2;
            if (radius > drawingObject.strokeWidth) {
                radius -= drawingObject.strokeWidth/2;
            }
            drawingObject.set({ radius: radius});
            
            if(origX>pointer.x){
                drawingObject.set({originX: 'right' });
            } else {
                drawingObject.set({originX: 'left' });
            }
            if(origY>pointer.y){
                drawingObject.set({originY: 'bottom'  });
            } else {
                drawingObject.set({originY: 'top'  });
            }
            this.requestRenderAll()
          }
          break;
        default:
          break;
      }
      
    })

    canvas.on('mouse:down', function(e) {
      const event = e.e;
      mousepressed = true;
console.info('mouse:down event',e)
canvas.selection=false;
      if (event.altKey === true ) {
        this.setCursor('grab')
        canvasRef.current.selection = false;
        canvasRef.current.isDrawingMode = false;
        this.isDragging = true;
        this.lastPosX = event.clientX;
        this.lastPosY = event.clientY;
      } 
      switch (toolsRef.current) {
        case drawingMode.pencil:
          this.isDrawingMode = true;
          this.setCursor('crosshair');
          updateFreeDrawingBrush();
          break;
        case drawingMode.line:
          if (e.target !== null) return
          //canvas.selection = false;
          var pointer = canvas.getPointer(event.e);
          var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
          origX = pointer.x;
          origY = pointer.y;
          drawingObject = new fabric.Line(points, {
            strokeWidth: 5,
            fill: colorsRef.current,
            stroke: colorsRef.current,
            originX: 'center',
            originY: 'center'
          });
          drawingObject.set({id: uuid()})
          drawingObject.owner = connection.email;
          drawingObject.set({owner: connection.email})
          canvas.add(drawingObject);
          break;
        case drawingMode.rect:
          if (e.target !== null) return
          //canvas.selection = false;
          var pointer = canvas.getPointer(event.e);
          origX = pointer.x;
          origY = pointer.y;
          var pointer = canvas.getPointer(event.e);
          drawingObject = new fabric.Rect({
            left: origX,
            top: origY,
            width: pointer.x-origX,
            height: pointer.y-origY,
            angle: 0,
            //selectable:false,
            //hasBorders: true,
            stroke: colorsRef.current,
            strokeWidth: 5,
            fill: 'transparent',
            transparentCorners: false,
            globalCompositeOperation: "source-over",
            clipTo: null,
          });
          drawingObject.set({id: uuid()})
          drawingObject.owner = connection.email;
          drawingObject.set({owner: connection.email})
          canvas.add(drawingObject);
          break;
        case drawingMode.fillrect:
          if (e.target !== null) return
          //canvas.selection = false;
          var pointer = canvas.getPointer(event.e);
          origX = pointer.x;
          origY = pointer.y;
          drawingObject = new fabric.Rect({
            left: origX,
            top: origY,
            width: pointer.x-origX,
            height: pointer.y-origY,
            angle: 0,
            //selectable:true,
            stroke: colorsRef.current,
            strokeWidth: 5,
            fill: colorsRef.current,
            transparentCorners: false,
            globalCompositeOperation: "source-over",
            clipTo: null,
          });
          drawingObject.id = uuid();
          drawingObject.owner = connection.email;
          drawingObject.set({id: uuid()})
          drawingObject.set({owner: connection.email})
          canvas.add(drawingObject);
          break;
        case drawingMode.circle:
          if (e.target !== null) return
          //canvas.selection = false;
          var pointer = canvas.getPointer(event);
          origX = pointer.x;
          origY = pointer.y;
          drawingObject = new fabric.Circle({
            left: origX,
            top: origY,
            radius: pointer.x-origX,
            angle: 0,
            fill: '',
            stroke: colorsRef.current,
            strokeWidth: 5,
            globalCompositeOperation: "source-over",
            clipTo: null,
          });
          drawingObject.id = uuid();
          drawingObject.owner = connection.email;
          drawingObject.set({id: uuid()})
          drawingObject.set({owner: connection.email})
          canvas.add(drawingObject);
          break;
        case drawingMode.fillcircle:
          if (e.target !== null) return
          //canvas.selection = false;
          var pointer = canvas.getPointer(event);
          origX = pointer.x;
          origY = pointer.y;
          drawingObject = new fabric.Circle({
            left: origX,
            top: origY,
            radius: pointer.x-origX,
            angle: 0,
            fill: colorsRef.current,
            stroke: colorsRef.current,
            strokeWidth: 5,
            globalCompositeOperation: "source-over",
            clipTo: null,
          });
          drawingObject.id = uuid();
          drawingObject.owner = connection.email;
          drawingObject.set({id: uuid()})
          drawingObject.set({owner: connection.email})
          canvas.add(drawingObject);
          break;
        case drawingMode.text:
          if (e.target !== null) return
          var pointer = canvas.getPointer(event.e);
          origX = pointer.x;
          origY = pointer.y;
          drawingObject = new fabric.Text('Sample', { 
            left: origX, 
            top: origY,
            fontWeight: 'normal',
            fontSize: 40,
            textAlign: 'left',
            fill: colorsRef.current,
            text:'Sample',
            colorProperties: {
              fill: colorsRef.current
              // stroke 
              // backgroundColor
            },
          })
          drawingObject.id = uuid();
          drawingObject.owner = connection.email;
          drawingObject.set({id: uuid()})
          drawingObject.set({owner: connection.email})
          canvas.add(drawingObject);
          break;
        default:
          break;
      } 
    })

    canvas.on('mouse:up', function(e) {
      const event = e.e;
      mousepressed = false;
      this.isDragging = false;
      //canvas.isDrawingMode = false;
      canvas.selection=true;
      if(drawingObject !== null ) {
        drawingObject.owner = connection.email;
console.log('mouse up drawinObject')
const obj = drawingObject.toObject()
//obj.set({id:uuid()})
console.log(obj)
console.log('remove drawingobject')
canvas.remove(drawingObject);
console.log('add obj')
var elements = []
elements.push(obj);
fabric.util.enlivenObjects(elements, function(objects) {
  objects.forEach(function(o) {
    canvas.add(o);
  });
  
  canvas.renderAll();
});
        if(!(drawingObject instanceof fabric.IText) || !(drawingObject instanceof fabric.Circle)) {
//console.log(drawingObject)
          //canvas.remove(drawingObject);
          //dropObject(drawingObject, canvas)//, 'drawingObject.id', 'drawingObject.awtype')
        }
        drawingObject = null;
        canvas.selection = true;
console.log(canvas.getObjects())
      }
      origX=null;
      origY=null;
      this.renderAll();//requestRenderAll()
    })

    canvas.on('mouse:wheel', function(e) {
      const event = e.e;
      const delta = event.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: event.offsetX, y: event.offsetY }, zoom);
      event.preventDefault();
      event.stopPropagation();
    });

    const dropObject = (drawingObject, canvas, id='', awtype='') => {
      //const component = this;
      drawingObject.clone(function (clone) {
          clone.set('selectable', true);
          //component.addLongClickListener(clone);
          clone.toObject = (function (toObject) {
              return function () {
                  return fabric.util.object.extend(toObject.call(this), {
                      id: this.id //+ 'dropped',
                      //awtype: this.awtype
                  });
              };
          })(clone.toObject);
          clone.id = uuid(); // drawingObject.id; //
          clone.owner = connection.email;
          clone.set({owner:connection.email})
          //clone.stroke = 'red';
          //clone.awtype = awtype;
          // component.canvas.add(clone);
          // component.canvas.renderAll();
          canvas.add(clone);
          canvas.renderAll();
      });
      canvas.remove(drawingObject);
      canvas.renderAll();
    }
  }

  const loadJSONData = (canvas, canvasData) => {
    canvas.loadFromJSON(canvasData, () => {
      // console.info('loadFromJSON canvasData')
      // console.info(canvasData)
      canvas.renderAll();
    })
  }

  const updateFreeDrawingBrush = () => {
    canvasRef.current.freeDrawingBrush.color = colorsRef.current;
    canvasRef.current.freeDrawingBrush.width = 5;
  }

  const displaySocketDataFromJSONString = (data, canvasS) => {
    var canvasString = "{\"objects\":[";
    canvasString += data;
    canvasString += "], \"background\":\"\"}";
    var tmpCanvas = new fabric.Canvas();
    tmpCanvas.loadFromJSON(canvasString);
    for(var k in tmpCanvas.getObjects()) {
      canvasS.add(tmpCanvas._objects[k]);
    }
    tmpCanvas = null;
    canvasS.renderAll();
  }

  return (
    <React.Fragment>
      <a ref={imgDown} hidden href="" />
      <SketchWrapper id="sketchWrapper">
        <canvas id="canvas" ref={canvasRef} className={classes.board} ></canvas>
      </SketchWrapper>
      <ToolbarWrapper>
      <Box
          component="form"
          sx={{
            marginBottom:1,
            '& .MuiTextField-root': { m: 0, width: '5.3ch',minHeight:40, },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              /* label="Color" */
              id="outlined-size-large"
              size="small"
              type="color"
              style={{}}
              value={lineColor}
              onChange={(e) => {
                console.info(e.target.value)
                setLineColor(e.target.value)
                colorsRef.current=e.target.value;
                // canvas.freeDrawingBrush.color = lineColor;
                console.info(lineColor)
              }}
            />
          </div>
        </Box>
        <ToggleButtonGroup
          color="primary"
          orientation="vertical"
          value={tool}
          exclusive
          onChange={handleChange}
          aria-label="Sketch Tools"
        >
          <ToggleButton value="Pan" aria-label="Pan">
            <PanToolOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="Select" aria-label="Select">
            <PhotoSizeSelectSmallIcon />
          </ToggleButton>
          <ToggleButton value="Pencil" aria-label="Pencil">
            <GestureOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="Line" aria-label="Line">
            <DriveFileRenameOutlineOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="FilledRectangle" aria-label="FilledRectangle">
            <FolderIcon />
          </ToggleButton>
          <ToggleButton value="FilledCircle" aria-label="FilledCircle">
            <CircleIcon />
          </ToggleButton>
          <ToggleButton value="Rectangle" aria-label="Rectangle">
            <FolderOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="Circle" aria-label="Circle">
            <CircleOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="Text" aria-label="Text">
            <TextFieldsOutlinedIcon />
          </ToggleButton>
          
        </ToggleButtonGroup>
      </ToolbarWrapper>
    </React.Fragment>
  )
}

export default Board3
