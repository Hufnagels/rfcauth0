import React, {useEffect, useState} from 'react'

// Material
import { useTheme, styled } from '@mui/styles';
import { 
  Box,
  Stack,
  Slider,
  TextField,
  ButtonGroup,
  Button,
  Popover,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Divider, 
} from '@mui/material';
// import Popover from '@mui/material/Popover';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Button from '@mui/material/Button';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// import ToggleButton from '@mui/material/ToggleButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

// Stroke icons
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';

// Pan, select, FreeHandDraw Icons
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';

// Tool icons
import LayersClearOutlinedIcon from '@mui/icons-material/LayersClearOutlined';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import BookmarkRemoveOutlinedIcon from '@mui/icons-material/BookmarkRemoveOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ConnectWithoutContactOutlinedIcon from '@mui/icons-material/ConnectWithoutContactOutlined';
import Switch from '@mui/material/Switch';

// Drawing icons
import FolderIcon from '@mui/icons-material/Folder';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import ChangeHistoryOutlinedIcon from '@mui/icons-material/ChangeHistoryOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';

// File action icons
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

// SpeedDialIcons
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';

// Custom
import ToolbarWrapper from '../../common/ToolbarWrapper';
import SpeedDialTools from './SpeedDialTools';
import { socket } from '../../../features/context/socketcontext_whiteboard';
import { isNumeric, isEmpty } from '../../../features/utils';

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const BoardToolbar = ({
  setStrokeWidth,
  setStrokeColor,
  setFillColor,
  currentStrokeWidth,
  currentStrokeColor,
  currentFillColor,
  groupUngroup, 
  addShape,
  activeToggleButton,
  selectTool,
  loadAll, 
  saveAll, 
  clearAll,
  dummyCB,
  agreeToConnect,
  connected,
  connectedToRoom,
  pushJSON,
  isenabled,
}) => {
  
  const theme = useTheme();

  // Default settings
  const defaultValue = {
    strokeWidth:5,
    stroke:'#f6b73c',
    fill:'#f6b73c',
  }
  // Refs
  // const strokeWidthRef = React.useRef(currentStrokeWidth);
  // const strokeRef = React.useRef(currentStrokeColor);
  // const fillRef = React.useRef(currentFillColor);
  const toolsRef = React.useRef(null);

  const imgDown = React.useRef(null);
  const jsonDown = React.useRef(null);
  const fileInputRef = React.useRef(null);

  // State - socket and room connect
  const [connectionSwitchChecked, setConnectionSwitchChecked] = React.useState(connectedToRoom);
  const [connectedToSocket, setConnectedToSocket] = React.useState(connected)
  const handleConnectToRoomChange = (event) => {
    setConnectionSwitchChecked(event.target.checked);
    agreeToConnect(event.target.checked)
  };

  // State - Color and strokewidth changeings
  const [stateStrokeColor, setStateStrokeColor] = useState(isNumeric(currentStrokeColor) ? currentStrokeColor : defaultValue.stroke)
  const [stateFillColor, setStateFillColor] = useState(isNumeric(currentFillColor) ? currentFillColor : defaultValue.fill)
  const [stateStrokeWidth, setStateStrokeWidth] = useState(isNumeric(currentStrokeWidth) ? currentStrokeWidth : defaultValue.strokeWidth)

  // State - Stroke width slider & popover
  const [anchorElPopover, setAnchorElPopover] = React.useState(null);
  const handleClickPopover = (event) => {
    setAnchorElPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setAnchorElPopover(null);
  };
  const openPopover = Boolean(anchorElPopover);
  const id = openPopover ? 'stroke-popover' : undefined;
  // Child - parent function
  const handleChangeStrokeWidth = (event, newValue) => {
    //setStrokewidthvalue(newValue);
    setStrokeWidth(newValue)
    setStateStrokeWidth(newValue)
  };

  // Toggle buttons - tool change
  const [view, setView] = React.useState(null)
  // Child - parent function
  const handleToolChange = (event, nextView) => {
    event.preventDefault();
console.log('handelchange', event)
    setView(nextView)
    toolsRef.current = nextView;
    activeToggleButton(nextView)
    selectTool(toolsRef.current)
  };

  // FileUpload
  const filesSelected = () => {
    if (fileInputRef.current.files.length) {
      //handleFiles(fileInputRef.current.files);
console.info(fileInputRef.current.files)
    }
  }

  useEffect(() => {
    setConnectionSwitchChecked(connectedToRoom)
    setConnectedToSocket(connected ? connected : false)
    setStateStrokeWidth(defaultValue.strokeWidth)
// console.info('connected, typeof socket.id, socket.connected, connectedToRoom')
// console.info(connected, typeof socket.id, socket.connected, connectedToRoom)
// console.log(currentStrokeWidth, currentStrokeColor, currentFillColor)
  }, [])

  useEffect(() => {
    //setEnabled(checked);
    setConnectionSwitchChecked(connectedToRoom)
    setConnectedToSocket(connected ? connected : false)
console.info('socket, isConnected, connectedToRoom')
console.info(socket, connectedToSocket, connectedToRoom)
  }, [socket, connectedToSocket, connectedToRoom])

  useEffect(() => {
    //setEnabled(checked);
    if (!isEmpty(currentStrokeColor)) setStateStrokeColor(currentStrokeColor)
    if (!isEmpty(currentFillColor)) setStateFillColor(currentFillColor)
    if (isNumeric(currentStrokeWidth)) setStateStrokeWidth(currentStrokeWidth)
// console.info('currentStrokeWidth, currentStrokeColor, currentFillColor')
// console.info(currentStrokeWidth, currentStrokeColor, currentFillColor)
  }, [currentStrokeWidth, currentStrokeColor, currentFillColor])

  return (
    <React.Fragment>
      <a ref={imgDown} hidden href="" />
      <a ref={jsonDown} hidden href="" />
      {/* <input type="file" ref={fileInputRef} onChange={filesSelected} hidden /> */}
      <ToolbarWrapper>
        <Box
          sx={{
            marginBottom:1,
            width:'48px',
            display:'flex',
            flexDirection:'column',
            '& .MuiTextField-root': { m: 0, width: '5.4ch',minHeight:40, },
          }}
        >
          
          <HtmlTooltip
            title={
              <React.Fragment>
                <Typography color="inherit">Connect to 'WhiteboardRoom'</Typography>
                <strong>{'Enabled'}</strong>{', if the app is connected to the socket server'}<br />
                <strong>{'Disabled'}</strong>{', if the app is not connected to the socket server'}<br />
              </React.Fragment>
            }
          ><span>
            <Switch
              checked={connectionSwitchChecked}
              onChange={handleConnectToRoomChange}
              inputProps={{ 'aria-label': 'controlled' }}
              disabled={!connected}
            /></span>
          </HtmlTooltip>
        </Box>
        <Box
          sx={{
            marginBottom:1,
            width:'50px',
            minWidth:'48px',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            boxShadow: 'none',
            borderRadius:0,
            '> button': {
              borderRadius:'0 !important',
              width:46,
              height:46,
              maxWidth:46,
              maxHeight:46,
              minWidth:46,
              boxShadow: 'none',
              backgroundColor: theme.palette.primary.contrastText,
              color:theme.palette.primary.main,
              '&:hover':{
                boxShadow: 'none',
                color:theme.palette.primary.contrastText,
              }
            },
          }}
        >
          <Button aria-describedby={id} variant="contained" 
            onClick={handleClickPopover}
            
          >
            <BorderColorOutlinedIcon />
          </Button>
          <Popover
            id={id}
            open={openPopover}
            anchorEl={anchorElPopover}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              margin:0,
              width:'240px',
              display:'flex',
              minHeight:'60px',
            }}
          >
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center"
            sx={{
              marginTop:5,
              marginBottom:1,
              width:'200px',
              display:'flex',
              flexDirection:'row',
            }}>
              <ChevronRightOutlinedIcon />
              <Slider 
                aria-label="strokewidth" 
                value={stateStrokeWidth} 
                onChange={handleChangeStrokeWidth}
                valueLabelDisplay="auto"
                min={1}
                max={50}
              />
              <ArrowForwardIosOutlinedIcon />
            </Stack>
          </Popover>
        </Box>
        <Box
          component="form"
          sx={{
            marginBottom:1,
            width:'48px',
            display:'flex',
            flexDirection:'column',
            '& .MuiTextField-root': { m: 0, width: '5.4ch',minHeight:40, },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-size-large"
            size="small"
            type="color"
            label='stroke'
            style={{}}
            value={stateStrokeColor}
            onChange={(e) => {
// console.info(e.target.value)
              //strokeRef.current = e.target.value
              setStrokeColor(e.target.value);
              setStateStrokeColor(e.target.value)
              // canvas.freeDrawingBrush.color = lineColor;
            }}
          />
          <TextField
            id="outlined-size-large"
            size="small"
            type="color"
            label='fill'
            style={{}}
            value={stateFillColor}
            onChange={(e) => {
// console.info(e.target.value)
              //fillRef.current = e.target.value
              setFillColor(e.target.value);
              setStateFillColor(e.target.value)
              // canvas.freeDrawingBrush.color = lineColor;
            }}
          />
        </Box>
        <Box
          //component="form"
          sx={{
            marginBottom:1,
            display: 'flex',
            flexDirection: 'column',
            '& .MuiTextField-root': { m: 0, width: '5.3ch', },
          }}
        >
          <ToggleButtonGroup
              color="primary"
              orientation="vertical"
              value={view}
              exclusive
              onChange={handleToolChange}
              aria-label="outlined Sketch Tools"
            >
              <ToggleButton value="Pan" aria-label="Pan">
                <PanToolOutlinedIcon />
              </ToggleButton>
              <ToggleButton value="Select" aria-label="Select">
                <PhotoSizeSelectSmallIcon />
              </ToggleButton>
              <ToggleButton value="Draw" aria-label="Draw">
                <CreateOutlinedIcon />
              </ToggleButton>
            </ToggleButtonGroup>
        </Box>

        <SpeedDialTools 
          actions={[
            { icon: <GestureOutlinedIcon />, name: 'Pencil', cb: addShape },
            { icon: <DriveFileRenameOutlineOutlinedIcon />, name: 'Line', cb: addShape },
            { icon: <FolderIcon />, name: 'FilledRectangle', cb: addShape },
            { icon: <CircleIcon />, name: 'FilledCircle', cb: addShape },
            { icon: <FolderOutlinedIcon />, name: 'Rectangle', cb: addShape },
            { icon: <CircleOutlinedIcon />, name: 'Circle', cb: addShape },
            { icon: <ChangeHistoryOutlinedIcon />, name: 'Triangle', cb: addShape },
            { icon: <TextFieldsOutlinedIcon />, name: 'Text', cb: addShape },
          ]}
          actionIcon={<CreateOutlinedIcon />}
          isenabled={isenabled}
          style={{m:4}}
        />
        <Divider />
        <Box style={{position:'relative',marginTop:5}}>
        <SpeedDialTools 
          actions={[
            { icon: <LayersClearOutlinedIcon />, name: 'Clear', cb: clearAll },
            { icon: <BookmarksOutlinedIcon />, name: 'Group', cb: groupUngroup },
            { icon: <BookmarkRemoveOutlinedIcon />, name: 'UnGroup', cb: groupUngroup },
            { icon: <SendOutlinedIcon /> , name: 'Send whole canvas', cb: pushJSON},
          ]}
          actionIcon={<BuildOutlinedIcon />}
        />
        
        <SpeedDialTools 
          actions={[
            { icon: <FileUploadOutlinedIcon />, name: 'Load', cb: loadAll },
            { icon: <SaveAltOutlinedIcon />, name: 'Save', cb: saveAll },
            { icon: <PrintIcon />, name: 'Print', cb: dummyCB },
            { icon: <ShareIcon />, name: 'Share', cb: dummyCB },
          ]}
          actionIcon={<DriveFileMoveOutlinedIcon />}
        />
        </Box>
        
        
      </ToolbarWrapper>
    </React.Fragment>
  )
}

export default BoardToolbar
