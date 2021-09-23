import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import io from 'socket.io-client';
import PropTypes from 'prop-types'
import { useAuth0 } from '@auth0/auth0-react';
import useSocket from 'use-socket.io-client';

//Material
import { makeStyles } from '@mui/styles';
import { styled, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';


// custom
// import {SketchField, Tools} from 'react-sketch';
import { SketchField, Tools } from "../../pages/admin/Whiteboard/src";
import WBToolbar from '../../../pages/admin/Whiteboard/WBToolbar';
import dataJson from "../../pages/admin/Whiteboard/src/data.json";

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
}

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
    // borderWidth: '1px',
    // borderStyle: 'dashed', 
    // borderColor: 'black', //theme.palette.primary.main, 
    backgroundColor: theme.palette.secondary.light,
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  },
  sketch: {
    width:'100%',
    height:'100%',
    // borderWidth: '1px',
    // borderStyle: 'dashed', 
    // borderColor: 'black',
    // backgroundColor: theme.palette.secondary.light
  },
}));

const SketchWrapper = styled('div')(({ theme }) => ({
  
  // display: 'flex',
  // flexWrap: 'wrap',
  // alignItems: 'center',
  // justifyContent: 'flex-start',
  position:'relative',
  // top:0,
  // left:0,
  // padding: 0,
  width: '100%',
  height:'100%',
  // border: '2px sild red',
  //backgroundColor: theme.palette.secondary.light
  
}));

let headers = new Headers();
headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
headers.append('Access-Control-Allow-Credentials', 'true');


