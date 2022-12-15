// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

// #1
// function countReducer(state, newState) {
//   return newState;
// }

// #2
// function countReducer(count, step) {
//   return count + step;
// }

// #3
// const countReducer = (state, action) => ({ ...state, ...action });

// #4
// const countReducer = (state, action) => ({ 
//   ...state, 
//   ...(typeof action === 'function' ? action(state) : action) 
// });

// #5
function countReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': {
      return { count: state.count + action.step }
    }
    default: {
      throw new Error(`Unsupported action type ${action.type}`)
    }
  }

}

function Counter({ initialCount = 0, step = 9 }) {

  // #1
  // The 1st argument is called "state" - the current value of count
  // The 2nd argument is called "newState" - the value passed to setCount
  // const [count, setCount] = React.useReducer(countReducer, initialCount)
  // const increment = () => setCount(count + step)


  // #2
  // const [count, changeCount] = React.useReducer(countReducer, initialCount)
  // const increment = () => changeCount(step)

  // #3
  // const [state, setState] = React.useReducer(countReducer, {
  //   count: initialCount,
  // })
  // const { count } = state
  // const increment = () => setState({ count: count + step })

  // #4
  // const [state, setState] = React.useReducer(countReducer, {
  //   count: initialCount,
  // })
  // const { count } = state
  // const increment = () =>
  //   setState(currentState => ({ count: currentState.count + step }))

  // #5
  const [state, dispatch] = React.useReducer(countReducer, {
    count: initialCount,
  })
  const { count } = state
  const increment = () => dispatch({ type: 'INCREMENT', step })

  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
