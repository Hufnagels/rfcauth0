import React, {useEffect, useState} from 'react'

// Material
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ChangeHistoryOutlinedIcon from '@mui/icons-material/ChangeHistoryOutlined';

// Icons
import LayersClearOutlinedIcon from '@mui/icons-material/LayersClearOutlined';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import BookmarkRemoveOutlinedIcon from '@mui/icons-material/BookmarkRemoveOutlined';

// Custom
import ToolbarWrapper from '../../common/ToolbarWrapper';


const BoardToolbar = ({
  setStrokeColor, 
  setFillColor, 
  groupUngroup, 
  selectTool, 
  addShape, 
  loadAll, 
  saveAll, 
  clearAll 
}) => {
  
  const strokeRef = React.useRef('#f6b73c');
  const fillRef = React.useRef('#f6b73c');
  const toolsRef = React.useRef(null);

  const imgDown = React.useRef();
  const jsonDown = React.useRef();
  const fileInputRef = React.useRef();

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
    toolsRef.current = null;
  }, [])

  return (
    <React.Fragment>
      <a ref={imgDown} hidden href="" />
      <a ref={jsonDown} hidden href="" />
      {/* <input type="file" ref={fileInputRef} onChange={filesSelected} hidden /> */}
      <ToolbarWrapper>
        <Box
          component="form"
          sx={{
            marginBottom:0,
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
            component="form"
            sx={{
              marginTop:1,
              marginBottom:1,
              '& .MuiTextField-root': { m: 1, width: '5.3ch', },
            }}
            noValidate
            autoComplete="off"
            style={{display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap',
              alignContent: 'flex-start',
              alignItems: 'stretch',
              justifyContent: 'center',
            }}
          >
            <ButtonGroup
              orientation="vertical"
              aria-label="vertical outlined button group"
            >
              <Button variant="text" color='secondary' name="Clear" aria-label="Text" onClick={(e) => { clearAll(e) }}>
                <LayersClearOutlinedIcon />
              </Button>
              <Button variant="text" color='secondary' name="Group" aria-label="Text" onClick={(e) => { groupUngroup(e) }}>
                <BookmarksOutlinedIcon />
              </Button>
              <Button variant="text" color='secondary' name="UnGroup" aria-label="Text" onClick={(e) => { groupUngroup(e) }}>
                <BookmarkRemoveOutlinedIcon />
              </Button>
            </ButtonGroup>
          </Box>
          <Box
            component="form"
            sx={{
              marginBottom:2,
              '& .MuiTextField-root': { m: 0, width: '5.3ch', },
            }}
            noValidate
            autoComplete="off"
            style={{display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap',
              alignContent: 'flex-start',
              alignItems: 'stretch',
              justifyContent: 'center',
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
        <Box
            component="form"
            sx={{
              marginBottom:1,
              '& .MuiTextField-root': { m: 1, width: '5.3ch', },
            }}
            noValidate
            autoComplete="off"
            style={{display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap',
              alignContent: 'flex-start',
              alignItems: 'stretch',
              justifyContent: 'center',
            }}
          >
        <ButtonGroup
          orientation="vertical"
          aria-label="vertical outlined button group"
        >
          <Button variant="text" color='secondary' name="Line" aria-label="Line" onClick={(e) => { addShape(e) }}>
            <DriveFileRenameOutlineOutlinedIcon />
          </Button>
          <Button variant="text" color='secondary' name="FilledRectangle" aria-label="FilledRectangle" onClick={(e) => { addShape(e) }}>
            <FolderIcon />
          </Button>
          <Button variant="text" color='secondary' name="FilledCircle" aria-label="FilledCircle" onClick={(e) => { addShape(e) }}>
            <CircleIcon />
          </Button>
          <Button variant="text" color='secondary' name="Rectangle" aria-label="Rectangle" onClick={(e) => { addShape(e) }}>
            <FolderOutlinedIcon />
          </Button>
          <Button variant="text" color='secondary' name="Circle" aria-label="Circle" onClick={(e) => { addShape(e) }}>
            <CircleOutlinedIcon />
          </Button>
          <Button variant="text" color='secondary' name="Triangle" aria-label="Text" onClick={(e) => { addShape(e) }} >
            <ChangeHistoryOutlinedIcon />
          </Button>
          <Button variant="text" color='secondary' name="Text" aria-label="Text" onClick={(e) => { addShape(e) }}>
            <TextFieldsOutlinedIcon />
          </Button>
          <Button variant="text" color='secondary' name="Text" aria-label="Text" onClick={(e) => { saveAll(e) }}>
            <SaveAltOutlinedIcon />
          </Button>
          <Button variant="text" color='secondary' name="Text" aria-label="Text" onClick={(e) => { loadAll(e) }}>
            <FileUploadOutlinedIcon />
          </Button> 
        </ButtonGroup>
        </Box>
        </ToolbarWrapper>
    </React.Fragment>
  )
}

export default BoardToolbar
