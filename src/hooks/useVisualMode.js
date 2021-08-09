import { useState } from 'react';

export function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  function transition(update, replace = false) {
    setHistory((prev) => {
      const newHistory = [...prev];

      if (replace) {
        newHistory.pop();
      }

      newHistory.push(update);
      return newHistory;
    });
  }

  function back() {
    if (history.length < 2) {
      return;
    }

    setHistory((prev) => {
      const newHistory = [...prev];
      newHistory.pop();
      return newHistory;
    });
  }

  const mode = history[history.length - 1];
  return {
    mode,
    transition,
    back
  };
}
