import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';
import { useAuth0 } from '@auth0/auth0-react';

// Material
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import {
  Button,
  Snackbar,
  Grid,
  Paper,
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  Typography,
  List,
  ListItem,
  Divider,
} from '@mui/material';
//import MuiBox from '@mui/material/Box';

// custom
import BoardToolbar from './BoardToolbar';
import {
  AddJsonEmitter,
  AddDrawEmitter,
  AddObjectEmitter, 
  ModifyObjectEmitter, 
  RemoveObjectEmitter,
  AddJsonListener,
  AddDrawListener,
  AddObjectListener, 
  ModifyObjectListener, 
  RemoveObjectListener
} from './board_socket_emitters_listeners';
import { 
  SocketContext,
  // connectedSocket,
  // disconnectedSocket,
} from '../../../features/context/socketcontext_whiteboard';

import {
  statechange,
} from '../../../redux/reducers/whiteboardSlice';
//import History from '../../../features/history';
import { tryParseJSONObject, isNumeric } from '../../../features/utils';
import ConnectonDecideDialog from './ConnectonDecideDialog';
import BoardActionMessage from './BoardActionMessage';
import RoomMessages from './RoomMessages';

const drawerWidth = 240;
const BoxCanvas = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: '100%',
    minWidth:'100%',
    height:'calc(100vh - 80px)',
    flexShrink: 0,
    boxSizing: 'border-box',
    display:'flex',
    position: 'relative', 
    zIndex:'100',
  }),
);

const SketchWrapper = styled('div')(({ theme }) => ({
  position:'relative',
  width: '100%',
  minWidth:'100%',
  height:'100%',
}));

