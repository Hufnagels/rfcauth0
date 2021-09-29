import React, { useEffect, useState } from 'react'

// Material
import { makeStyles } from '@mui/styles';

// custom
import routes from '../features/routes/routes'

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
  navlink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    textDecoration:'none',
  },
  active: {
    color: '#e55cb3',
    backgroundColor: '#90d6e3',
  }
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
  const routesData = routes(false)[0].children;

  useEffect(() => {
    // const path = nestedLoop(routesData, 'path', 'app')
    // setList(path.path);
    // console.log(path)
    console.log(routesData)
  },[]);

  return (
    <div>
      Home
    </div>
  )
}

export default Home
