import {
  useState
} from "react";

export function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(update, replace = false) {
    if (replace) {
      history.pop();
    }
    history.push(update);
    setHistory(history);
    return setMode(update);
  }

  function back() {
    if (history.length > 1) {
      history.pop();
      setHistory(history);
    }
    return setMode(history[history.length - 1]);
  }

  return {
    mode,
    transition,
    back
  };
}
