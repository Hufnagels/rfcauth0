import * as React from 'react'
import io from 'socket.io-client';
import PropTypes from 'prop-types'
import { withAuth0 } from '@auth0/auth0-react';

//Material
import { styled} from '@mui/material/styles';
import { withStyles } from '@mui/styles';

// custom

const styles = theme => ({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
  board: {
    width:'100%',
    height:'100%',
    //position:'absolute',
    borderWidth: '1px',
    borderStyle: 'dashed', 
    borderColor: 'black', //theme.palette.primary.main, 
    backgroundColor: theme.palette.secondary.light
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
  //position:'absolute',
  // top:0,
  // left:0,
  // padding: 0,
  width: '100%',
  height:'100%',
  // border: '2px sild red',
  //backgroundColor: theme.palette.secondary.light
  
}));

//@withStyles(styles)

class Board extends React.Component {
  
  user = this.props.auth0.user;

  constructor(props) {
    super(props);
    this.state = {
      base64imagedata: null,
      username:null,
    };
    
    this.socket.on('canvas-data', (data) => {
      var image = new Image();
      var canvas = document.querySelector('#paint');
      var ctx = canvas.getContext('2d');
      image.onload = function() {
        ctx.drawImage(image,0,0)
      }
      image.src = data;
    })

  }

  timeout = null;
  ctx = null;
  username = null;
  socket = io.connect('http://localhost:4000');

  componentDidMount(){
    this.drawOnCanvas();
    this.username = this.props.auth0.user.name;
    console.log('componentDidMount user', this.user)
    console.log('componentDidMount props', this.props.auth0.user.name)
    this.setuserdata();
  }

  setuserdata(){
    this.setState({username: this.username})
    console.log('setuserdata username', this.state.username)
  }
  componentWillUnmount() {
  }

  drawOnCanvas() {
    var canvas = document.getElementById('paint');
    this.ctx = canvas.getContext('2d');
    var ctx = this.ctx;

    var sketch = document.getElementById('sketch');
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));

    var mouse = {x: 0, y: 0};
    var last_mouse = {x: 0, y: 0};
    
    //window.addEventListener('resize', resize);

    // resize canvas
    function resize() {
      // inMemCanvas.width = canvas.width;
      // inMemCanvas.height = canvas.height;
      // inMemCtx.drawImage(canvas, 0, 0);
      //canvasRef.width = 1000;
      // var ratio = Math.max(window.devicePixelRatio || 1, 1);
      // canvas.width = canvas.offsetWidth * ratio;
      // canvas.height = canvas.offsetHeight * ratio;
      ctx.canvas.width = canvas.width;
      ctx.canvas.height = canvas.height;
      //ctx.drawImage(inMemCanvas, 0, 0);
    }

    /* Mouse Capturing Work */
    canvas.addEventListener('mousemove', function(e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.clientX - 35 //this.offsetLeft;
        mouse.y = e.clientY  - 72 //this.offsetTop;
        // console.log(mouse.x)
        // console.log(mouse.y)
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
    var onPaint = function() {
        ctx.beginPath();
        ctx.moveTo(last_mouse.x, last_mouse.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.closePath();
        ctx.stroke();

        if(root.timeout != undefined) clearTimeout(root.timeout)
        root.timeout = setTimeout(() => {
          root.setState({base64imagedata: canvas.toDataURL('image/png')});
          console.log(root.state.base64imagedata)
          root.socket.emit('canvas-data', root.state.base64imagedata)
        }, 1000);
    };
    //resize()
  }

  render() {
    const { classes } = this.props;
    
    return (
      <React.Fragment>
      <SketchWrapper id="sketch">
        <canvas id="paint" className={classes.board}></canvas>
      </SketchWrapper>
    </React.Fragment>
    )
  }
}
//export default (withAuth0(Board))(withStyles(styles)(Board));
export default withAuth0(withStyles(styles)(Board))