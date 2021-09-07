import React, { useEffect, useState } from 'react'
import JSONPretty from 'react-json-pretty';
import { NavLink } from 'react-router-dom';

// Material
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';

// custom
import routes from '../features/routes/routes'
import styles from '../features/theme/jsonpretty.css'; 

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});



function nestedLoop(obj,searchKey, searchValue) {
  const res = {};
  function recurse(obj, current) {
      for (const key in obj) {
          let value = obj[key];
          if(value !== undefined) {
              if (value && typeof value === 'object') {
                  recurse(value, key);
              } else {
                  // Do your stuff here to var value
                  if (key === searchKey && value === searchValue) {
                    res[key] = value;
                    console.log(key, value, obj)
                    res[key] = obj.children;
                    break;
                  }
                  
              }
          }
      }
  }
  recurse(obj);
  return res;
}

function findObjectByLabel(obj, key, value) {
  for(var elements in obj){
      if (elements === key && obj[elements] === value){
           console.log(obj[elements]);
           console.log(JSON.stringify(obj.children));
           return obj.children;
      }
      if(typeof obj[elements] === 'object'){
        findObjectByLabel(obj[elements], key, value );
      }
  }
};

const Home = props => {
  const [list, setList] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const path = nestedLoop(routes, 'path', 'app')
    setList(path.path);
    //console.log(path.path)
  },[]);

  return (
    <div>
      Home
      <div>
        <Paper className="">
          <List>
            {routes[0].children.map(({ path, title, ...prop }, index) => {
              console.log('prop', prop)
              //const Icon = icons[icon];
               return (
                
                  <NavLink to={path} key={`routeLink-${index}}`}>
                    
                    <ListItem button >
                      <ListItemIcon>
                        <prop.icon />
                      </ListItemIcon>
                      
                      <Typography variant="inherit">{title}</Typography>
                    </ListItem>
                    
                  </NavLink>
                
              );
            })
            }
            
          </List>
        </Paper>
        <JSONPretty data={JSON.stringify(routes[0].children, null, 2)} theme={styles} />
      </div>
    </div>
  )
}

export default Home
