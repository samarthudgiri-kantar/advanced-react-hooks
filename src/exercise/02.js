// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      // 🐨 replace "data" with "data"
      return { status: 'pending', data: null, error: null }
    }
    case 'resolved': {
      return { status: 'resolved', data: action.data, error: null }
    }
    case 'rejected': {
      return { status: 'rejected', data: null, error: action.error }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useAsync(initialState) {
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState
  })

  const mountedRef = React.useRef(false);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    }
  }, [])

  const dispatch = React.useCallback((...args) => {
    if (mountedRef) {
      unsafeDispatch(...args)
    }
  }, []);

  const run = React.useCallback(promise => {
    dispatch({ type: 'pending' })
    promise.then(
      data => {
        dispatch({ type: 'resolved', data })
      },
      error => {
        dispatch({ type: 'rejected', error })
      },
    )
  }, [dispatch])

  // #2
  // React.useEffect(() => {
  //   // 💰 this first early-exit bit is a little tricky, so let me give you a hint:
  //   const promise = asyncCallback()
  //   if (!promise) {
  //     return
  //   }
  //   dispatch({ type: 'pending' })
  //   promise.then(
  //     data => {
  //       dispatch({ type: 'resolved', data })
  //     },
  //     error => {
  //       dispatch({ type: 'rejected', error })
  //     },
  //   )
  // }, [asyncCallback])
  return {...state, run};
}

function PokemonInfo({ pokemonName }) {
  // const asyncCallback = React.useCallback(
  //   () => {
  //     if (!pokemonName) {
  //       return
  //     }
  //     return fetchPokemon(pokemonName)
  //   }, [pokemonName]
  // )

  // const state = useAsync(
  //   asyncCallback,
  //   { status: pokemonName ? 'pending' : 'idle' }
  // )

  // const { data: pokemon, status, error } = state

  // #2
  // 💰 destructuring this here now because it just felt weird to call this
  // "state" still when it's also returning a function called "run" 🙃
  const { data: pokemon, status, error, run } = useAsync({ status: pokemonName ? 'pending' : 'idle' })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    // 💰 note the absence of `await` here. We're literally passing the promise
    // to `run` so `useAsync` can attach it's own `.then` handler on it to keep
    // track of the state of the promise.
    const pokemonPromise = fetchPokemon(pokemonName)
    run(pokemonPromise)
  }, [pokemonName, run])

  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
