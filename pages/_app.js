import 'tailwindcss/tailwind.css'
import '@splidejs/react-splide/css';
import '../styles/main.scss'
import { AppContext } from '../lib/reactContexts';
import { useReducer } from 'react';

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
      }
    default:
      throw new Error('Unknown reducer action');
  }
}

function App({ Component, pageProps }) {
  const [appState, dispatchAppAction] = useReducer(appReducer, {
    searchTerm: ""
  })

  return (
    <AppContext.Provider value={{ appState, dispatchAppAction }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default App