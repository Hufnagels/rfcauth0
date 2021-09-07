import React, {useReducer,useEffect,useState} from 'react'
import axios from 'axios'


// Material
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';


// custom
import { columns } from './columns';

const initialState = {
  loading: true,
  errorMessage: '',
  users: []
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {...state,
        loading : false,
        users: (action.payload.length > 1) ? action.payload : [action.payload],
        errorMessage: '',
      }
    case 'FETCH_ERROR':
      return {...state,
        loading : false,
        errorMessage: action.error,
        users: []
      }
    default:
      return state;
  }
}

function DataFetching() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [editRowsModel, setEditRowsModel] = useState({});
  const [isEditing,setIsEditing] = useState(false);

  const fetchData = async () => {
    try {
      // fetch data from a url endpoint
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");
      console.log("response");
      console.log(response.data);
      dispatch({type: 'FETCH_SUCCESS', payload: response.data})

    } catch(error) {
      dispatch({type: 'FETCH_ERROR', error: error.message})
      console.log("error", error.message);
    }
  }

  useEffect(() => {
    fetchData();
    
  }, []);

  console.log(state)
  return (
    <div>
      {state.errorMessage ? <Alert severity="error" style={{ marginBottom: 8 }}><div>{state.errorMessage}</div></Alert> : null }
      <div className="tableOuter">
        <div className="tableInner">
          {state.loading ? <CircularProgress color="secondary" /> : ((state.errorMessage === '') ?
          <div style={{ height: 600, width: '100%' }} >
            {state.users.map( (user) => (
              <p key={user.id}>{user.name}</p>
            ))}
          </div>
          : null)
          }
        </div>
      </div>
    </div>
  )
}

export default DataFetching
