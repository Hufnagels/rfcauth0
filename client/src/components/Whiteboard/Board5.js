import React, { useEffect, useState, useRef, useLayoutEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  AddDrawEmitter,
  AddObjectEmitter, 
  ModifyObjectEmitter, 
  RemoveObjectEmitter,
  AddDrawListener,
  AddObjectListener, 
  ModifyObjectListener, 
  RemoveObjectListener
} from './board_socket_emitters_listeners';
import { socket } from '../../features/context/socketcontext_whiteboard';
import { 
  statechange,
} from '../../redux/reducers/whiteboardSlice';

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

function tryParseJSONObject (jsonString){
  try {
      var o = JSON.parse(jsonString);

      // Handle non-exception-throwing cases:
      // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
      // but... JSON.parse(null) returns null, and typeof null === "object", 
      // so we must check for that, too. Thankfully, null is falsey, so this suffices:
      if (o && typeof o === "object") {
          return o;
      }
  }
  catch (e) { }

  return false;
};

const Board5 = (props) => {
  // Styles
  const classes = useStyles();
  // Refs
  const imgDown = React.useRef();
  const jsonDown = React.useRef();
  const fileInputRef = React.useRef();
  const canvasRef = React.useRef(null);
  const toolsRef = React.useRef(null);

  const strokeRef = React.useRef('#f6b73c');
  const fillRef = React.useRef('#f6b73c');

  // Authentication
  const { user } = useAuth0();
  const { name, picture, email } = user;

  // Redux store & reducers
  const dispatch = useDispatch();

  // Socket
  const [connected, setConnected] = React.useState(false)
  const [connection, setConnection] = useState({
    username: name,
    roomname: 'whiteboardRoom',
    email:email,
    socket: {}, //socket,
    socketid: '', //socket.id,
  });
  
  //Snackbar section begin
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
  const [currentFile, setCurrentFile] = React.useState('')
  
  // ToggleButtonGroup
  const [lineColor, setLineColor] = useState('#f6b73c')
  const [strokeColor, setStorkeColor] = useState('#f6b73c')
  const [tool, setTool] = React.useState(null);
  const handleToolChange = (event, nextView) => {
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


  const setStrokeColor = (data) => {
    strokeRef.current = data
    console.log(strokeRef.current)
  }
  const setFillColor = (data) => {
    fillRef.current = data;
  }
  const selectTool = (data) => {
    console.log(data)
    if( data !== null){
      //setTool(nextView);
      toolsRef.current=data;
    }
    canvasRef.current.isDrawingMode = (toolsRef.current === drawingMode.pencil) ? true : false;
    canvasRef.current.selection = (toolsRef.current === drawingMode.pan || toolsRef.current === drawingMode.select) ? true : false;
    console.log('selection')
    console.log(canvasRef.current.selection)
    if (data === drawingMode.pencil) {
      updateFreeDrawingBrush();
    }
  }
  const objectButtons = (data) => {}
  // Canvas 
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
    socket.on('welcome-message', (response) => {
      setConnection({
        ...connection, 
        socketid: response.userId,
      })
// console.log('response', response)
// console.log('response connection', connection)
    })
    
  }

  useEffect(() => {
    if(socket && socket.connected) { 
      setConnected(true);
      initSocketConnection();
    }
  },[socket])

  useEffect(() => {
    const sketchWrapper = document.getElementById('sketchWrapper');
    let sketchWrapper_style = getComputedStyle(sketchWrapper);
    //setCanvas(canvasRef.current);
console.log(socket)
    //initSocketConnection();
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
console.info('W-H: ', width, height)
      }
    }
    window.addEventListener('resize', onResize, false);
    onResize();
//console.error(tryParseJSONObject(localStorage.getItem('whiteboard.data')))
    if(localStorage.getItem('whiteboard.data') && tryParseJSONObject(localStorage.getItem('whiteboard.data'))) {
      canvasRef.current.loadFromJSON(localStorage.getItem('whiteboard.data'), function() {
        canvasRef.current.requestRenderAll();
        
        
        if(localStorage.getItem('whiteboard.zoom')){
          const zoom = parseFloat(localStorage.getItem('whiteboard.zoom')).toFixed(4);
          setCurrentZoom(zoom)
          canvasRef.current.zoomToPoint({ x: parseFloat(canvasRef.current.width)*.6, y: parseFloat(canvasRef.current.height)*.6 }, zoom);
        }
        //canvasRef.current.setZoom(localStorage.getItem('whiteboard.zoom'))
       
      });
    }

    return () => {
      window.removeEventListener("resize", onResize);
      // socket.disconnect();
      console.log(connection)
      socket.emit('leave-WhiteboardRoom', socket.id);
      //dispatch(removeuser(socket.id))
      //socket.disconnect();
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
              username: connection.username,
              email: connection.email,
              roomname: connection.roomname,
              action:'path:created',
            }
            AddDrawEmitter(modifiedObj)
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
              action:'object:modified',
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
              username: connection.username,
              email: connection.email,
              roomname: connection.roomname,
              action:'object:moving',
            }
            ModifyObjectEmitter(modifiedObj)
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
              action:'object:removed',
            }
            RemoveObjectEmitter(removedObj)
          }
        })

        canvasRef.current.on('object:added', function(options){
console.log('object:added')
console.log(options.target)
console.log(options.target.getBoundingRect())

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

        AddDrawListener(canvasRef.current)
        AddObjectListener(canvasRef.current)
        ModifyObjectListener(canvasRef.current)
        RemoveObjectListener(canvasRef.current)
      }
      
  },[canvasRef.current])

  const updateFreeDrawingBrush = () => {
    canvasRef.current.freeDrawingBrush.color = strokeRef.current;
    canvasRef.current.freeDrawingBrush.width = 5;
  }

  const addShape = (e) => {
    let type = e.target.name || e.currentTarget.name;
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
      });

    } else if (type === 'FilledRectangle') {
      object = new fabric.Rect({
        height: 75,
        width: 150,
        stroke: strokeRef.current,
        strokeWidth: 5,
        fill: strokeRef.current,
        transparentCorners: false,
        globalCompositeOperation: "source-over",
        clipTo: null,
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
      })

    } else if (type === 'Circle') {
      object = new fabric.Circle({
        radius: 50,
        stroke: strokeRef.current,
        strokeWidth: 5,
        fill: 'transparent',
      })
    } else if (type === 'FilledCircle') {
      object = new fabric.Circle({
        radius: 50,
        stroke: strokeRef.current,
        strokeWidth: 5,
        fill: strokeRef.current,
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
      username: connection.username,
      email: connection.email,
      roomname: connection.roomname,
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
        username: connection.username,
        email: connection.email,
        roomname: connection.roomname,
        action:'object:added',
      }
      AddDrawEmitter(modifiedObj)
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
          username: connection.username,
          email: connection.email,
          roomname: connection.roomname,
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

  const canvasAllToJson = (json, toJson = true) => {
    const date = new Date();
    const data = JSON.stringify(json);
    //if(toJson) json = data;
    const object = {
      board: (toJson ? data:json),
      username: connection.username,
      date: date.toUTCString('yyy-mm-dd hh:mm:ss'),
      timestamp: date.getTime()
    }
    localStorage.setItem('whiteboard.data',data)
    localStorage.setItem('whiteboard.username',object.username)
    localStorage.setItem('whiteboard.date',object.date)
    localStorage.setItem('whiteboard.timestamp',object.timestamp)
    return object;
  }
/**/
const saveAll = (e, filename = 'canvas') => {
  e.preventDefault();
  const json = JSON.stringify(canvasRef.current);
  const object = canvasAllToJson(canvasRef.current, false);
  //object.board = canvasRef.current;
console.info(currentFile)
  if (currentFile) {
    filename = currentFile.replace(/\.[^/.]+$/, "");
  } else {
    filename += '_' + object.username + '_' + object.timestamp;
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
    // custom object converted to json (username, board, date, timestamp)
    let json = '';
    const parsedData = JSON.parse(data);
    if (parsedData && parsedData.board) {
      //custom json
      json = JSON.stringify(parsedData.board)
    } else if (typeof parsedData.board === 'undefined'){
      // simple json
      json = data;
    }
    canvasRef.current.clear();
    canvasRef.current.loadFromJSON(json, function() {
      canvasRef.current.requestRenderAll();
    },function(o,object){
//console.log(o,object)
    });
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
    e.preventDefault();
    fileInputRef.current.click();
    return
  }

  const clearAll = (e) => {
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
        <BoardToolbar
          setFillColor={setFillColor}
          setStrokeColor={setStrokeColor}
          selectTool={selectTool}
          addShape={addShape}
          loadAll={loadAll}
          saveAll={saveAll}
          clearAll={clearAll}
        />
      </React.Fragment>
  );
}

export default Board5;