const Board2 = (props) => {
  const classes = useStyles();
  const imgDown = useRef();
  const canvasRef = useRef();

  let sketchWrapper = null;
  const [socket] = useSocket('http://localhost:4000', {
    withCredentials: true,
    headers: headers
  });
  socket.connect();

  const { user } = useAuth0();
  const { name, picture, email } = user;

  const [connection, setConnection] = useState({
    username: name,
    roomname: 'whiteboardRoom',
    socket: socket,
    socketid: socket.id,
  });

  const [canvasoption, setCanvasoption] = useState({
    canvasWidth:0,
    canvasHeight:0,
  })

  const [sketcher, setSketcher] = useState({
    lineWidth: 3,
    lineColor: "#f6b73c",
    fillColor: "#68CCCA",
    backgroundColor: "transparent",
    shadowWidth: 0,
    shadowOffset: 0,
    tool: Tools.DefaultTool,
    enableRemoveSelected: false,
    fillWithColor: false,
    fillWithBackgroundColor: false,
    drawings: [],
    canUndo: false,
    canRedo: false,
    controlledSize: false,
    sketchWidth: 600,
    sketchHeight: 600,
    stretched: true,
    stretchedX: false,
    stretchedY: false,
    originX: "left",
    originY: "top",
    imageUrl: "https://files.gamebanana.com/img/ico/sprays/4ea2f4dad8d6f.png",
    /* expandTools: false,
    expandControls: false,
    expandColors: false,
    expandBack: false,
    expandImages: false,
    expandControlled: false, */
    text: "add text",
    enableCopyPaste: true,
  });

  const [canvasData, setCanvasData] = useState()
  const tools = {
    "Select": Tools.Select, 
    "Pencil": Tools.Pencil,
    "Line": Tools.Line,
    "Rectangle": Tools.Rectangle,
    "RectangleLabel": Tools.RectangleLabel,
    "Circle": Tools.Circle,
    "Pan": Tools.Pan,
    "Highlighter": Tools.Highlighter,
    "DefaultTool": Tools.DefaultTool
  };

  let _sketch = canvasRef.current;
  let timeout = null;

  useEffect(() => {
    socket.on('connect', () => {
      setConnection({...connection, socketid: socket.id });
      //console.log(connection, socket)
    })
    socket.emit('joinRoom', {username: connection.username, roomname: connection.roomname})
    socket.on('connection-message', (response) => {
      console.log('connection-message: ', response)
      setConnection({...connection, username: response.username});
      setConnection({...connection, socketid: response.socketid});
    })
    socket.off('onObjectAdded')
    socket.on('onObjectAdded', (response) => {
      console.log('onObjectAdded: ', response)
      canvasRef.current.fromJSON(response)
      canvasRef.current.render()
      console.log(canvasRef.current)
    })
    
    sketchWrapper = document.getElementById('sketch');
    let sketchWrapper_style = getComputedStyle(sketchWrapper);
    setCanvasoption({...canvasoption, 
      canvasWidth: parseInt(sketchWrapper_style.getPropertyValue('width')),
      canvasHeight: parseInt(sketchWrapper_style.getPropertyValue('height'))
    });
    
    function handleResize() {
      let sketchWrapper_style = getComputedStyle(sketchWrapper);
      let width = parseInt(sketchWrapper_style.getPropertyValue('width'));
      let height = parseInt(sketchWrapper_style.getPropertyValue('height'))
      if (!(width === 0) || !(height === 0))
        setCanvasoption({...canvasoption, 
          canvasWidth: width,
          canvasHeight: height
        });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    

    // console.log("didmount")
    // console.log(Tools)
    // console.log(canvasoption)
    
   // (function (console) {
      console.save = function (data, filename) {
        if (!data) {
          console.error("Console.save: No data");
          return;
        }
        if (!filename) filename = "console.json";
        if (typeof data === "object") {
          data = JSON.stringify(data, undefined, 4);
        }
        var blob = new Blob([data], { type: "text/json" }),
          e = document.createEvent("MouseEvents"),
          a = document.createElement("a");
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
        e.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        a.dispatchEvent(e);
      };
    //})(console);
    return () => window.removeEventListener("resize", handleResize);
  },[socket])

  // useEffect(()=>{
  //   setCanvasoption({...canvasoption, canvasWidth: sketchWrapper.offsetWidth});
  //   setCanvasoption({...canvasoption, canvasHeight: sketchWrapper.offsetHeight});
  //   console.log(canvasoption)
  // },[sketchWrapper.offsetWidth, sketchWrapper.offsetHeight])

  const _save = () => {
    let drawings = sketcher.drawings;
    drawings.push(_sketch.toDataURL());
    //this.setState({ drawings: drawings });
    setSketcher({...sketcher, drawings: drawings})
    console.log(sketcher.drawings)
  };

  const _download = () => {
    //console.save(_sketch.toDataURL("image/png"), "toDataURL.png");
    console.save(JSON.stringify(_sketch.toJSON()), "toDataJSON.txt");

    /*eslint-enable no-console*/

    
    let event = new Event("click", {});

    imgDown.current.href = _sketch.toDataURL("image/png");
    imgDown.current.download = "toPNG.png";
    imgDown.current.click() //dispatchEvent(event);
  };

  const _undo = () => {
    _sketch.undo();
    // this.setState(prevState => ({
    //   sketcher:{
    //     ...prevState.sketcher,
    //     canUndo: _sketch.canUndo(),
    //     canRedo: _sketch.canRedo(),
    //   }
    // }));
    setSketcher({...sketcher,
      canUndo: _sketch.canUndo(), 
      canRedo: _sketch.canRedo()
    })
  };

  const _redo = () => {
    _sketch.redo();
    setSketcher({...sketcher,
      canUndo: _sketch.canUndo(), 
      canRedo: _sketch.canRedo()
    })
  };

  const _clear = () => {
    _sketch.clear();
    _sketch.setBackgroundFromDataUrl("");
    setSketcher({...sketcher,
      controlledValue: null,
      backgroundColor: "transparent",
      fillWithBackgroundColor: false,
      canUndo: _sketch.canUndo(), 
      canRedo: _sketch.canRedo()
    })
  };
  
  const _removeMe = (index) => {
    let drawings = sketcher.drawings;
    drawings.splice(index, 1);
    setSketcher({...sketcher, drawings: drawings });
  };

  const _removeSelected = () => {
    _sketch.removeSelected();
  };

  const _onSketchChange = () => {
    //console.info('sketch changed fired')
    let prev = sketcher.canUndo;
    let now = _sketch.canUndo();
    //console.error(prev, now)
    if (prev !== now) {
      setSketcher({...sketcher, canUndo: now }); 
    }
    
  };

  const _onBackgroundImageDrop = (accepted /*, rejected*/) => {
    if (accepted && accepted.length > 0) {
      let sketch = _sketch;
      let reader = new FileReader();
      let { stretched, stretchedX, stretchedY, originX, originY } = sketcher;
      reader.addEventListener(
        "load",
        () =>
          sketch.setBackgroundFromDataUrl(reader.result, {
            stretched: stretched,
            stretchedX: stretchedX,
            stretchedY: stretchedY,
            originX: originX,
            originY: originY,
          }),
        false
      );
      reader.readAsDataURL(accepted[0]);
    }
  };
  const options = {
    fontFamily: 'inherit',
    fontSize:20,
    fill: sketcher.lineColor,
    lineHeight: 1.1,
  }
  const _addText = () => {
    _sketch.addText(sketcher.text, options);
    _changeTool('Select')
  };

  const _linecolor = (value) => {
    console.log('value: ',value)
    const color = value;
    console.log('current state linecolor: ',sketcher.lineColor)
    setSketcher({...sketcher,lineColor: value})    
    console.log('in setstate linecolor',sketcher.lineColor)
  }

  const _changeTool = (value) => {
    console.log(value)
    console.log(tools[value])
    if(value === 'Color') {
      _linecolor('black');
    } else {
      let tool = tools[value];
      setSketcher({...sketcher,
        tool: tool,
        enableRemoveSelected: tool === Tools.Select,
        enableCopyPaste: tool === Tools.Select,
      });
    }
  }

  const _selectTool = (event) => {
    setSketcher({...sketcher,
      tool: event.target.value,
      enableRemoveSelected: event.target.value === Tools.Select,
      enableCopyPaste: event.target.value === Tools.Select,
    });
  };
  const actions = [
    { icon: <FileCopyIcon />, name: 'Copy', cb: _undo},
    { icon: <SaveIcon />, name: 'Save',  cb: _redo },
    { icon: <PrintIcon />, name: 'Print', cb: _addText},
    { icon: <ShareIcon />, name: 'Share' },
  ];
  return (
    <React.Fragment>
      <a ref={imgDown} hidden href="" />
      <SketchWrapper id="sketch">
        <SketchField
          width={canvasoption.canvasWidth}
          height={canvasoption.canvasHeight}
          /* width={sketcher.controlledSize ? sketcher.sketchWidth : null}
          height={sketcher.controlledSize ? sketcher.canvas.height : null} */
          className={classes.board} 
          name="sketch"
          /* ref={(c) => (_sketch = c)} */
          ref={canvasRef}
          lineColor={sketcher.lineColor}
          lineWidth={sketcher.lineWidth}
          fillColor={sketcher.fillWithColor ? sketcher.fillColor : "transparent"}
          backgroundColor={sketcher.fillWithBackgroundColor ? sketcher.backgroundColor : "transparent"}
          defaultValue={canvasData}
          /* value={sketcher} */
          forceValue
          onChange={_onSketchChange}
          tool={sketcher.tool}
          socket={connection.socket}
          socketEventNames={['onObjectAdded','onObjetcModified', 'onObjectRemoved']}
        />
      </SketchWrapper>
      <WBToolbar 
          changeLineColorEvent={_linecolor}
          defaultLineColorProp={sketcher.lineColor}
          changeToolEvent={_changeTool}
          removeSelectedProp={sketcher.enableRemoveSelected}
          removeSelectedEvent={_removeSelected}
          canUndoProp={sketcher.canUndo}
          canUndoEvent={_undo}
          canRedoProp={sketcher.canRedo}
          canRedoEvent={_redo}
          addTextEvent={_addText}
          saveEvent={_save}
          downloadEvent={_download}
          
        />
       {/*  <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 92, right: 16 }}
        icon={<SpeedDialIcon />}
        direction='left'
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            onClick={action.cb}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        direction='left'
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            onClick={action.cb}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box> */}
    </React.Fragment>
  )
}

export default Board2
