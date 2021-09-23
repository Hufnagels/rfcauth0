import * as React from 'react'
import io from 'socket.io-client';
import PropTypes from 'prop-types'
import { withAuth0 } from '@auth0/auth0-react';

//Material
import { styled} from '@mui/material/styles';
import { withStyles } from '@mui/styles';

// custom
// import {SketchField, Tools} from 'react-sketch';
import { SketchField, Tools } from "../../pages/admin/Whiteboard/src";
import WBToolbar from '../../../pages/admin/Whiteboard/WBToolbar';
import dataJson from "../../pages/admin/Whiteboard/src/data.json";

const styles = theme => ({
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
});

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

//@withStyles(styles)
let socket = null;
class Board extends React.Component {
  
  user = this.props.auth0.user;
  timeout = null;
  ctx = null;

  constructor(props) {
    super(props);
    this.state = {
      base64imagedata: null,
      username:'',
      roomname: 'whiteboardRoom',
      socket: null,
      socketid: '',
      canvas: {
        width:'',
        height:'',
      },
      sketcher:{
        lineWidth: 10,
        lineColor: "#f6b73c",
        fillColor: "#68CCCA",
        backgroundColor: "transparent",
        shadowWidth: 0,
        shadowOffset: 0,
        tool: Tools.Pencil,
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
      },
      canvasWidth:0,
      canvasHeight:0,
      lineWidth: 10,
      lineColor: "#f6b73c",
      fillColor: "#68CCCA",
      backgroundColor: "transparent",
      shadowWidth: 0,
      shadowOffset: 0,
      tool: Tools.Pencil,
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
    };

  }
  tools = {
    "Select": Tools.Select, 
    "Pencil": Tools.Pencil,
    "Line": Tools.Line,
    "Rectangle": Tools.Rectangle,
    "Circle": Tools.Circle,
    "Text": this._addText
  };

  componentDidMount(){
    socket = io.connect('http://localhost:4000');
    this.setState({socket:socket})
    socket.on('connect', () => {
      this.setState({socketid:socket.id})
      if (!this.state.username) this.setState({username:this.props.auth0.user.name})
      console.log(this.state.socketid)
      console.log(this.state.username)
      socket.emit('joinRoom', {username: this.username, roomname: this.state.roomname})
    })
    
    let sketch = document.getElementById('sketch');
    let sketch_style = getComputedStyle(sketch);
    // this.setState(prevState => ({
    //   canvas: {                   // object that we want to update
    //       ...prevState.canvas,    // keep all other key-value pairs
    //       width: parseInt(sketch_style.getPropertyValue('width')),       // update the value of specific key
    //       height: parseInt(sketch_style.getPropertyValue('height'))
    //   }
    // }))
    this.setState({
      canvasWidth:parseInt(sketch_style.getPropertyValue('width')),
      canvasHeight:parseInt(sketch_style.getPropertyValue('height'))
    })
    //* pixelRatio * scale.y;
    //this.drawOnCanvas();
    
    this.username = this.props.auth0.user.name;
    
    //this.socket.emit('join', {username: this.username, room: this.state.room})
    console.log("didmount")
    console.log(Tools)
    console.log(this.state.canvas)
  }

  componentWillUnmount() {
    if (socket)
      socket.disconnect();
  }

  drawOnCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;
    console.log('pixelRatio: ',pixelRatio)
    let scale = {x:1,y:1};
    let mouse = {x: 0, y: 0};
    let last_mouse = {x: 0, y: 0};
    
    let canvas = document.getElementById('paint');
    this.ctx = canvas.getContext('2d');
    let ctx = this.ctx;
    let sketch = document.getElementById('sketch');
    let sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width')) //* pixelRatio * scale.x;
    canvas.height = parseInt(sketch_style.getPropertyValue('height')) //* pixelRatio * scale.y;
    let canvasOffset = getCanvasPosition(canvas);
    trackTransforms(ctx);

