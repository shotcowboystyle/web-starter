import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => setCount(count + 1)}
      type="button"
    >
      Clicked {count} times
    </button>
  );
}
