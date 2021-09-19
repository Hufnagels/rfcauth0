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
import dataJson from "./src/data.json";

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
import ToolbarWrapper from '../../../components/ToolbarWrapper';
import { nominalTypeHack } from 'prop-types';
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
    canvasRef.current.isDrawingMode = (toolsRef.current === drawingModes.pencil) ? true : false;
    canvasRef.current.selection = (toolsRef.current === drawingModes.pan || toolsRef.current === drawingModes.select) ? true : false;
    if (nextView === drawingModes.pencil) {
      updateFreeDrawingBrush();
    }
  };
  const drawingModes = {
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
    socket: null, //socket,
    socketid: null, //socket.id,
  });

  let canvas = null;
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
  const [canvasData, setCanvasData] = useState(dataJson)

  const getCanvasPosition = (el) => {
    var viewportOffset = el.getBoundingClientRect();
    // these are relative to the viewport, i.e. the window
    return {top:viewportOffset.top, left:viewportOffset.left}
  }

  useEffect(() => {

    socket.on('connect', () => {
      setConnection({...connection, 
        socket,
        socketid: socket.id 
      });
    })
    socket.emit('joinRoom', {username: connection.username, roomname: connection.roomname})
    socket.on('connection-message', (response) => {
      console.log('connection-message: ', response)
      setConnection({...connection, username: response.username});
      setConnection({...connection, socketid: response.socketid});
    })
    //socket.off('onObjectAdded')
    socket.on('onObjectAdded', (response) => {
      console.log('onObjectAdded: ', response)
      canvasRef.current.fromJSON(response)
      canvasRef.current.render()
      console.log(canvasRef.current)
    })
    
    const sketchWrapper = document.getElementById('sketchWrapper');
    let sketchWrapper_style = getComputedStyle(sketchWrapper);
    //const canvas = new fabric.Canvas('canvas');
    canvasRef.current = new fabric.Canvas('canvas',{
      isDrawingMode: false,
      lineWidth: 5,
      freeDrawingBrush:{
        color:colorsRef.current,
        width: 5
      }
    });
    
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

    canvasFn(canvasRef.current);
    
    return () => {
      window.removeEventListener("resize", onResize);
      socket.off();
    }
  },[socket])

  useEffect(() => {console.log('Tool useEffect',tool)},[tool])

  const loadData = (canvas) => {
    canvas.loadFromJSON(canvasData, () => {
      console.info(canvasData)
      canvas.renderAll();
    })
  }

  const updateFreeDrawingBrush = () => {
    canvasRef.current.freeDrawingBrush.color = colorsRef.current;
    canvasRef.current.freeDrawingBrush.width = 5;
  }
  const canvasFn = (canvas) => {
    const offset = getCanvasPosition(document.getElementById('canvas'));
// console.log(offset)
// console.log('canvasFn', canvas)
    let origX, origY, drawingObject = null;
    canvas.selectionColor = 'rgba(0,255,0,0.3)';
    // canvas.selectionBorderColor = 'red';
    // canvas.selectionLineWidth = 2;
// console.info(canvas.selectionColor, canvas.selectionBorderColor, canvas.selectionLineWidth)
    
    loadData(canvas);

    canvas.on('mouse:move', function(e) {
      const event = e.e;
      if(mousepressed) console.info('mouse:move toolsRef',toolsRef.current)
      //Pan
      //if (mousepressed && toolsRef.current == drawingModes.pan && this.isDragging) {
      if (toolsRef.current == drawingModes.pan && this.isDragging) {
        console.info('begin pan')
        var vpt = this.viewportTransform;
        vpt[4] += event.clientX - this.lastPosX;
        vpt[5] += event.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = event.clientX;
        this.lastPosY = event.clientY;

      } else if (this.isDrawingMode && toolsRef.current === drawingModes.pencil) {
        this.isDrawingMode = true;
      } else if((toolsRef.current === drawingModes.rect || toolsRef.current === drawingModes.fillrect)){
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
      } else if((toolsRef.current === drawingModes.circle || toolsRef.current === drawingModes.fillcircle)){
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
      }
    })

    canvas.on('mouse:down', function(e) {
      const event = e.e;
      mousepressed = true;
      
console.info('mouse:down event',e)
      if (event.altKey === true ) {
        this.setCursor('grab')
        canvasRef.current.selection = false;
        canvasRef.current.isDrawingMode = false;
        this.isDragging = true;
        this.lastPosX = event.clientX;
        this.lastPosY = event.clientY;
      } else if (toolsRef.current === drawingModes.pencil) {
        this.isDrawingMode = true;
        this.setCursor('crosshair')
        this.requestRenderAll()
      } else if(toolsRef.current === drawingModes.fillrect){
        if (e.target !== null) return
        canvasRef.current.selection = false;
        var pointer = canvas.getPointer(event.e);
        origX = pointer.x;
        origY = pointer.y;
        drawingObject = new fabric.Rect({
            left: origX,
            top: origY,

            width: pointer.x-origX,
            height: pointer.y-origY,
            angle: 0,
            selectable:true,
            fill: colorsRef.current,
            transparentCorners: false,
            globalCompositeOperation: "source-over",
            clipTo: null,
        });
        drawingObject.id = uuid();
        canvas.add(drawingObject);
      } else if(toolsRef.current === drawingModes.rect){
        if (e.target !== null) return
        canvas.selection = false;
        var pointer = canvas.getPointer(event.e);
        origX = pointer.x;
        origY = pointer.y;
        var pointer = canvas.getPointer(event.e);
        drawingObject = new fabric.Rect({
            left: origX,
            top: origY,
            // originX: 'left',
            // originY: 'top',
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
        drawingObject.id = uuid();
        canvas.add(drawingObject);
      } else if(toolsRef.current === drawingModes.circle) {
        if (e.target !== null) return
        var pointer = canvas.getPointer(event);
        origX = pointer.x;
        origY = pointer.y;
        drawingObject = new fabric.Circle({
            left: origX,
            top: origY,
            // originX: 'left',
            // originY: 'top',
            radius: pointer.x-origX,
            angle: 0,
            fill: '',
            stroke: colorsRef.current,
            strokeWidth: 5,
            globalCompositeOperation: "source-over",
            clipTo: null,
        });
        drawingObject.id = uuid();
        canvas.add(drawingObject);
      } else if(toolsRef.current === drawingModes.fillcircle) {
        if (e.target !== null) return
        var pointer = canvas.getPointer(event);
        origX = pointer.x;
        origY = pointer.y;
        drawingObject = new fabric.Circle({
            left: origX,
            top: origY,
            // originX: 'left',
            // originY: 'top',
            radius: pointer.x-origX,
            angle: 0,
            fill: colorsRef.current,
            stroke: colorsRef.current,
            strokeWidth: 5,
        });
        drawingObject.id = uuid();
        canvas.add(drawingObject);
      } else if(toolsRef.current === drawingModes.text) {
        if (e.target !== null) return
        var pointer = canvas.getPointer(event.e);
        origX = pointer.x;
        origY = pointer.y;
        drawingObject = new fabric.IText('hello world', { 
          left: origX, 
          top: origY,
          fontWeight: 'normal',
          fontSize: 40,
          textAlign: 'left',
          colorProperties: {
            fill: colorsRef.current
            // stroke 
            // backgroundColor
          },
        })
        drawingObject.id = uuid();
        canvas.add(drawingObject);
      }
    })

    canvas.on('mouse:up', function(e) {
      const event = e.e;
      mousepressed = false;
      this.isDragging = false;
      //canvas.isDrawingMode = false;
      if(drawingObject !== null) {
        canvas.add(drawingObject);
        drawingObject = null;
      }
      origX=null;
      origY=0;
      this.requestRenderAll()
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

    canvas.on('path:created', function(e){
      console.info('path:created')
      console.info(e)
    })
    canvas.on('object:modified', function(e){
      console.info('object:modified')
      console.info(e)
    })
    canvas.on('object:added', function(e){
      console.info('object:added')
      console.info(e)
    })
    canvas.on('object:removed', function(e){
      console.info('object:removed')
      console.info(e)
    })
    canvas.on('selection:created', function(e){
      console.info('selection:created')
      console.info(e)
    })
    
  }

  const _linecolor = (value) => {
    console.log('value: ',value)
    const color = value;
    console.log('current state linecolor: ',sketcher.lineColor)
    setSketcher({...sketcher,lineColor: value})    
    console.log('in setstate linecolor',sketcher.lineColor)
  }
  const _changeTool = (e) => {
    
  }
  const _select = (e) => {
    console.log('_select', e)
  }
  const _removeSelected = (e) => {
    console.log('_removeSelected', e)
  }
  const _addText = (e) => {
    console.log('_addText', e)
    var text = new fabric.Text('Hello world', {
      left: 100,
      top: 100,
      fill: sketcher.lineColor,
      angle: 0
    });
    // canvas.add(text);
    // canvas.renderAll();
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
