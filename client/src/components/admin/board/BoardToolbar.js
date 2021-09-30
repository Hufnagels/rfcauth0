import React, {useEffect, useState} from 'react'

// Material
import { useTheme, styled } from '@mui/styles';
import { 
  Box,
  TextField,
  ButtonGroup,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Typography, 
} from '@mui/material';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Button from '@mui/material/Button';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// import ToggleButton from '@mui/material/ToggleButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';


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

// Custom
import ToolbarWrapper from '../../common/ToolbarWrapper';
import SpeedDialTools from './SpeedDialTools';

// SpeedDialIcons
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import { socket } from '../../../features/context/socketcontext_whiteboard';

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
  setStrokeColor, 
  setFillColor, 
  groupUngroup, 
  selectTool, 
  addShape, 
  loadAll, 
  saveAll, 
  clearAll,
  dummyCB,
  agreeToConnect,
  connected,
  connectedToRoom,
  pushJSON,
}) => {
  
  const theme = useTheme();

  const strokeRef = React.useRef('#f6b73c');
  const fillRef = React.useRef('#f6b73c');
  const toolsRef = React.useRef(null);

  const imgDown = React.useRef(null);
  const jsonDown = React.useRef(null);
  const fileInputRef = React.useRef(null);

  //const [checked, setChecked] = useState(connectedToRoom)
  // connect switch
  const [connectionSwitchChecked, setConnectionSwitchChecked] = React.useState(connectedToRoom);
  const [isConnectedToSocket, setIsConnectedToSocket] = React.useState(connected)

  const handleConnectToRoomChange = (event) => {
    setConnectionSwitchChecked(event.target.checked);
    agreeToConnect(event.target.checked)
  };
  // Color change buttons
  const [stateStrokeColor, setStateStrokeColor] = useState('#f6b73c')
  const [stateFillColor, setStateFillColor] = useState('#f6b73c')
  
  // Toggle buttons
  const [view, setView] = React.useState(null)
  const handleToolChange = (event, nextView) => {
    event.preventDefault();
console.log('handelchange', event)
    setView(nextView)
    toolsRef.current = nextView;
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
    setIsConnectedToSocket(connected ? connected : false)
console.info('connected, typeof socket.id, socket.connected, isConnected')
console.info(connected, typeof socket.id, socket.connected, isConnectedToSocket)
  }, [])

  useEffect(() => {
    //setEnabled(checked);
    setConnectionSwitchChecked(connectedToRoom)
    setIsConnectedToSocket(connected ? connected : false)
console.info('socket isConnected')
console.info(socket, isConnectedToSocket)
  }, [socket, connectedToRoom])

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
              disabled={!isConnectedToSocket}
            /></span>
          </HtmlTooltip>
          {/* <ButtonGroup
            orientation="vertical"
            aria-label="vertical outlined button group"
          >
            <Tooltip disableFocusListener title="Connect">
              <Button variant="text" color='secondary' name="Line" aria-label="Connect" disabled={!isConnectedToSocket} onClick={(e) => { agreeToConnect() }}>
                <ConnectWithoutContactOutlinedIcon />
              </Button>
            </Tooltip>
          </ButtonGroup> */}
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
  console.info(e.target.value)
              strokeRef.current = e.target.value
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
  console.info(e.target.value)
              fillRef.current = e.target.value
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
              <ToggleButton value="Pencil" aria-label="Pencil">
                <GestureOutlinedIcon />
              </ToggleButton>
            </ToggleButtonGroup>
        </Box>
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
            { icon: <DriveFileRenameOutlineOutlinedIcon />, name: 'Line', cb: addShape },
            { icon: <FolderIcon />, name: 'FilledRectangle', cb: addShape },
            { icon: <CircleIcon />, name: 'FilledCircle', cb: addShape },
            { icon: <FolderOutlinedIcon />, name: 'Rectangle', cb: addShape },
            { icon: <CircleOutlinedIcon />, name: 'Circle', cb: addShape },
            { icon: <ChangeHistoryOutlinedIcon />, name: 'Triangle', cb: addShape },
            { icon: <TextFieldsOutlinedIcon />, name: 'Text', cb: addShape },
          ]}
          actionIcon={<CreateOutlinedIcon />}
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
        
      </ToolbarWrapper>
    </React.Fragment>
  )
}

export default BoardToolbar
