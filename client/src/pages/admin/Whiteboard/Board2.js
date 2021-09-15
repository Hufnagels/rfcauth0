import React, { useEffect, useState} from 'react'
import io from 'socket.io-client';
import PropTypes from 'prop-types'
import { useAuth0 } from '@auth0/auth0-react';
import useSocket from 'use-socket.io-client';

//Material
import { makeStyles } from '@mui/styles';
import { styled, useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

// custom
// import {SketchField, Tools} from 'react-sketch';
import { SketchField, Tools } from "./src";
import WBToolbar from './WBToolbar';
import dataJson from "./src/data.json";

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
// headers.append('Content-Type', 'application/json');
// headers.append('Accept', 'application/json');
headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
headers.append('Access-Control-Allow-Credentials', 'true');
// headers.append('GET', 'POST', 'OPTIONS');

const Board2 = (props) => {
  const classes = useStyles();

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
    lineWidth: 10,
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
    expandTools: false,
    expandControls: false,
    expandColors: false,
    expandBack: false,
    expandImages: false,
    expandControlled: false,
    text: "add text",
    enableCopyPaste: false,
  });

  const tools = {
    "Select": Tools.Select, 
    "Pencil": Tools.Pencil,
    "Line": Tools.Line,
    "Rectangle": Tools.Rectangle,
    "Circle": Tools.Circle,
    "DefaultTool": Tools.DefaultTool
  };

  let _sketch = null;

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
    let sketch = document.getElementById('sketch');
    let sketch_style = getComputedStyle(sketch);
    setCanvasoption({...canvasoption,
      canvasWidth:parseInt(sketch_style.getPropertyValue('width')),
      canvasHeight:parseInt(sketch_style.getPropertyValue('height'))
    })

    console.log("didmount")
    console.log(Tools)
    console.log(canvasoption)
  },[socket])

  const _save = () => {
    let drawings = sketcher.drawings;
    drawings.push(_sketch.toDataURL());
    //this.setState({ drawings: drawings });
    setSketcher({...sketcher, drawings: drawings})
    console.log(sketcher.drawings)
  };

  const _download = () => {
    console.save(_sketch.toDataURL(), "toDataURL.txt");
    console.save(JSON.stringify(_sketch.toJSON()), "toDataJSON.txt");

    /*eslint-enable no-console*/

    let { imgDown } = this.refs;
    let event = new Event("click", {});

    imgDown.href = _sketch.toDataURL();
    imgDown.download = "toPNG.png";
    imgDown.dispatchEvent(event);
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
    let prev = sketcher.canUndo;
    let now = _sketch.canUndo();
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

  const _addText = () => _sketch.addText(sketcher.text);

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

  return (
    <React.Fragment>
      <SketchWrapper id="sketch">
        <SketchField
          width={canvasoption.canvasWidth}
          height={canvasoption.canvasHeight}
          /* width={sketcher.controlledSize ? sketcher.sketchWidth : null}
          height={sketcher.controlledSize ? sketcher.canvas.height : null} */
          className={classes.board} 
          name="sketch"
          ref={(c) => (_sketch = c)}
          lineColor={sketcher.lineColor}
          lineWidth={sketcher.lineWidth}
          fillColor={
            sketcher.fillWithColor ? sketcher.fillColor : "transparent"
          }
          backgroundColor={
            sketcher.fillWithBackgroundColor ? sketcher.backgroundColor : "transparent" 
          }
          defaultValue={dataJson}
          /* value={sketcher} */
          forceValue
          onChange={_onSketchChange}
          tool={sketcher.tool}
        />
      </SketchWrapper>
      {console.log('Render linecolor: ', sketcher.lineColor)}
      <WBToolbar 
          changeLineColor={_linecolor}
          defaultLineColor={sketcher.lineColor}
          changeTool={_changeTool}
        />
        
    </React.Fragment>
  )
}

export default Board2
