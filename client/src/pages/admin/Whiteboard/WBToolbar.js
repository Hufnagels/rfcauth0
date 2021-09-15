import * as React from 'react';

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
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import ZoomOutOutlinedIcon from '@mui/icons-material/ZoomOutOutlined';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

// custom
import ToolbarWrapper from '../../../components/ToolbarWrapper';
import {SketchField, Tools} from 'react-sketch';

const WBToolbar = (props) => {
  const [view, setView] = React.useState('Pencil');
  const [alignment, setAlignment] = React.useState('left');
  
  const [color, setColor] = React.useState("#f6b73c");

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      props.changeTool(newAlignment)
    }
  };

  const handleChange = (event, nextView) => {
    //console.log(event, nextView)
    setView(nextView);
    props.changeTool(nextView)
  };

  React.useEffect(() => {
    props.changeLineColor(color)
    //console.info('WDToolbar color changed')
  }, [color]);
  
  return (
    <ToolbarWrapper>
      <Paper elevation={3}>
        <Box
          component="form"
          sx={{
            marginBottom:1,
            '& .MuiTextField-root': { m: 0, width: '5.3ch',minHeight:30, },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              label="Color"
              id="outlined-size-large"
              size="small"
              type="color"
              value={color}
              onChange={(e) => {
                //console.log(props)
                props.changeLineColor(e.target.value)
                //console.log('Toolbar color: ', e.target.value)
                setAlignment(null);
                props.changeTool('DefaultTool')
                setColor(e.target.value)
              }}
            />
          </div>
        </Box>
        <ToggleButtonGroup
          color="primary"
          orientation="vertical"
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="Sketch Tools"
        >
          <ToggleButton value="Select" aria-label="Select">
            <PhotoSizeSelectSmallIcon />
          </ToggleButton>
          <ToggleButton value="Pencil" aria-label="Pencil">
            <GestureOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="Line" aria-label="Line">
            <DriveFileRenameOutlineOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="Rectangle" aria-label="Rectangle">
            <CheckBoxOutlineBlankOutlinedIcon />
          </ToggleButton>
          <ToggleButton value="Circle" aria-label="Circle">
            <CircleOutlinedIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <Box
          sx={{
            display: 'flex',
            marginTop:1,
            '& > *': {m: 0, width: '5.3ch', }
          }}
        >
          <ButtonGroup
            orientation="vertical"
            aria-label="vertical outlined button group"
            sx={{'& > *': {m:0,}}}
          >
            <Button 
              sx={{'& > *': {m:0,minHeight:30, p:1, marginLeft:0, marginRight:0}}}
              startIcon={<TextFieldsOutlinedIcon />}
            />
            <Button 
              sx={{'& > *': {m:0,minHeight:30, p:1, marginLeft:0, marginRight:0}}}
              startIcon={<UndoIcon />}
            />
            <Button
              sx={{'& > *': {m:0,minHeight:30, p:1, marginLeft:0, marginRight:0}}}
              startIcon={<RedoIcon />}
            />
          </ButtonGroup>
        </Box>
        
      </Paper>
    </ToolbarWrapper>
    
  );
}
export default WBToolbar;