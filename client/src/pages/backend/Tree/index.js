import React from 'react';

// Material
import { styled } from '@mui/material/styles';
import {
  Button,
  Snackbar,
  Grid,
  Paper,
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  Typography,
  List,
  ListItem,
  Divider,
} from '@mui/material';

// Custom
// Components - common
import Loading from '../../../components/common/Loading';
import MyDropzone from '../../../components/common/Fileupload/Fileupload'

// Components - Barchart
import BarChart from '../../../components/backend/Charts/Bar/BarChart'
import { data } from '../../../components/backend/Charts/Bar/BarChartData'

// Components - Tree
import Tree3 from '../../../components/backend/Tree/Tree3';
import { dataset } from '../../../components/backend/Tree/data'
import { jsonData } from '../../../components/backend/Tree/flare'
import ChatListContainer from '../../../components/backend/Chat/ChatListContainer';

const datas = 
  {
    "name": "root",
    "direction":"",
    "children": [
      { 
        "name": "alma",
        "direction":"left",
        "children": [
          {
            "name": "node1",
          }
        ]
      },
      {
        "name": "korte",
        "direction":"right",
        "children": [
          {
            "name": "node2",
          }
        ]
      },
    ]
  }

const BoxCanvas = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: '100%',
    minWidth:'100%',
    height:'calc(100vh - 80px)',
    flexShrink: 0,
    boxSizing: 'border-box',
    display:'flex',
    position: 'relative', 
    zIndex:'100',
  }),
);

const TreehWrapper = styled('div')(({ theme }) => ({
  position:'relative',
  width: '100%',
  minWidth:'100%',
  height:'100%',
}));

const MindMapPage = () => {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if(Object.keys(dataset).length) setLoading(false)
  },[])

  return (
    <React.Fragment>
      <ChatListContainer />
      {!loading ?
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Grid 
            container
            direction="row"
          >
            <Grid item xs={12}>
              <Paper elevation={3}>
                <BoxCanvas sx={{ overflow:'hidden', }}>
                  <TreehWrapper>
                    <Tree3 
                      ddata={dataset}
                    />
                  </TreehWrapper>
                </BoxCanvas>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        :
        <Loading />
      }
      
        {/* <BarChart data={data} /> */}
    </React.Fragment>
          
          
  );
}

export default MindMapPage;
