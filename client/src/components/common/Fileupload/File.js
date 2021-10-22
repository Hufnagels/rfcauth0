import React from 'react'

// Material
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const File = ({file, index}) => {
  const {path, name, lastModified, lastModifiedDate,size, type, image } = file;
  return (
    <Card sx={{  margin:1,padding:0 }} key={index}>
      <CardMedia
        component="img"
        height="150"
        image={image}
        alt={name}
      />
      <CardContent>
        <Typography gutterBottom variant="body2" component="div">{name}</Typography>
        <Typography variant="body2" component="div" color="text.secondary">{type}</Typography>
        <Typography variant="body2" component="div" color="text.secondary">{size}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Upload</Button>
        <Button size="small">Cancel</Button>
      </CardActions>
    </Card>
  )
}

export default File
