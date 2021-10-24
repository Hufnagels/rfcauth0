import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Material
import {
  Grid,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Button,
} from '@mui/material'

import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCountCurrent,
  selectCountPrev,
} from '../../../redux/reducers/counterSlice';
import styles from './Counter.module.css';
import { store } from '../../../redux/store/store';

const Counter = (props) => {
  const count = useSelector(selectCountCurrent);
  const prevcount = useSelector(state => state.counter.past.value)
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

  const state = store.getState();

  React.useEffect(() => {
    console.log(state => state.counter.past.value)
    return () => {
      console.log()
    }
  }, [count])

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader 
              title={'Counter'}
              subheader={new Date(Date.now()).toDateString()}
            />
            <CardContent>
              <div className={styles.row}>
                <button
                  className={styles.button}
                  aria-label="Decrement value"
                  onClick={() => dispatch(decrement())}
                >
                  -
                </button>
                <span className={styles.value}>Prevcount: {prevcount}, Count: {count}</span>
                <button
                  className={styles.button}
                  aria-label="Increment value"
                  onClick={() => dispatch(increment())}
                >
                  +
                </button>
              </div>
              <div className={styles.row}>
                <input
                  className={styles.textbox}
                  aria-label="Set increment amount"
                  value={incrementAmount}
                  onChange={(e) => setIncrementAmount(e.target.value)}
                />
                <button
                  className={styles.button}
                  onClick={() => dispatch(incrementByAmount(incrementValue))}
                >
                  Add Amount
                </button>
                <button
                  className={styles.asyncButton}
                  onClick={() => dispatch(incrementAsync(incrementValue))}
                >
                  Add Async
                </button>
                <button
                  className={styles.button}
                  onClick={() => dispatch(incrementIfOdd(incrementValue))}
                >
                  Add If Odd
                </button>
              </div>
            </CardContent>
            <CardActions>

            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment> 
  );
}

export default Counter