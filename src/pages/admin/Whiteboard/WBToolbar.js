import * as React from 'react';

// Material
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import ToggleButton from '@material-ui/core/ToggleButton';
import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
// custom
import ToolbarWrapper from '../../../components/ToolbarWrapper';

const WBToolbar = () => {
  const [view, setView] = React.useState('list');
  const [formats, setFormats] = React.useState(() => ['bold', 'italic']);

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };
  const handleChange = (event, nextView) => {
    setView(nextView);
  };

  return (
    <ToolbarWrapper>
      <Paper elevation={3}>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 0, width: '5.3ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              label="Color"
              id="outlined-size-small"
              defaultValue="Small"
              size="small"
              type="color"
            />
          </div>
        </Box>
        <ToggleButtonGroup
          orientation="vertical"
          value={view}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value="list" aria-label="list">
            <ViewListIcon />
          </ToggleButton>
          <ToggleButton value="module" aria-label="module">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="quilt" aria-label="quilt">
            <ViewQuiltIcon />
          </ToggleButton>
          
        </ToggleButtonGroup>
      </Paper>
    </ToolbarWrapper>
    
  );
}
export default WBToolbar;