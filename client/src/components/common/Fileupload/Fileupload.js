import React, {useCallback, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'

// Material
// import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { styled } from '@mui/material/styles';
import {
  Box,
  Paper,
  Typography,
  // Skeleton,
  // Toolbar,
  Grid,
  // Item,
  // Stack,
  // Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from '@mui/material'

import brown from '@mui/material/colors/brown';
// import grey from '@mui/material/colors/grey';

import File from './File';


const CustomizedBox = styled(Box)`
  color: #20b2aa;
  :hover {
    color: #2e8b57;
  }
`;

const MyDropzone = (openstate) => {
  const [state, setState] = React.useState(false)
  const [files, setFiles] = React.useState([])

  

  const boxwidth = 812

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      image: URL.createObjectURL(file)
    })));

    /* 
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onprogress = function(progressEvent) {

        if(progressEvent.lengthComputable) {
            var percentLoaded = Math.round( (
                    progressEvent.loaded * 100) / progressEvent.total );
        }
        console.log("total: " + progressEvent.total + ", loaded: "
                  + progressEvent.loaded + "(" + percentLoaded + "%)");
      }
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result
        //console.log(binaryStr)
        file.image = binaryStr;
        
      }
      //reader.readAsArrayBuffer(file)
      reader.readAsDataURL(file)
      console.log(file.name)
      let temp = files
      temp.push(file)
      setFiles(temp)
      console.log(files)
    }) */
    
  }, [files])
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  useEffect(()=>{
    files.forEach(file => URL.revokeObjectURL(file.image));
  },[])

  useEffect(()=>{
    setState(openstate)
  },[openstate])

  if(state) return null
  return (
    <Box sx={{ width:boxwidth,position:'absolute',}} >
      <Paper elevation={3} {...getRootProps()} 
        sx={{ 
          backgroundColor: brown[200],
          '&:hover': {
            backgroundColor: brown[100],
            opacity: [0.9, 0.8, 0.9],
          },
        }}
      >
        <Card sx={{ maxWidth: boxwidth, backgroundColor: brown[300], '& > *':{color:"white !important"} }}>
          <input {...getInputProps()} />
          <CardHeader title="Upload files" subheader="Drop or click on + icon" style={{'& > *':{color:"white !important"},}} />
          <CardContent style={{backgroundColor: brown[200], minHeight:'200px',maxHeight:'400px',overflowY:'scroll'}}>
            <div style={{width:'100%', height:'100%',}} >
              <Grid container spacing={1} style={{ height:'100%',}}>
                  { files.length > 0 ?
                    files.map((file,i) => (
                      <Grid item xs={4}>
                        <File file={file} index={i} key={i} />
                      </Grid>
                    ))
                    :
                    <Typography variant="h6" component="div">Drop here</Typography>
                  }
              </Grid>
            </div>
          </CardContent>
          <CardActions>
            upload
          </CardActions>
        </Card>
        
      </Paper>
    </Box>
    
  )
}

export default MyDropzone