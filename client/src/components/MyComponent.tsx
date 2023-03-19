import { useContext } from "react";
import theme from '../context/index'

const MyComponent = () => {
  const theme = useContext(ThemeContext);

  return <p>The current theme is {theme}.</p>;
};