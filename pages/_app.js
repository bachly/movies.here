import 'tailwindcss/tailwind.css'
import '@splidejs/react-splide/css';
import '../styles/main.scss'

function MyApp({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  );
}

export default MyApp