const useStyles = makeStyles((theme) => ({
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

const Board6 = () => {
  // Authentication
  const { user } = useAuth0();
  const { name, picture, email } = user;

  // Socket
  const socket = useContext(SocketContext);

  // Styles
  const classes = useStyles();
  
  // Default settings
  const defaultValues = {
    zoom:1,
    loadedFile:'',
    strokeWidth:5,
    stroke:'#f6b73c',
    fill:'#f6b73c',
    room:'whiteboardRoom',
  }

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
    triangle:'Triangle',
    default:null,
    draw:'Draw',
  }

  // Refs
  const imgDown = React.useRef(null);
  const jsonDown = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const toolsRef = React.useRef(null);
  const strokeRef = React.useRef(defaultValues.stroke);
  const strokeWidthRef = React.useRef(defaultValues.strokeWidth);
  const fillRef = React.useRef(defaultValues.fill);

  // Redux store & reducers
  const dispatch = useDispatch();

  // States - socket
  const [isConnectedToSocket, setIsConnectedToSocket] = React.useState(socket.connected || false)
  const [connectedToRoom, setConnectedToRoom] = React.useState(false)
  const [connection, setConnection] = useState({
    name: name,
    room: defaultValues.room,
    email:email,
    socket: {}, //socket,
    socketid: '', //socket.id,
  });

  // States - drawing
  const [isenabled, setIsenabled] = React.useState(false)
  const [currentZoom, setCurrentZoom] = React.useState(localStorage.getItem('whiteboard.zoom'))
  const [currentFile, setCurrentFile] = React.useState('')
  const [activeobject, setActiveobject] = React.useState(null)
  const [currentStrokeWidth, setCurrentStrokeWidth] = React.useState(strokeWidthRef.current)
  const [currentStrokeColor, setCurrentStrokeColor] = React.useState(strokeRef.current)
  const [currentFillColor, setCurrentFillColor] = React.useState(fillRef.current)
  const [sketchwidth, setSketchwidth] = React.useState(0)
  
  // States - Messaging
  const [actiontype, setActiontype] = React.useState('success')
  const [message, setMessage] = React.useState('');
  
  // States - Snackbar
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
        canvasRef.current.zoomToPoint(new fabric.Point(canvasRef.current.width / 2, canvasRef.current.height / 2), 1.0);
        canvasRef.current.setZoom(1);
      }}>Set to default</Button>
  );

  // States - Right drawer
  const [draweropen, setDraweropen] = React.useState(true)
  const [drawertype, setDrawertype] = React.useState('permanent')
  // Mouse action variables
  let mousepressed = false;
  let wheeling;
  let origX, origY, drawingObject = null;

  useEffect(() => {
    const sketchWrapper = document.getElementById('sketchWrapper');
    let sketchWrapper_style = getComputedStyle(sketchWrapper);
    setSketchwidth( parseInt(sketchWrapper_style.getPropertyValue('width')) )
    setIsConnectedToSocket(socket.connected)
// console.info('socket, isConnectedToSocket, connectedToRoom #1 useEffect')
// console.info(socket, isConnectedToSocket, connectedToRoom)
// console.info('connectedSocket, disconnectedSocket (socketcontext)  #1 useEffect')
// console.info(connectedSocket, disconnectedSocket)

    initFabricCanvas();
    
    canvasMouseObservers(canvasRef.current)
    canvasObservers();

    const onResize = () => {
      //let sketchWrapper_style = getComputedStyle(sketchWrapper);
      let width = parseInt(sketchWrapper_style.getPropertyValue('width') );
      let height = parseInt(sketchWrapper_style.getPropertyValue('height'));
      setSketchwidth(width)
      if(width !== 0 || height !== 0) {
        if (window.innerWidth-drawerWidth-32 < width){
          width = window.innerWidth-drawerWidth-32
        }
        canvasRef.current.setDimensions({
          width: width, 
          height: height
        });
        canvasRef.current.requestRenderAll() //renderAll();
//console.info('W-H: ', width, height)
        //setCurrentZoom(canvasRef.current.getZoom())
      }
    }
    window.addEventListener('resize', onResize, false);
    onResize();
//console.error(tryParseJSONObject(localStorage.getItem('whiteboard.data')))

    return () => {
      window.removeEventListener("resize", onResize);
      socket.emit('leave-WhiteboardRoom', socket.id);
    }
  }, []);

  useEffect(() => {
    setIsConnectedToSocket(socket.connected)
// console.info('connectedSocket, disconnectedSocket (socketcontext)  #2 useEffect')
// console.info(connectedSocket, disconnectedSocket)

// console.info('socket, isConnectedToSocket, connectedToRoom #2 useEffect')
// console.info(socket, isConnectedToSocket, connectedToRoom)
    socket.on('connect', () => {
      console.log('socket connected from board5');
      setIsConnectedToSocket(true)
      setMessage('socket connected')
      setActiontype('success')
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected from board5');
      setIsConnectedToSocket(false)
      setConnectedToRoom(false)
      setMessage('socket disconnected')
      setActiontype('error')
    })
  },[socket, isConnectedToSocket, connectedToRoom])
  
  // Functions: Board Toolbar toChild functions
  const agreeToConnect = (checked) => {
// console.log('agreeToConnect - checked: ',checked)
// console.log('agreeToConnect - socket.id: ',socket.id)
    setIsConnectedToSocket(checked)
    setConnectedToRoom(checked)

    checked ? initSocketConnection() : socket.emit('leave-WhiteboardRoom', socket.id);

    // AddJsonListener(canvasRef.current);
    // AddDrawListener(canvasRef.current);
    // AddObjectListener(canvasRef.current);
    // ModifyObjectListener(canvasRef.current);
    // RemoveObjectListener(canvasRef.current);
  }

  const pushJSON = () => {
console.log('whole canvas sended')
canvasRef.current.fromjson = 1;
canvasRef.current.sender = connection.email;
const canvasJSON = canvasRef.current.toJSON(['fromjson', 'sender']) 
// console.log("JSON.stringify(canvasRef.current.toJSON(['fromjson']))")
// console.log(JSON.stringify(canvasJSON))
// return
    AddJsonEmitter({
      obj: JSON.stringify(canvasJSON), 
      //id: object.id,
      name: connection.name,
      email: connection.email,
      room: connection.room,
      action:'onJSONSended',
      zoom: canvasRef.current.getZoom(),
    })
  }

  const setStrokeColor = (data) => {
    strokeRef.current = data
console.log(strokeRef.current)
setCurrentStrokeColor(data)
//console.log(activeobject)
    if(activeobject) {
      activeobject.set({stroke:strokeRef.current})
      canvasRef.current.requestRenderAll();
    }
  }

  const setStrokeWidth = (data) => {
    strokeWidthRef.current = data
    setCurrentStrokeWidth(data)
// console.log(strokeRef.current)
//console.log(activeobject)
    if(activeobject) {
      activeobject.set({strokeWidth:strokeWidthRef.current})
      canvasRef.current.requestRenderAll();
    }

  }

  const setFillColor = (data) => {
    fillRef.current = data;
    if(activeobject) {
      activeobject.set({fill:fillRef.current})
      canvasRef.current.requestRenderAll();
    }
    
  }

  const selectTool = (data) => {
    console.log(data)
    if( data !== null){
      //setTool(nextView);
      toolsRef.current=data;
    }
    if( data === drawingMode.draw) 
      setIsenabled(true) 
    else 
      setIsenabled(false)
    canvasRef.current.isDrawingMode = (toolsRef.current === drawingMode.pencil) ? true : false;
    canvasRef.current.selection = (/* toolsRef.current === drawingMode.pan ||  */data === drawingMode.select) ? true : false;
// console.log('selection')
// console.log(canvasRef.current.selection)
    if (data === drawingMode.pencil) {
      updateFreeDrawingBrush();
    }
  }

  const objectButtons = (data) => {}
  // Toolbar section end

  // Functions: Socket
  const initSocketConnection = useCallback(() => {
    
    socket.emit('joinWhiteboardRoom', {
      name: name, 
      email: email, 
      room: connection.room
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
// console.log('response', response)
// console.log('response connection', connection)
// console.log('connectedToRoom', connectedToRoom)
    })
    
  },[])

  // Functions: Canvas base
  const initFabricCanvas = useCallback(() => {
    canvasRef.current = new fabric.Canvas('canvas',{
      isDrawingMode: false,
      lineWidth: strokeWidthRef.current,
      topContextMenu: true,
      fireRightClick: true,
      freeDrawingBrush:{
        color:strokeRef.current,
        width: strokeWidthRef.current
      },
      fromjson: 0,
      sender:'',
    });
    canvasRef.current.setZoom(localStorage.getItem('whiteboard.zoom'));
    canvasRef.current.selectionColor = 'rgba(0,255,0,0.3)';
    
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
              fontFamily: this.fontFamily,
              fontSize: this.fontSize,
              fontStyle: this.fontStyle,
              fontWeight: this.fontWeight,

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
  },[])

  const canvasMouseObservers = (canvas) => {
    const offset = getCanvasPosition(document.getElementById('canvas'));
    
    //loadJSONData(canvas, canvasData);

    canvas.on('mouse:move', function(e) {
      const event = e.e;
      
      switch (toolsRef.current) {
        case drawingMode.pan:
          if (!this.isDragging) return
// console.info('begin pan')
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
        case drawingMode.triangle:
          if(drawingObject !== null) {
            var pointer = canvas.getPointer(event);
            drawingObject.set({ width: Math.abs(origX - pointer.x) });
            drawingObject.set({ height: Math.abs(origY - pointer.y) });
            this.requestRenderAll()
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
      //canvas.selection=true;
    })

    canvas.on('mouse:down', function(e) {
      const event = e.e;
      mousepressed = true;
console.log('mouse:down')
console.log(toolsRef.current)
      canvas.selection=true;
      if (e.button === 3 && e.target) {
        canvas.sendBackwards(e.target);
        canvas.discardActiveObject();
        canvas.requestRenderAll() //renderAll();
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
          updateFreeDrawingBrush();
          this.isDrawingMode = true;
          this.setCursor('crosshair');
          break;
        case drawingMode.line:
          if (e.target !== null) return
          //canvas.selection = false;
          var pointer = canvas.getPointer(event.e);
          var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
          origX = pointer.x;
          origY = pointer.y;
          drawingObject = new fabric.Line(points, {
            strokeWidth: strokeWidthRef.current,
            fill: fillRef.current,
            stroke: strokeRef.current,
            originX: 'center',
            originY: 'center'
          });
          drawingObject.set({id: uuid()})
          drawingObject.set({owner: connection.email})
          canvas.add(drawingObject);
          break;
        case drawingMode.triangle:
          if(e.target !== null) return
          var pointer = canvas.getPointer(event.e);
          origX = pointer.x;
          origY = pointer.y;
          var pointer = canvas.getPointer(event.e);
          drawingObject = new fabric.Triangle({
            left: origX,
            top: origY,
            width: pointer.x-origX,
            height: pointer.y-origY,
            stroke: strokeRef.current,
            strokeWidth: strokeWidthRef.current,
            fill: 'transparent',
            transparentCorners: false,
            globalCompositeOperation: "source-over",
            clipTo: null,
            dirty: false,
          })
          drawingObject.set({id: uuid()})
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
            stroke: strokeRef.current,
            strokeWidth: strokeWidthRef.current,
            fill: 'transparent',
            transparentCorners: false,
            globalCompositeOperation: "source-over",
            clipTo: null,
          });
          drawingObject.set({id: uuid()})
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
            stroke: strokeRef.current,
            strokeWidth: strokeWidthRef.current,
            fill: fillRef.current,
            transparentCorners: false,
            globalCompositeOperation: "source-over",
            clipTo: null,
          });
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
            stroke: strokeRef.current,
            strokeWidth: strokeWidthRef.current,
            globalCompositeOperation: "source-over",
            clipTo: null,
          });
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
            fill: fillRef.current,
            stroke: strokeRef.current,
            strokeWidth: strokeWidthRef.current,
            globalCompositeOperation: "source-over",
            clipTo: null,
          });
          drawingObject.set({id: uuid()})
          drawingObject.set({owner: connection.email})
          canvas.add(drawingObject);
          break;
        case drawingMode.text:
          if (e.target !== null) return
          var pointer = canvas.getPointer(event.e);
          origX = pointer.x;
          origY = pointer.y;
          drawingObject = new fabric.IText('Sample', { 
            left: origX, 
            top: origY,
            fontWeight: 'normal',
            fontSize: 40,
            textAlign: 'left',
            fill: strokeRef.current,
            stroke: strokeRef.current,
            text:'Sample',
            colorProperties: {
              fill: strokeRef.current
              // stroke 
              // backgroundColor
            },
          })
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
// console.log('mouse:up')
// console.log(e.target)
      canvas.selection=true;
      if(drawingObject !== null ) {
        drawingObject.set({owner:connection.email});
// console.log('mouse up drawinObject')
// console.log(drawingObject)
//canvas.remove(drawingObject);
        drawingObject.set({selectable:true, evented:true})
        const modifiedObj = {
          obj: drawingObject,
          id: drawingObject.id,
          name: connection.name,
          email: connection.email,
          room: connection.room,
          action:'object:added',
        }
canvas.remove(drawingObject);
        switch (drawingObject.type) {
          case 'line':
          case 'Line':
            modifiedObj.obj = JSON.stringify(drawingObject)
            AddDrawEmitter(modifiedObj)
            break;

          default:
            AddObjectEmitter(modifiedObj)
            break;
        }
        canvas.add(modifiedObj.obj)
        toolsRef.current = drawingMode.default;
//console.log("canvas.getActiveObject().get('id')")
//console.log(canvas.getActiveObject().get('id'))
//canvas.setActiveObject(canvas.item(drawingObject.id)) 
        drawingObject = null;
        //}
//console.log(canvas.getObjects())
      }
      canvasRef.current.selection = (toolsRef.current === drawingMode.pan || toolsRef.current === drawingMode.select) ? true : false;
      origX=null;
      origY=null;
      this.requestRenderAll(); // renderAll();//
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
//console.log(zoom)
      setCurrentZoom(zoom)
      localStorage.setItem('whiteboard.zoom',zoom)
      canvas.zoomToPoint({ x: event.offsetX, y: event.offsetY }, zoom);
      event.preventDefault();
      event.stopPropagation();
      wheeling = setTimeout(function() {
        setSnacktate({ ...snackstate, open: false });
      }, 5000)
    });

  }

  const getCanvasPosition = (el) => {
    var viewportOffset = el.getBoundingClientRect();
    // these are relative to the viewport, i.e. the window
    return {top:viewportOffset.top, left:viewportOffset.left}
  }

  const updateFreeDrawingBrush = () => {
    canvasRef.current.freeDrawingBrush.color = strokeRef.current;
    canvasRef.current.freeDrawingBrush.width = strokeWidthRef.current;
  }

  const canvasObservers = useCallback(() => {
    if (canvasRef.current) {

      canvasRef.current.on('path:created', function(e){
        if (e.path) {
          if(e.path.owner === connection.email) return
console.info('path:created', e.path)
          e.path.id = uuid();
          e.path.owner = connection.email;
          const modifiedObj = {
            obj: JSON.stringify(e.path),
            id: e.path.id,
            name: connection.name,
            email: connection.email,
            room: connection.room,
            action:'path:created',
            zoom: canvasRef.current.getZoom(),
          }
          AddDrawEmitter(modifiedObj)
        }
      })

      canvasRef.current.on('selection:created', function(options){
console.log('selection:created', options)
        setActiveobject(options.target)
        if(options.target.strokeWidth !== null) setCurrentStrokeWidth(options.target.strokeWidth)
        if(options.target.stroke !== null) setCurrentStrokeColor(options.target.stroke)
        if(options.target.fill !== null) setCurrentFillColor(options.target.fill)
        
      })
      
      canvasRef.current.on('before:selection:cleared', function(options){
        console.log('before:selection:cleared', options)
        canvasRef.current.fire('object:modified', {target: options.target});
      })
      
      canvasRef.current.on('selection:cleared', function(options){
console.log('selection:cleared', options)
      })

      canvasRef.current.on('selection:updated', function(options){
        console.log('selection:updated', options)
        setActiveobject(options.target)
        if(options.target.strokeWidth !== null) setCurrentStrokeWidth(options.target.strokeWidth)
        if(options.target.stroke !== null) setCurrentStrokeColor(options.target.stroke)
        if(options.target.fill !== null) setCurrentFillColor(options.target.fill)
      })

      canvasRef.current.on('object:modified', function (options) {
        console.log('obj modified: ', canvasRef.current.getZoom())
        if (options.target) {
          const modifiedObj = {
            obj: options.target,
            id: options.target.id,
            name: connection.name,
            email: connection.email,
            room: connection.room,
            action:'object:modified',
            zoom: canvasRef.current.getZoom(),
          }
          ModifyObjectEmitter(modifiedObj)
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
            name: connection.name,
            email: connection.email,
            room: connection.room,
            action:'object:moving',
            zoom: canvasRef.current.getZoom(),
          }
          ModifyObjectEmitter(modifiedObj)
        }
      })

      canvasRef.current.on('object:removed', function (options) {
        if (options.target && canvasRef.current.fromjson === 0) {
          const removedObj = {
            obj: options.target,
            id: options.target.id,
            name: connection.name,
            email: connection.email,
            room: connection.room,
            action:'object:removed',
            zoom: canvasRef.current.getZoom(),
          }
          RemoveObjectEmitter(removedObj)
        }
      })

      canvasRef.current.on('object:added', function(options){
// console.log('object:added')
// console.log(options.target)
// console.log(options.target.getBoundingRect())

      })

      canvasRef.current.on('before:render', function(options){
        // console.log('before:render')
        // console.log(options)
      })

      canvasRef.current.on('after:render', function(options){
// console.log('after:render')
// console.log(options)
        const object = canvasAllToJson(canvasRef.current, true);
        dispatch(statechange(object))
      })

      AddJsonListener(canvasRef.current);
      AddDrawListener(canvasRef.current)
      AddObjectListener(canvasRef.current)
      ModifyObjectListener(canvasRef.current)
      RemoveObjectListener(canvasRef.current)
// console.log(canvasRef.current.getZoom())
      loadSavedState();
    }
  },[])

  const zoomDefault = () => {
    var zoom = 1;
    if((localStorage.getItem('whiteboard.zoom') === 'NaN') && isNumeric(localStorage.getItem('whiteboard.zoom'))) {
      zoom = localStorage.getItem('whiteboard.zoom');
    } else {
      zoom = 1;
      localStorage.setItem('whiteboard.zoom', zoom)
    }
    //setCurrentZoom(zoom)
    return parseFloat(zoom);

  }

  const addShape = (e) => {
    let type = e//.target.name || e.currentTarget.name;
    let object
    
    if(type !== 'Line'){
    if (type === 'Rectangle') {
      object = new fabric.Rect({
        height: 75,
        width: 150,
        stroke: strokeRef.current,
        strokeWidth: strokeWidthRef.current,
        fill: 'transparent',
        transparentCorners: false,
        globalCompositeOperation: "source-over",
        clipTo: null,
        dirty: false,
      });

    } else if (type === 'FilledRectangle') {
      object = new fabric.Rect({
        height: 75,
        width: 150,
        stroke: strokeRef.current,
        strokeWidth: strokeWidthRef.current,
        fill: fillRef.current,
        transparentCorners: false,
        globalCompositeOperation: "source-over",
        clipTo: null,
        dirty: false,
      });

    } else if (type === 'Triangle') {
      object = new fabric.Triangle({
        width: 100,
        height: 100,
        stroke: strokeRef.current,
        strokeWidth: strokeWidthRef.current,
        fill: 'transparent',
        transparentCorners: false,
        globalCompositeOperation: "source-over",
        clipTo: null,
        dirty: false,
      })

    } else if (type === 'Circle') {
      object = new fabric.Circle({
        radius: 50,
        stroke: strokeRef.current,
        strokeWidth: strokeWidthRef.current,
        fill: 'transparent',
        dirty: false,
      })
    } else if (type === 'FilledCircle') {
      object = new fabric.Circle({
        radius: 50,
        stroke: strokeRef.current,
        strokeWidth: strokeWidthRef.current,
        fill: fillRef.current,
        dirty: false,
      })
    } else if (type === 'Text') {
      object = new fabric.IText('IText', { 
        left: 10, 
        top: 50,
        fontFamily: 'Arial',
        fontSize: 20,
        fill: strokeRef.current,
        text:'IText',
        visible: true,
        dirty: false,
      });

    }

    object.set({id: uuid()})
    object.set({owner: connection.email})
    canvasRef.current.add(object)
    canvasRef.current.requestRenderAll() //renderAll()
    //canvasRef.current.selection = true;
    AddObjectEmitter({
      obj: object, 
      id: object.id,
      name: connection.name,
      email: connection.email,
      room: connection.room,
      action:'object:added',
    })
    } else if (type === 'Line') { 
      object = new fabric.Path('M 200 100 L 350 100', {
        stroke: strokeRef.current,
        strokeWidth: strokeWidthRef.current,
        fill: strokeRef.current,
        originX: 'left',
        originY: 'top'
      });
      object.set({ left: 100, top: 100 });
      object.set({id: uuid()})
      object.set({owner: connection.email})
      canvasRef.current.add(object)
      canvasRef.current.requestRenderAll()//renderAll()
      const modifiedObj = {
        obj: JSON.stringify(object),
        id: object.id,
        name: connection.name,
        email: connection.email,
        room: connection.room,
        action:'object:added',
      }
      AddDrawEmitter(modifiedObj)
    }
  };

  const groupUngroup = (e) => {
    let type = e//.target.name || e.currentTarget.name

    switch (type) {
      case 'UnGroup':
        if (!canvasRef.current.getActiveObject()) {
          return;
        }
        if (canvasRef.current.getActiveObject().type !== 'group') {
          return;
        }
        canvasRef.current.getActiveObject().toActiveSelection();
        canvasRef.current.requestRenderAll();
        break;
      case 'Group':
        if (!canvasRef.current.getActiveObject()) {
          return;
        }
        if (canvasRef.current.getActiveObject().type !== 'activeSelection') {
          return;
        }
        canvasRef.current.getActiveObject().toGroup();
        canvasRef.current.requestRenderAll();
        break;
      default:
        break;
    }
    
  }

  // Functions: Canvas datahandling
  const canvasAllToJson = (json, toJson = true) => {
    const date = new Date();
    const data = JSON.stringify(json);
    //if(toJson) json = data;
    const object = {
      board: (toJson ? data:json),
      name: connection.name,
      date: date.toUTCString('yyy-mm-dd hh:mm:ss'),
      timestamp: date.getTime(),
      zoom: canvasRef.current.getZoom(),
    }
    localStorage.setItem('whiteboard.data',data)
    localStorage.setItem('whiteboard.name',object.name)
    localStorage.setItem('whiteboard.date',object.date)
    localStorage.setItem('whiteboard.timestamp',object.timestamp)
    localStorage.setItem('whiteboard.zoom',object.zoom)
    return object;
  }

  const loadSavedState = () => {
    //console.log('loadsavedata')
    const zoom = localStorage.getItem('whiteboard.zoom')//parseFloat(localStorage.getItem('whiteboard.zoom')).toFixed(4);
    setCurrentZoom(zoom)
    if(localStorage.getItem('whiteboard.data') && tryParseJSONObject(localStorage.getItem('whiteboard.data'))) {
      canvasRef.current.loadFromJSON(localStorage.getItem('whiteboard.data'), function() {
        canvasRef.current.requestRenderAll();
      },function(o,object){
// console.log(o,object)
        object.scale(o.scaleX, o.scaleY)
      });
      if(localStorage.getItem('whiteboard.zoom')){
        const zoom = parseFloat(localStorage.getItem('whiteboard.zoom')).toFixed(4);
        setCurrentZoom(zoom)
        canvasRef.current.zoomToPoint({ x: parseFloat(canvasRef.current.width), y: parseFloat(canvasRef.current.height) }, zoom);
      }
    }
  }

  const saveAll = (filename = 'canvas') => {
    //e.preventDefault();
    const json = JSON.stringify(canvasRef.current);
    const object = canvasAllToJson(canvasRef.current, false);
    //object.board = canvasRef.current;
  console.info(currentFile)
    if (currentFile) {
      filename = currentFile.replace(/\.[^/.]+$/, "");
    } else {
      filename += '_' + object.name + '_' + object.timestamp;
    }
    const fileData = JSON.stringify(object);
    const blob = new Blob([fileData], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    //const link = document.createElement('a');
    jsonDown.current.download = `${filename}.json`;
    jsonDown.current.href = url;
    jsonDown.current.click();

    const dataURL = canvasRef.current.toDataURL({
      width: canvasRef.current.width,
      height: canvasRef.current.height,
      left: 0,
      top: 0,
      format: 'png',
    });
    imgDown.current.download = `${filename}.png`;
    imgDown.current.href = dataURL;
    imgDown.current.click();
    imgDown.current.href = ''
  }

  const loadAll = (e) => {
    //e.preventDefault();
    fileInputRef.current.click();
    return
  }

  const clearAll = (e) => {
    console.log('clearAll')
    console.log(e)
    canvasRef.current.clear();
    setCurrentFile('')
  }

  const handelImage = (img) => {
    // const file = e.target.files && e.target.files[0];

    // if (file) {
    //   let reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onloadend = () => {
    //     const base64data = reader.result;
    //     selectImage(base64data);
    //   };
    // }
  }

  const handelJson = (data) => {
    // simple json (canvas objects only) or 
    // custom object converted to json (name, board, date, timestamp)
    let json = '';
    let isCustom = false;
    const parsedData = JSON.parse(data);
    if (parsedData && parsedData.board) {
      //custom json
      json = JSON.stringify(parsedData.board)
      isCustom = true;
    } else if (typeof parsedData.board === 'undefined'){
      // simple json
      json = data;
    }
    canvasRef.current.clear();
    canvasRef.current.loadFromJSON(json, function() {
      canvasRef.current.requestRenderAll();
    },function(o,object){
//console.log(o,object)
object.scale(o.scaleX, o.scaleY)
    });
    if(isCustom && parsedData.zoom) {
      const zoom = parsedData.zoom;
      setCurrentZoom(zoom)
      canvasRef.current.zoomToPoint({ x: parseFloat(canvasRef.current.width)*.6, y: parseFloat(canvasRef.current.height)*.6 }, zoom);
    }
  }
    
  const handleFiles = (files) => {
// console.log('files:', files)
    // validation required
    const arr = [...files]
    arr.forEach(file =>  {
// console.info(file.name)
// console.info(file.type)
// console.info(file)
			// if (file.type.match(textType)) {
				var reader = new FileReader();
				reader.onload = function(e) {
// console.log(reader.result);
          handelJson(reader.result)
				}
				reader.readAsText(file);	
			// } else {
			// 	console.log("File not supported!")
			// }
    });
  }

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
    if (validTypes.indexOf(file.type) === -1) {
        return false;
    }
    return true;
  }

  const filesSelected = () => {
    if (fileInputRef.current.files.length) {
      handleFiles(fileInputRef.current.files);
    }
  }

  return (
    <React.Fragment>
      <a ref={imgDown} hidden href="" />
        <a ref={jsonDown} hidden href="" />
        <input type="file" ref={fileInputRef} onChange={filesSelected} hidden />
      <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleCloseSnack}
            message={`Zoom: ${currentZoom}`}
            key={vertical + horizontal}
            action={action}
          />
      <ConnectonDecideDialog
          agreeToConnect={agreeToConnect}
          connected={isConnectedToSocket}
          connectedToRoom={connectedToRoom}
        />
      <BoardActionMessage
          actiontype={actiontype}
          message={message}
        />
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
      
        <Grid 
          container
          direction="row"
        >
          <Grid item xs={12}>
            <Paper elevation={3}>
              <BoxCanvas sx={{ overflow:'hidden', }}>
                <SketchWrapper id="sketchWrapper">
                  <canvas id="canvas" ref={canvasRef} className={classes.board} ></canvas>
                </SketchWrapper>
                <BoardToolbar
                  agreeToConnect={agreeToConnect}
                  connected={isConnectedToSocket}
                  connectedToRoom={connectedToRoom}
                  setStrokeWidth={setStrokeWidth}
                  setStrokeColor={setStrokeColor}
                  setFillColor={setFillColor}
                  currentStrokeWidth={currentStrokeWidth}
                  currentStrokeColor={currentStrokeColor}
                  currentFillColor={currentFillColor}
                  selectTool={selectTool}
                  groupUngroup={groupUngroup}
                  addShape={selectTool}
                  loadAll={loadAll}
                  saveAll={saveAll}
                  clearAll={clearAll}
                  dummyCB={(e)=>{alert('Dummy')}}
                  pushJSON={pushJSON}
                  isenabled={isenabled}
                />
              </BoxCanvas>
            </Paper>
          </Grid>
      </Grid>
      
      <Drawer
        variant={drawertype}
        anchor="right"
        open={draweropen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          height:'100%',
          zIndex: (theme) => theme.zIndex.AppBar - 1,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        
      >
        <Toolbar />
        <Divider />
        <Box sx={{ position:'relative'}}>
          {/* <RoomMessages /> */}
        </Box>
      </Drawer>
    </Box>
    </React.Fragment>
  )
}

export default Board6
