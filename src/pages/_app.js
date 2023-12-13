import store from "@/redux/store";
import "@/styles/globals.css";
import "swiper/css";
import { Provider } from "react-redux";
import "react-html5video/dist/styles.css";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
