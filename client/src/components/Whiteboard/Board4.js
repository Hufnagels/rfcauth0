import React, { useEffect, useState, useRef, useLayoutEffect, useContext } from 'react';
import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';
import { useAuth0 } from '@auth0/auth0-react';

//Material
import { makeStyles } from '@mui/styles';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';
import ChangeHistoryOutlinedIcon from '@mui/icons-material/ChangeHistoryOutlined';

import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

import FolderIcon from '@mui/icons-material/Folder';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import ZoomOutOutlinedIcon from '@mui/icons-material/ZoomOutOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';

import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';

// custom
import ToolbarWrapper from '../ToolbarWrapper';
import {
  addDrawEmitter,
  addObjectEmitter, 
  modifyObjectEmitter, 
  removeObjectEmitter,
  addDrawListener,
  addObjectListener, 
  modifyObjectListener, 
  removeObjectListener
} from './board_socket_emitters_listeners';
//import {SocketContext, socket} from '../../features/context/socketcontext';
import {SocketContext, socket} from '../../features/context/socketcontext_whiteboard';

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
    '&selected':{
      color: '#ff4081 !important'
    }
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

const Board4 = () => {
  const classes = useStyles();
  const imgDown = React.useRef();
  const canvasRef = React.useRef(null);
  const toolsRef = React.useRef(null);
  const colorsRef = React.useRef('#f6b73c');
  const { user } = useAuth0();
  const { name, picture, email } = user;
  //const { positionInLine, queueLength, socketid } = useContext(SocketContext);
  const [connection, setConnection] = useState({
    username: name,
    roomname: 'whiteboardRoom',
    email:email,
    socket: null, //socket,
    socketid: null, //socket.id,
  });
  //Toolbar section begin
  let currentMode;
  let mousepressed = false;
  let wheeling;
  const [snackstate, setSnacktate] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });
  const { vertical, horizontal, open } = snackstate;
  const handleClickSnack = (newState) => () => {
    setSnacktate({ open: true, ...newState });
  };

  const handleCloseSnack = () => {
    setSnacktate({ ...snackstate, open: false });
  };
  const action = (
    <Button color="secondary" size="small" onClick={ () => {
      setCurrentZoom(1)
      canvasRef.current.zoomToPoint(new fabric.Point(canvasRef.current.width / 2, canvasRef.current.height / 2), 1.0);
      canvasRef.current.setZoom(1);
      
    }}>Set to default</Button>
  );
  const [currentZoom, setCurrentZoom] = React.useState(1)
  //SpeedDial
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  // const actions = [
  //   { icon: <FileCopyIcon />, name: 'Copy' , type: 'circle'},
  //   { icon: <SaveIcon />, name: 'Save', type: 'triangle' },
  //   { icon: <PrintIcon />, name: 'Print', type: 'rectangle' },
  //   { icon: <ShareIcon />, name: 'Share', type: ''},
  // ];
  // ToggleButtonGroup
  const [lineColor, setLineColor] = useState('#f6b73c')
  const [tool, setTool] = React.useState(null);
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
    console.log('selection')
    console.log(canvasRef.current.selection)
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
  const [offset,setOffset] = React.useState(null);