    let initialState = {
      pixelRatio:pixelRatio,
      canvas: {
        lastImage:null,
        width:canvas.width,
        height:canvas.height,
        offset:canvasOffset,
      },
      scale:{
        x:scale.x,
        y:scale.y,
      }
    }

    // Make our in-memory canvas
    var inMemCanvas = document.createElement('canvas');
    inMemCanvas.width = 100;
    inMemCanvas.height = 100;
    var inMemCtx = inMemCanvas.getContext('2d');

    var scaleFactor = 1.1;
    var lastX=canvas.width/2, lastY=canvas.height/2;
    var zoom = function(clicks){
			var pt = ctx.transformedPoint(lastX,lastY);
			ctx.translate(pt.x,pt.y);
			var factor = Math.pow(scaleFactor,clicks);
			ctx.scale(factor,factor);
			ctx.translate(-pt.x,-pt.y);
			//redraw();
		}

		var handleScroll = function(evt){
			var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
			if (delta) zoom(delta);
			return evt.preventDefault() && false;
		};
		canvas.addEventListener('DOMMouseScroll',handleScroll,false);
		canvas.addEventListener('mousewheel',handleScroll,false);
    function trackTransforms(ctx){
      var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
      var xform = svg.createSVGMatrix();
      ctx.getTransform = function(){ return xform; };
      
      var savedTransforms = [];
      var save = ctx.save;
      ctx.save = function(){
        savedTransforms.push(xform.translate(0,0));
        return save.call(ctx);
      };
      var restore = ctx.restore;
      ctx.restore = function(){
        xform = savedTransforms.pop();
        return restore.call(ctx);
      };
  
      var scale = ctx.scale;
      ctx.scale = function(sx,sy){
        xform = xform.scaleNonUniform(sx,sy);
        return scale.call(ctx,sx,sy);
      };
      var rotate = ctx.rotate;
      ctx.rotate = function(radians){
        xform = xform.rotate(radians*180/Math.PI);
        return rotate.call(ctx,radians);
      };
      var translate = ctx.translate;
      ctx.translate = function(dx,dy){
        xform = xform.translate(dx,dy);
        return translate.call(ctx,dx,dy);
      };
      var transform = ctx.transform;
      ctx.transform = function(a,b,c,d,e,f){
        var m2 = svg.createSVGMatrix();
        m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
        xform = xform.multiply(m2);
        return transform.call(ctx,a,b,c,d,e,f);
      };
      var setTransform = ctx.setTransform;
      ctx.setTransform = function(a,b,c,d,e,f){
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx,a,b,c,d,e,f);
      };
      var pt  = svg.createSVGPoint();
      ctx.transformedPoint = function(x,y){
        pt.x=x; pt.y=y;
        return pt.matrixTransform(xform.inverse());
      }
    }
    //window.addEventListener('resize', resizeCanvas, false);

    // debounce timeout handle
    var debounceTimeoutHandle;
   
    // The debounce time in ms (1/1000th second)
    const DEBOUNCE_TIME = 200; 
   
    // Resize function 
    function debouncedResize () { 
       clearTimeout(debounceTimeoutHandle);  // Clears any pending debounce events
   
    // Schedule a canvas resize 
    debounceTimeoutHandle = setTimeout(resizeCanvas, DEBOUNCE_TIME);
    }
    
    // resize canvas
    function resizeCanvas() {
      inMemCanvas.width = sketch.offsetWidth;
      inMemCanvas.height = sketch.offsetHeight;
      
      scale.x=inMemCanvas.width/initialState.canvas.width;
      scale.y=inMemCanvas.height/initialState.canvas.height;
      inMemCtx.drawImage(canvas, 0, 0);
      inMemCtx.scale(scale.x , scale.y );
      canvas.width = canvas.offsetWidth  * scale.x;
      canvas.height = canvas.offsetHeight  * scale.y;
      
console.error(canvas.width,inMemCanvas.width,canvas.height,inMemCanvas.height)
console.error(getCanvasPosition(canvas))
console.error(scale.x, scale.y)
ctx.scale(scale.x , scale.y );
ctx.drawImage(inMemCanvas, 0, 0);
      initialState.canvas.width=canvas.width;
      initialState.canvas.height=canvas.height;
return
      inMemCtx.drawImage(canvas, 0, 0);

      scale.x=initialState.canvas.width/inMemCanvas.width;
      scale.y=initialState.canvas.width/inMemCanvas.height;
      
      canvas.width = canvas.offsetWidth * pixelRatio * scale.x;
      canvas.height = canvas.offsetHeight * pixelRatio * scale.y;
      
      // canvas.width = canvas.offsetWidth * ratio;
      // canvas.height = canvas.offsetHeight * ratio;
console.info(inMemCanvas)

      ctx.scale(scale.x * pixelRatio, scale.y * pixelRatio);
      
      ctx.drawImage(inMemCanvas, 0, 0);
      
      //ctx.scale(-scale.x * pixelRatio, -scale.y * pixelRatio);
      //canvasOffset = getCanvasPosition(canvas);
      // initialState.canvas.width=canvas.width;
      // initialState.canvas.height=canvas.height;
console.log('pixelRatio: ',pixelRatio)
    }

    function getCanvasPosition(el) {
      var viewportOffset = el.getBoundingClientRect();
      // these are relative to the viewport, i.e. the window
      return {top:viewportOffset.top, left:viewportOffset.left}
    }
    /* Mouse Capturing Work */
    canvas.addEventListener('mousemove', function(e) {
      last_mouse.x = mouse.x;
      last_mouse.y = mouse.y;

      mouse.x = e.clientX - canvasOffset.left // 47 //canvas.offsetLeft;
      mouse.y = e.clientY - canvasOffset.top // 71 //canvas.offsetTop;
      
      // console.log(getCanvasPosition(canvas), canvas.width)
      //console.log(e.clientX, mouse.x, e.clientY, mouse.y )
    }, false);


    /* Drawing on Paint App */
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'blue';

    canvas.addEventListener('mousedown', function(e) {
        canvas.addEventListener('mousemove', onPaint, false);
    }, false);

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', onPaint, false);
    }, false);

    var root = this;
    var onPaint = function(e) {
      e.preventDefault();
      e.stopPropagation();
        ctx.beginPath();
        ctx.moveTo(last_mouse.x, last_mouse.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.closePath();
        ctx.stroke();

        initialState.canvas.lastImage = canvas;
        
      ctx.save();
        if(root.timeout != undefined) clearTimeout(root.timeout)
        /* root.timeout = setTimeout(() => {
          root.setState({base64imagedata: canvas.toDataURL('image/png')});
          console.log(root.state.base64imagedata)
          socket.emit('canvas-data', root.state.base64imagedata)
        }, 1000); */
    };
    //resizeCanvas()
  }

  
  _save = () => {
    let drawings = this.state.drawings;
    drawings.push(this._sketch.toDataURL());
    //this.setState({ drawings: drawings });
    this.setState({ drawings: drawings}, () => console.log(this.state.drawings))
  };

  _download = () => {
    console.save(this._sketch.toDataURL(), "toDataURL.txt");
    console.save(JSON.stringify(this._sketch.toJSON()), "toDataJSON.txt");

    /*eslint-enable no-console*/

    let { imgDown } = this.refs;
    let event = new Event("click", {});

    imgDown.href = this._sketch.toDataURL();
    imgDown.download = "toPNG.png";
    imgDown.dispatchEvent(event);
  };

  _undo = () => {
    this._sketch.undo();
    // this.setState(prevState => ({
    //   sketcher:{
    //     ...prevState.sketcher,
    //     canUndo: this._sketch.canUndo(),
    //     canRedo: this._sketch.canRedo(),
    //   }
    // }));
    this.setState({
      canUndo: this._sketch.canUndo(), 
      canRedo: this._sketch.canRedo()
    })
  };

  _redo = () => {
    this._sketch.redo();
    this.setState({
      canUndo: this._sketch.canUndo(), 
      canRedo: this._sketch.canRedo()
    })
  };

  _clear = () => {
    this._sketch.clear();
    this._sketch.setBackgroundFromDataUrl("");
    this.setState({
      controlledValue: null,
      backgroundColor: "transparent",
      fillWithBackgroundColor: false,
      canUndo: this._sketch.canUndo(), 
      canRedo: this._sketch.canRedo()
    })
  };
  
  _removeMe = (index) => {
    let drawings = this.state.drawings;
    drawings.splice(index, 1);
    this.setState({ drawings: drawings });
  };

  _removeSelected = () => {
    this._sketch.removeSelected();
  };

  _onSketchChange = () => {
    let prev = this.state.canUndo;
    let now = this._sketch.canUndo();
    if (prev !== now) {
      this.setState({ canUndo: now });
    }
  };

  _onBackgroundImageDrop = (accepted /*, rejected*/) => {
    if (accepted && accepted.length > 0) {
      let sketch = this._sketch;
      let reader = new FileReader();
      let { stretched, stretchedX, stretchedY, originX, originY } = this.state;
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

  _addText = () => this._sketch.addText(this.state.text);

  _linecolor = (value) => {
    console.log('value: ',value)
    const color = value;
    console.log('current state linecolor: ',this.state.lineColor)
    this.setState({lineColor: value}, () => {
      console.log('in setstate linecolor',this.state.lineColor)
    })    
  }

  _changeTool = (value) => {
    console.log(value)
    console.log(this.tools[value])
    if(value === 'Color') {
      this._linecolor('black')
    } else {
      let tool = this.tools[value];
    this.setState({
      tool: tool,
      enableRemoveSelected: tool === Tools.Select,
      enableCopyPaste: tool === Tools.Select,
    });
    }

    
  }

  _selectTool = (event) => {
    this.setState({
      tool: event.target.value,
      enableRemoveSelected: event.target.value === Tools.Select,
      enableCopyPaste: event.target.value === Tools.Select,
    });
  };
  /*
   * 
   * @returns 
   * <IconButton onClick={(e) => this._sketch.zoom(1.25)}>
                      <ZoomInIcon />
                    </IconButton>
                    <IconButton onClick={(e) => this._sketch.zoom(0.8)}>
                      <ZoomOutIcon />
                    </IconButton>
   */
  render() {
    const { classes } = this.props;
    let { controlledValue } = this.state;
    return (
      <React.Fragment>
      <SketchWrapper id="sketch">
        {/* <canvas id="paint" className={classes.board} ></canvas> */}
        <SketchField
          width={this.state.canvasWidth}
          height={this.state.canvasHeight}
          /* width={this.state.controlledSize ? this.state.sketchWidth : null}
          height={this.state.controlledSize ? this.state.canvas.height : null} */
          className={classes.board} 
          name="sketch"
          ref={(c) => (this._sketch = c)}
          lineColor={this.state.lineColor}
          lineWidth={this.state.lineWidth}
          fillColor={
            this.state.fillWithColor ? this.state.fillColor : "transparent"
          }
          backgroundColor={
            this.state.fillWithBackgroundColor ? this.state.backgroundColor : "transparent" 
          }
          defaultValue={dataJson}
          value={controlledValue}
          forceValue
          onChange={this._onSketchChange}
          tool={this.state.tool}
        />
        <WBToolbar 
          changeLineColor={this._linecolor}
          defaultLineColor={this.state.lineColor}
          changeTool={this._changeTool}
        />
      </SketchWrapper>
    </React.Fragment>
    )
  }
}
//export default (withAuth0(Board))(withStyles(styles)(Board));
export default withAuth0(withStyles(styles)(Board))