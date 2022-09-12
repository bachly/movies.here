import 'tailwindcss/tailwind.css'
import '@splidejs/react-splide/css';
import '../styles/main.scss'
import { AppContext } from '../lib/reactContexts';
import { useEffect, useReducer } from 'react';

function appReducer(state, action) {
  switch (action.type) {
    case "changeSearchTerm":
      return {
        ...state,
        searchTerm: action.payload
      }
    case "clearSearch":
      return {
        ...state,
        searchTerm: "",
        foundMovies: null
      }
    case "setFoundMovies":
      return {
        ...state,
        foundMovies: action.payload
      }
    case "addToWatchlist":
      const watchlist = state.watchlist[action.payload.watchlistId];
      let updatedWatchlist;

      if (!watchlist) {
        updatedWatchlist = {
          movies: {
            [action.payload.movie.id]: action.payload.movie
          }
        }
        console.log('updatedWatchlist 1', updatedWatchlist)
      } else {
        updatedWatchlist = {
          ...watchlist,
          movies: {
            ...watchlist.movies,
            [action.payload.movie.id]: action.payload.movie
          }
        }
        console.log('updatedWatchlist 2', updatedWatchlist)
      }

      return {
        ...state,
        watchlist: {
          [action.payload.watchlistId]: updatedWatchlist
        }
      }

    default:
      throw new Error('Unknown reducer action');
  }
}

function App({ Component, pageProps }) {
  const [appState, dispatchAppAction] = useReducer(appReducer, {
    searchTerm: "",
    foundMovies: null,
    watchlist: {}
  })

  useEffect(function watchlistChanged() {
    if (appState.watchlist) {
      console.log('watchlistChanged', appState.watchlist)
    }
  }, [appState.watchlist])

  return (
    <AppContext.Provider value={{ appState, dispatchAppAction }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default App