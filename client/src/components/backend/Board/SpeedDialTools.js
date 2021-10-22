import * as React from 'react';

// Material
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/styles';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';

const StyledSpeedDial = styled(SpeedDial, { shouldForwardProp: (prop) => prop !== 'disabled' })(
  ({ theme, disabled }) => ({
  position: 'absolute',
  '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    top: theme.spacing(-1),
    right: theme.spacing(0),
  },
  '> button': {
    borderRadius:0,
    width:46,
    height:46,
    boxShadow: 'none',
    //backgroundColor: theme.palette.secondary.main,
  },
  
}));

export default function SpeedDialTools({actions,actionIcon,isenabled}) {
  const theme = useTheme();
  //console.log(theme)
  const [hidden, setHidden] = React.useState(false);

  return (
    <Box sx={{ 
      position: 'relative', 
      mt: 0,
      top: theme.spacing(0), 
      right: theme.spacing(0),
      width: 48,
      height: 48,
      display: 'flex',
      flexDirection: 'column',
      }}
    >
        <StyledSpeedDial
          ariaLabel="SpeedDial Actions"
          icon={actionIcon}
          direction='left'
        >
          {actions.map((action) => {
            let eventName = action.name;
            return (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={(e)=> action.cb(eventName)}
                disabled={(typeof isenabled === 'boolean') ? !isenabled : false}
              />
            )
          })}
        </StyledSpeedDial>
      </Box>
  );
}
