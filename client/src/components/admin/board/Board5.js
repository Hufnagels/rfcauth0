import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';
import { useAuth0 } from '@auth0/auth0-react';

//Material
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors'
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

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
  dropZone:{
    display:'none',
    width:'90vw',
    height:'300px',
    position:'absolute',
    top:'10px',
    zIndex:'1000',
    '&.selected':{
      backgroundColor: purple[500],
      display:'block',
      '&:hover':{
        backgroundColor: purple[100],
      },
    },
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

const Board5 = (props) => {
  // Authentication
  const { user } = useAuth0();
  const { name, picture, email } = user;

  // Socket
  const socket = useContext(SocketContext);
  
  const [isConnectedToSocket, setIsConnectedToSocket] = React.useState(socket.connected || false)
  const [connectedToRoom, setConnectedToRoom] = React.useState(false)
  const [connection, setConnection] = useState({
    name: name,
    room: 'whiteboardRoom',
    email:email,
    socket: {}, //socket,
    socketid: '', //socket.id,
  });

  // Styles
  const classes = useStyles();
  
  // Refs
  const imgDown = React.useRef(null);
  const jsonDown = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const toolsRef = React.useRef(null);
  const strokeRef = React.useRef('#f6b73c');
  const fillRef = React.useRef('#f6b73c');

  // Redux store & reducers
  const dispatch = useDispatch();

  // Messaging
  const [actiontype, setActiontype] = React.useState('success')
  const [message, setMessage] = React.useState('');
  //Snackbar section begin
  
  const [snackstate, setSnacktate] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });
  const { vertical, horizontal, open } = snackstate;
  // const handleClickSnack = (newState) => () => {
  //   setSnacktate({ open: true, ...newState });
  // };
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
  // console.log('key exist: ',localStorage.getItem("username") === null)
  // console.log('isNumeric', isNumeric(localStorage.getItem('whiteboard.zoom')))
  // Canvas
  let mousepressed = false;
  let wheeling;
  const [currentZoom, setCurrentZoom] = React.useState(localStorage.getItem('whiteboard.zoom'))
  const [currentFile, setCurrentFile] = React.useState('')
  const [activeobject, setActiveobject] = React.useState(null)
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
// console.log('outside')
// console.log(isConnectedToSocket)
// console.log(connectedToRoom)

  useEffect(() => {
    const sketchWrapper = document.getElementById('sketchWrapper');
    let sketchWrapper_style = getComputedStyle(sketchWrapper);
    setIsConnectedToSocket(socket.connected)
console.info('socket, isConnectedToSocket, connectedToRoom #1 useEffect')
console.info(socket, isConnectedToSocket, connectedToRoom)
// console.info('connectedSocket, disconnectedSocket (socketcontext)  #1 useEffect')
// console.info(connectedSocket, disconnectedSocket)

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
      if (canvasRef.current) {

        canvasRef.current.on('path:created', function(e){
          if (e.path) {
            if(e.path.owner === connection.email) return
console.info('path:created', e.path)
console.info(e.path.owner, connection.email)
// console.log(JSON.stringify(e.path))
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
        })

        canvasRef.current.on('selection:created', function(options){
console.log('selection:created', options)
          setActiveobject(options.target)
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
          if (options.target) {
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
console.log(canvasRef.current.getZoom())
        loadSavedState();
      }
      
  },[canvasRef.current])

  useEffect(() => {
    setIsConnectedToSocket(socket.connected)
// console.info('connectedSocket, disconnectedSocket (socketcontext)  #2 useEffect')
// console.info(connectedSocket, disconnectedSocket)

console.info('socket, isConnectedToSocket, connectedToRoom #2 useEffect')
console.info(socket, isConnectedToSocket, connectedToRoom)
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

  // Agree Child functions
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
console.log('whole canvas sende')
    AddJsonEmitter({
      obj: JSON.stringify(canvasRef.current), 
      //id: object.id,
      name: connection.name,
      email: connection.email,
      room: connection.room,
      action:'onJSONSended',
      zoom: canvasRef.current.getZoom(),
    })
  }

  // Toolbar Child functions
  const setStrokeColor = (data) => {
    strokeRef.current = data
// console.log(strokeRef.current)
//console.log(activeobject)
    activeobject.set({stroke:strokeRef.current})
    canvasRef.current.requestRenderAll();
  }

  const setFillColor = (data) => {
    fillRef.current = data;
    activeobject.set({fill:fillRef.current})
    canvasRef.current.requestRenderAll();
  }

  const selectTool = (data) => {
    console.log(data)
    if( data !== null){
      //setTool(nextView);
      toolsRef.current=data;
    }
    canvasRef.current.isDrawingMode = (toolsRef.current === drawingMode.pencil) ? true : false;
    canvasRef.current.selection = (toolsRef.current === drawingMode.pan || toolsRef.current === drawingMode.select) ? true : false;
// console.log('selection')
// console.log(canvasRef.current.selection)
    if (data === drawingMode.pencil) {
      updateFreeDrawingBrush();
    }
  }

  const objectButtons = (data) => {}

  // Toolbar section end

  // Functions
  const getCanvasPosition = (el) => {
    var viewportOffset = el.getBoundingClientRect();
    // these are relative to the viewport, i.e. the window
    return {top:viewportOffset.top, left:viewportOffset.left}
  }

  const initFabricCanvas = () => {
    canvasRef.current = new fabric.Canvas('canvas',{
      isDrawingMode: false,
      lineWidth: 5,
      topContextMenu: true,
      fireRightClick: true,
      freeDrawingBrush:{
        color:strokeRef.current,
        width: 5
      }
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
  }

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

  const loadSavedState = () => {
//console.log('loadsavedata')
    const zoom = localStorage.getItem('whiteboard.zoom')//parseFloat(localStorage.getItem('whiteboard.zoom')).toFixed(4);
    setCurrentZoom(zoom)
    if(localStorage.getItem('whiteboard.data') && tryParseJSONObject(localStorage.getItem('whiteboard.data'))) {
      canvasRef.current.loadFromJSON(localStorage.getItem('whiteboard.data'), function() {
        canvasRef.current.requestRenderAll();
      },function(o,object){
  //console.log(o,object)
  object.scale(o.scaleX, o.scaleY)
      });
      if(localStorage.getItem('whiteboard.zoom')){
        const zoom = parseFloat(localStorage.getItem('whiteboard.zoom')).toFixed(4);
        setCurrentZoom(zoom)
        canvasRef.current.zoomToPoint({ x: parseFloat(canvasRef.current.width), y: parseFloat(canvasRef.current.height) }, zoom);
      }
    }
  }

  const updateFreeDrawingBrush = () => {
    canvasRef.current.freeDrawingBrush.color = strokeRef.current;
    canvasRef.current.freeDrawingBrush.width = 5;
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
        strokeWidth: 5,
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
        strokeWidth: 5,
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
        strokeWidth: 5,
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
        strokeWidth: 5,
        fill: 'transparent',
        dirty: false,
      })
    } else if (type === 'FilledCircle') {
      object = new fabric.Circle({
        radius: 50,
        stroke: strokeRef.current,
        strokeWidth: 5,
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
        strokeWidth: 5,
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

  const canvasFn = (canvas) => {
    const offset = getCanvasPosition(document.getElementById('canvas'));
    let origX, origY, drawingObject = null;
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
        default:
          break;
      }
    })

    canvas.on('mouse:down', function(e) {
      const event = e.e;
      mousepressed = true;
// console.log(e.button)
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
          this.isDrawingMode = true;
          this.setCursor('crosshair');
          updateFreeDrawingBrush();
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
        drawingObject.owner = connection.email;
        
// console.log('mouse up drawinObject')
        //canvas.remove(drawingObject);
        //if(dropObject(drawingObject, canvas, drawingObject.id)){
        const modifiedObj = {
          obj: drawingObject,
          id: drawingObject.id,
          name: connection.name,
          email: connection.email,
          room: connection.room,
          action:'object:added',
        }
        //canvas.remove(drawingObject);
        AddObjectEmitter(modifiedObj)
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
/**/
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

  return (
      <React.Fragment>
        <a ref={imgDown} hidden href="" />
        <a ref={jsonDown} hidden href="" />
        <input type="file" ref={fileInputRef} onChange={filesSelected} hidden />
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
        <ConnectonDecideDialog
          agreeToConnect={agreeToConnect}
          connected={isConnectedToSocket}
          connectedToRoom={connectedToRoom}
        />
        <BoardActionMessage
          actiontype={actiontype}
          message={message}
        />
        <BoardToolbar
          agreeToConnect={agreeToConnect}
          connected={isConnectedToSocket}
          connectedToRoom={connectedToRoom}
          setFillColor={setFillColor}
          setStrokeColor={setStrokeColor}
          selectTool={selectTool}
          groupUngroup={groupUngroup}
          addShape={addShape}
          loadAll={loadAll}
          saveAll={saveAll}
          clearAll={clearAll}
          dummyCB={(e)=>{alert('Dummy')}}
          pushJSON={pushJSON}
        />
      </React.Fragment>
  );
}

export default Board5;