// console.log(offset)
// console.log('canvasFn', canvas)
  let origX, origY, drawingObject = null;  

  const [canvas, setCanvas] = React.useState('');

  const getCanvasPosition = (el) => {
    var viewportOffset = el.getBoundingClientRect();
    // these are relative to the viewport, i.e. the window
    return {top:viewportOffset.top, left:viewportOffset.left}
  }

  const initCanvas = () =>
    new fabric.Canvas('canvas', {
      isDrawingMode: false,
      lineWidth: 5,
      freeDrawingBrush:{
        color:colorsRef.current,
        width: 5
      },
      backgroundColor: 'white'
  })
  
  const initFabricCanvas = () => {
    canvasRef.current = new fabric.Canvas('canvas',{
      isDrawingMode: false,
      lineWidth: 5,
      topContextMenu: true,
      fireRightClick: true,
      freeDrawingBrush:{
        color:colorsRef.current,
        width: 5
      }
    });

    canvasRef.current.selectionColor = 'rgba(0,255,0,0.3)';
    //setOffset(getCanvasPosition(document.getElementById('canvas')))
    // fabric.Object.prototype.transparentCorners = true;
    // fabric.Object.prototype.cornerColor = 'red';
    // fabric.Object.prototype.cornerStyle = 'rectangle';

    const _original_initHiddenTextarea   = fabric.IText.prototype.initHiddenTextarea;
    fabric.util.object.extend(fabric.Text.prototype, /** @lends fabric.IText.prototype */ {    
      //fix for : IText not editable when canvas is in a fullscreen element on chrome
      // https://github.com/fabricjs/fabric.js/issues/5126
      initHiddenTextarea: function() {
        _original_initHiddenTextarea.call(this);
        this.canvas.wrapperEl.appendChild(this.hiddenTextarea);
      }
    });
    fabric.Object.prototype.toObject = (function (toObject) {
      return function () {
          return fabric.util.object.extend(toObject.call(this), {
              id: this.id,
              owner:this.owner,
              //circle
              radius: this.radius,
              //text
              text: this.text,
              textAlign: this.textAlign,

          });
      };
    })(fabric.Object.prototype.toObject);

    fabric.CustomIText = fabric.util.createClass(fabric.IText, {
      type        : 'custom-itext',
      initialize  : function(element, options) {
          this.callSuper('initialize', element, options);
          options && this.set('id', options.id);
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

  const initSocketConnection = () => {
    
    socket.emit('joinWhiteboardRoom', {
      username: name, 
      email: email, 
      roomname: connection.roomname
    })
    console.log('useEffect', socket)
  }

  const updateFreeDrawingBrush = () => {
    canvasRef.current.freeDrawingBrush.color = colorsRef.current;
    canvasRef.current.freeDrawingBrush.width = 5;
  }

  useEffect(() => {
    const sketchWrapper = document.getElementById('sketchWrapper');
    let sketchWrapper_style = getComputedStyle(sketchWrapper);
    //setCanvas(canvasRef.current);
    initSocketConnection();

    initFabricCanvas();
    
    canvasFn(canvasRef.current)
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

    return () => {
      window.removeEventListener("resize", onResize);
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
      if (canvasRef.current) {

        canvasRef.current.on('path:created', function(e){
          if (e.path) {
            if(e.path.owner === connection.email) return
console.info('path:created')
// console.info(e)
// console.log(JSON.stringify(e.path))
            e.path.id = uuid();
            e.path.owner = connection.email;
            const modifiedObj = {
              obj: JSON.stringify(e.path),
              id: e.path.id,
              username: connection.username,
              email: connection.email,
              roomname: connection.roomname, 
            }
            addDrawEmitter(modifiedObj)
          }
        })

        canvasRef.current.on('object:modified', function (options) {
          if (options.target) {
            const modifiedObj = {
              obj: options.target,
              id: options.target.id,
              username: connection.username,
              email: connection.email,
              roomname: connection.roomname, 
            }
            modifyObjectEmitter(modifiedObj)
          }
        })

        canvasRef.current.on('object:moving', function (options) {
// console.log('object:moving')
// console.log(options.target)
// console.log(options.target.getBoundingRect())

          if (options.target) {
            const modifiedObj = {
              obj: options.target,
              id: options.target.id,
              username: connection.username,
              email: connection.email,
              roomname: connection.roomname, 
            }
            modifyObjectEmitter(modifiedObj)
          }
        })

        canvasRef.current.on('object:removed', function (options) {
          if (options.target) {
            const removedObj = {
              obj: options.target,
              id: options.target.id,
              username: connection.username,
              email: connection.email,
              roomname: connection.roomname, 
            }
            removeObjectEmitter(removedObj)
          }
        })

        canvasRef.current.on('object:added', function(options){
console.log('object:added')
console.log(options.target)
console.log(options.target.getBoundingRect())

        })

        addDrawListener(canvasRef.current)
        addObjectListener(canvasRef.current)
        modifyObjectListener(canvasRef.current)
        removeObjectListener(canvasRef.current)
      }
  },[canvasRef.current])

  const addShape = (e) => {
    let type = e.target.name || e.currentTarget.name;
    let object
    /* 
    // Speeddial
    console.log(e.target.nodeName, e)
    if (e.target.parentNode.nodeName === 'BUTTON')
      type = e.target.parentNode.getAttribute('name')
    else if (e.target.parentNode.nodeName === 'DIV')
      type = e.target.getAttribute('name')
    else if (e.target.nodeName === 'path')
      type = e.target.parentNode.parentNode.getAttribute('name')
    //console.log(e.target.parentNode.nodeName)
    console.log(type)
    // return 
    */
    if(type !== 'Line'){
    if (type === 'Rectangle') {
      object = new fabric.Rect({
        height: 75,
        width: 150,
        stroke: colorsRef.current,
        strokeWidth: 5,
        fill: 'transparent',
        transparentCorners: false,
        globalCompositeOperation: "source-over",
        clipTo: null,
      });

    } else if (type === 'FilledRectangle') {
      object = new fabric.Rect({
        height: 75,
        width: 150,
        stroke: colorsRef.current,
        strokeWidth: 5,
        fill: colorsRef.current,
        transparentCorners: false,
        globalCompositeOperation: "source-over",
        clipTo: null,
      });

    } else if (type === 'Triangle') {
      object = new fabric.Triangle({
        width: 100,
        height: 100,
        stroke: colorsRef.current,
        strokeWidth: 5,
        fill: 'transparent',
        transparentCorners: false,
        globalCompositeOperation: "source-over",
        clipTo: null,
      })

    } else if (type === 'Circle') {
      object = new fabric.Circle({
        radius: 50,
        stroke: colorsRef.current,
        strokeWidth: 5,
        fill: 'transparent',
      })
    } else if (type === 'FilledCircle') {
      object = new fabric.Circle({
        radius: 50,
        stroke: colorsRef.current,
        strokeWidth: 5,
        fill: colorsRef.current,
      })
    } else if (type === 'Text') {
      object = new fabric.IText('IText', { 
        left: 10, 
        top: 50,
        fontFamily: 'Arial',
        fontSize: 20,
        fill: colorsRef.current,
        text:'IText',
        visible: true,
      });

    }

    object.set({id: uuid()})
    object.set({owner: connection.email})
    canvasRef.current.add(object)
    canvasRef.current.renderAll()
    //canvasRef.current.selection = true;
    addObjectEmitter({
      obj: object, 
      id: object.id,
      username: connection.username,
      email: connection.email,
      roomname: connection.roomname, 
    })
    } else if (type === 'Line') { 
      object = new fabric.Path('M 200 100 L 350 100', {
        stroke: colorsRef.current,
        strokeWidth: 5,
        fill: colorsRef.current,
        originX: 'left',
        originY: 'top'
      });
      object.set({ left: 100, top: 100 });
      object.set({id: uuid()})
      object.set({owner: connection.email})
      canvasRef.current.add(object)
      canvasRef.current.renderAll()
      const modifiedObj = {
        obj: JSON.stringify(object),
        id: object.id,
        username: connection.username,
        email: connection.email,
        roomname: connection.roomname, 
      }
      addDrawEmitter(modifiedObj)
    }
  };

  const canvasFn = (canvas) => {
    const offset = getCanvasPosition(document.getElementById('canvas'));
    let origX, origY, drawingObject = null;
    //loadJSONData(canvas, canvasData);

    canvas.on('mouse:move', function(e) {
      const event = e.e;
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
        // case drawingMode.line:
        //   if(drawingObject !== null){
        //     var pointer = canvas.getPointer(event);
        //     drawingObject.set({ x2: pointer.x, y2: pointer.y });
        //     this.requestRenderAll();
        //   }
        //   break;
        // case drawingMode.rect:
        // case drawingMode.fillrect:
        //   if(drawingObject !== null){
        //     var pointer = canvas.getPointer(event);
        //     //drawingObject = canvas.getActiveObject();
        //     if(origX>pointer.x){
        //         drawingObject.set({ left: Math.abs(pointer.x) });
        //     }
        //     if(origY>pointer.y){
        //         drawingObject.set({ top: Math.abs(pointer.y) });
        //     }
  
        //     drawingObject.set({ width: Math.abs(origX - pointer.x) });
        //     drawingObject.set({ height: Math.abs(origY - pointer.y) });
        //     this.requestRenderAll()
        //   }
        //   break;
        // case drawingMode.circle:
        // case drawingMode.fillcircle:
        //   if(drawingObject !== null){
        //     var pointer = canvas.getPointer(event);
        //     var radius = Math.max(Math.abs(origY - pointer.y),Math.abs(origX - pointer.x))/2;
        //     if (radius > drawingObject.strokeWidth) {
        //         radius -= drawingObject.strokeWidth/2;
        //     }
        //     drawingObject.set({ radius: radius});
            
        //     if(origX>pointer.x){
        //         drawingObject.set({originX: 'right' });
        //     } else {
        //         drawingObject.set({originX: 'left' });
        //     }
        //     if(origY>pointer.y){
        //         drawingObject.set({originY: 'bottom'  });
        //     } else {
        //         drawingObject.set({originY: 'top'  });
        //     }
        //     this.requestRenderAll()
        //   }
        //   break;
        default:
          break;
      }
    })

    canvas.on('mouse:down', function(e) {
      const event = e.e;
      mousepressed = true;
      console.log(e.button)
      if (e.button === 3 && e.target) {
        canvas.sendBackwards(e.target);
        canvas.discardActiveObject();
        canvas.renderAll();
      }
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
        // case drawingMode.line:
        //   if (e.target !== null) return
        //   //canvas.selection = false;
        //   var pointer = canvas.getPointer(event.e);
        //   var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
        //   origX = pointer.x;
        //   origY = pointer.y;
        //   drawingObject = new fabric.Line(points, {
        //     strokeWidth: 5,
        //     fill: colorsRef.current,
        //     stroke: colorsRef.current,
        //     // originX: 'center',
        //     // originY: 'center'
        //   });
        //   drawingObject.set({id: uuid(), owner: connection.email})
        //   canvas.add(drawingObject);
        //   break;
        // case drawingMode.rect:
        // case drawingMode.fillrect:
        //   if (e.target !== null) return
        //   //canvas.selection = false;
        //   var pointer = canvas.getPointer(event.e);
        //   origX = pointer.x;
        //   origY = pointer.y;
        //   drawingObject = new fabric.Rect({
        //     left: origX,
        //     top: origY,
        //     width: pointer.x-origX,
        //     height: pointer.y-origY,
        //     angle: 0,
        //     //selectable:true,
        //     stroke: colorsRef.current,
        //     strokeWidth: 5,
        //     fill: toolsRef.current === drawingMode.fillrect ? colorsRef.current : 'transparent',
        //     transparentCorners: false,
        //     globalCompositeOperation: "source-over",
        //     clipTo: null,
        //   });
        //   drawingObject.set({id: uuid(), owner: connection.email})
        //   canvas.add(drawingObject);
        //   break;
        // case drawingMode.circle:
        // case drawingMode.fillcircle:
        //   if (e.target !== null) return
        //   //canvas.selection = false;
        //   var pointer = canvas.getPointer(event);
        //   origX = pointer.x;
        //   origY = pointer.y;
        //   drawingObject = new fabric.Circle({
        //     left: origX,
        //     top: origY,
        //     radius: pointer.x-origX,
        //     angle: 0,
        //     fill: toolsRef.current === drawingMode.fillcircle ? colorsRef.current : 'transparent',
        //     stroke: colorsRef.current,
        //     strokeWidth: 5,
        //     globalCompositeOperation: "source-over",
        //     clipTo: null,
        //   });
        //   drawingObject.set({id: uuid(), owner: connection.email})
        //   canvas.add(drawingObject);
        //   break;
        // case drawingMode.text:
        //   if (e.target !== null) return
        //   var pointer = canvas.getPointer(event.e);
        //   origX = pointer.x;
        //   origY = pointer.y;
        //   drawingObject = new fabric.Text('Sample', { 
        //     left: origX, 
        //     top: origY,
        //     fontWeight: 'normal',
        //     fontSize: 40,
        //     textAlign: 'left',
        //     fill: colorsRef.current,
        //     text:'Sample',
        //     visible: true,
        //   })
        //   drawingObject.set({id: uuid(), owner: connection.email})
        //   canvas.add(drawingObject);
        //   break;
        default:
          break;
      }
    })

    canvas.on('mouse:up', function(e) {
      const event = e.e;
      mousepressed = false;
      this.isDragging = false;
console.log('mouse:up')
console.log(e.target)
      canvas.selection=true;
      
      if(drawingObject !== null ) {
        drawingObject.owner = connection.email;
        
console.log('mouse up drawinObject')
        //canvas.remove(drawingObject);
        //if(dropObject(drawingObject, canvas, drawingObject.id)){
        const modifiedObj = {
          obj: drawingObject,
          id: drawingObject.id,
          username: connection.username,
          email: connection.email,
          roomname: connection.roomname, 
        }
        //canvas.remove(drawingObject);
        addObjectEmitter(modifiedObj)
        drawingObject = null;
        //}
        
        
console.log(canvas.getObjects())
      }
      canvasRef.current.selection = (toolsRef.current === drawingMode.pan || toolsRef.current === drawingMode.select) ? true : false;
      origX=null;
      origY=null;
      this.renderAll();//requestRenderAll()
    })

    canvas.on('mouse:wheel', function(e) {
      clearTimeout(wheeling);
      setSnacktate({ ...snackstate, open: true });
      const event = e.e;
      const delta = event.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      console.log(zoom)
      zoom = parseFloat(zoom).toFixed(4);
      setCurrentZoom(zoom)
      canvas.zoomToPoint({ x: event.offsetX, y: event.offsetY }, zoom);
      event.preventDefault();
      event.stopPropagation();
      wheeling = setTimeout(function() {
        setSnacktate({ ...snackstate, open: false });
      }, 5000)
    });

  }

  return (
      <React.Fragment>
        <a ref={imgDown} hidden href="" />
        <div>
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleCloseSnack}
            message={`Zoom: ${currentZoom}`}
            key={vertical + horizontal}
            action={action}
          />
        </div>
        <SketchWrapper id="sketchWrapper">
          <canvas id="canvas" ref={canvasRef} className={classes.board} ></canvas>
        </SketchWrapper>
        <ToolbarWrapper>
          
          {/* <Box sx={{ height: 70, transform: 'translateZ(0px)', flexGrow: 1, position:'relative', }}>
            <SpeedDial
              ariaLabel="SpeedDial uncontrolled open example"
              sx={{ position: 'absolute', bottom: 16, right: 16, }}
              icon={<AddOutlinedIcon size='large' />}
              onClose={handleClose}
              onOpen={handleOpen}
              open={open}
              direction='left'
            >
              {actions.map((action) => (
                <SpeedDialAction
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.type}
                  onClick={addShape}
                  name={action.type}
                />
              ))}
            </SpeedDial>
          </Box> */}
          <Box
            component="form"
            sx={{
              marginBottom:0,
              '& .MuiTextField-root': { m: 0, width: '5.4ch',minHeight:40, },
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
        <Box
            component="form"
            sx={{
              marginBottom:2,
              '& .MuiTextField-root': { m: 0, width: '5.3ch', },
            }}
            noValidate
            autoComplete="off"
            style={{display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap',
              alignContent: 'flex-start',
              alignItems: 'stretch',
              justifyContent: 'center',
            }}
          >
        <ToggleButtonGroup
          color="primary"
          orientation="vertical"
          value={tool}
          exclusive
          onChange={handleChange}
          aria-label="outlined Sketch Tools"
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
        </ToggleButtonGroup>
        </Box>
        <Box
            component="form"
            sx={{
              marginBottom:1,
              '& .MuiTextField-root': { m: 1, width: '5.3ch', },
            }}
            noValidate
            autoComplete="off"
            style={{display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap',
              alignContent: 'flex-start',
              alignItems: 'stretch',
              justifyContent: 'center',
            }}
          >
        <ButtonGroup
          orientation="vertical"
          aria-label="vertical outlined button group"
        >
          <Button variant="text" color='secondary' name="Line" aria-label="Line" onClick={(e) => { addShape(e) }}>
            <DriveFileRenameOutlineOutlinedIcon />
          </Button>
          <Button variant="text" color='secondary' name="FilledRectangle" aria-label="FilledRectangle" onClick={(e) => { addShape(e) }}>
            <FolderIcon />
          </Button>
          <Button variant="text" color='secondary' name="FilledCircle" aria-label="FilledCircle" onClick={(e) => { addShape(e) }}>
            <CircleIcon />
          </Button>
          <Button variant="text" color='secondary' name="Rectangle" aria-label="Rectangle" onClick={(e) => { addShape(e) }}>
            <FolderOutlinedIcon />
          </Button>
          <Button variant="text" color='secondary' name="Circle" aria-label="Circle" onClick={(e) => { addShape(e) }}>
            <CircleOutlinedIcon />
          </Button>
          <Button variant="text" color='secondary' name="Triangle" aria-label="Text" onClick={(e) => { addShape(e) }} >
            <ChangeHistoryOutlinedIcon />
          </Button>
          <Button variant="text" color='secondary' name="Text" aria-label="Text" onClick={(e) => { addShape(e) }}>
            <TextFieldsOutlinedIcon />
          </Button>
        </ButtonGroup>
        </Box>
        </ToolbarWrapper>
      </React.Fragment>
  );
}

export default Board4;