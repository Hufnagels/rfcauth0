import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Material
import { styled, createTheme } from '@mui/material/styles';
import { makeStyles } from '@material-ui/styles';
import { 
  DataGrid, 
  GridToolbar,
  GridOverlay,
} from '@material-ui/data-grid';
import Alert from '@mui/material/Alert';
import {
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Button,
} from '@mui/material'


const TableOuter = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const TableInner = styled('div')(({ theme }) => ({
  height: '600px',
  width: '100%',
  padding: theme.spacing(0, 1),
  
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) => ({
    root: {
      flexDirection: 'column',
      '& .ant-empty-img-1': {
        fill: theme.palette.type === 'light' ? '#333' : '#262626',
      },
      '& .ant-empty-img-2': {
        fill: theme.palette.type === 'light' ? '#333' : '#595959',
      },
      '& .ant-empty-img-3': {
        fill: theme.palette.type === 'light' ? '#333' : '#434343',
      },
      '& .ant-empty-img-4': {
        fill: theme.palette.type === 'light' ? '#333' : '#1c1c1c',
      },
      '& .ant-empty-img-5': {
        fillOpacity: theme.palette.type === 'light' ? '0.8' : '0.08',
        fill: theme.palette.type === 'light' ? '#333' : '#111',
      },
    },
    label: {
      marginTop: theme.spacing(1),
    },
  }),
  { defaultTheme },
);

function CustomNoRowsOverlay() {
  const classes = useStyles();

  return (
    <GridOverlay className={classes.root}>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="black" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <div className={classes.label}>No Rows</div>
    </GridOverlay>
  );
}

export default function BasicFilteringGrid() {

  const [isLoading,setIsLoading] = useState(true);
  const [error,setError] = useState(false);
  const [errorMessage,setErrorMessage] = useState('');
  
  const [rowData,setRowData] = useState([]);
  const [editRowsModel, setEditRowsModel] = useState({});
  const [isEditing,setIsEditing] = useState(false);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", editable: true, width: 170 },
    { field: "username", headerName: "Username", editable: true, width: 170 },
    { field: "email", headerName: "E-mail", width: 200 },
    { field: "address", headerName: "Address", width: 250, 
      renderCell: (params) => (
        <span>{params.value.zipcode}, {params.value.city}, {params.value.street}</span>
      ),
    },
    { field: "company", headerName: "Company", width: 200, 
      renderCell: (params) => (
        <span>{params.value.name}</span>
      ),
    },
    { field: "website", headerName: "Website", width: 200, 
      renderCell: (params) => (
        <a href={"https://"+params.value}
        target="_blank"
        rel="noreferrer"
        color="primary"
        style={{ marginLeft: 16 }}
        >
          {params.value}
        </a>
      ),
    },
  ];

  const [filterModel, setFilterModel] = React.useState({
    items: [
      { id: 1, columnField: 'id', operatorValue: 'isNotEmpty', value: 'undefined' },
    ],
  });

  const handleEditRowsModelChange = React.useCallback((model) => {
    console.log('handleEditRowsModelChange')
    setEditRowsModel(model);
  }, []);
  
  const handleCellEditCommit = React.useCallback( ({ id, field, value }) => {
      // time to save data
        const updatedRows = rowData.map((row) => {
          if (row.id === id) {
            row[field] = value;
            return row;
          }
          return row;
        });
        setRowData(updatedRows);
      //}
      console.log('handleCellEditCommit')
      console.log(id, field, value)
      console.log(rowData)
      setIsEditing(false)
      putData(id,field,value)
    },[rowData],
  );

  const cellpropchange = React.useCallback( ({ id, field, value }) => {
    console.log('cellpropchange')
    console.log(id, field, value)
    },[]
  )

  const putData = async (id, field, value) => {
    console.log('putData')
    console.log(id, field, value)
    await axios
      .put('', {
        id: id,
        fieldname: field,
        value: value
      })
      .then((response) => {
        //setPost(response.data);
      })
  }

  const fetchData = async () => {
    try {
      // fetch data from a url endpoint
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");
      console.log("response");
      console.log(response.data);
      setIsLoading(false);
      setError(false);
      setErrorMessage('');
      response.data.length > 1 ? setRowData(response.data) : setRowData([response.data])
      //setRowData(response.data);
      return true;//response.data;
    } catch(error) {
      console.log("error", error.message);
      setIsLoading(false);
      setError(true);
      setErrorMessage(error.message);
      setRowData([]);
    }
  }

  useEffect(() => {
    fetchData();
    return () => {

    }
  }, []);

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader 
              title={'Table'}
              subheader={new Date(Date.now()).toDateString()}
            />
            <CardContent>
              {isEditing ? <Alert severity="info" style={{ marginBottom: 8 }}><code>editRowsModel: {JSON.stringify(editRowsModel)}</code></Alert> : null }
              {error ? <Alert severity="error" style={{ marginBottom: 8 }}><div>{errorMessage}</div></Alert> : null }
              {isLoading ? <CircularProgress color="primary" /> : null }

              {!isLoading ?  
                <TableOuter>
                  <TableInner>
                      <DataGrid
                        components={{
                          NoRowsOverlay: CustomNoRowsOverlay,
                        }}
                        rows={rowData} 
                        columns={columns}
                        editRowsModel={editRowsModel}
                        onEditCellPropsChange={cellpropchange}
                        onEditRowsModelChange={handleEditRowsModelChange}
                        onCellEditCommit={handleCellEditCommit}
                        onCellDoubleClick={(params) => params.isEditable? setIsEditing(true):console.log(params) }
                        checkboxSelection
                        disableSelectionOnClick
                        density="compact"
                        pageSize={5}
                        components={{Toolbar: GridToolbar,}}
                        filterModel={filterModel}
                        onFilterModelChange={(model) => setFilterModel(model)}
                        
                      />
                  </TableInner>
                </TableOuter>
              : null
              }
            </CardContent>
            <CardActions>

            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>  

  );
}