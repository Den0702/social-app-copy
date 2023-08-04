import { useState } from 'react';

export default function Stopwatch() {
  //const [startTime, setStartTime] = useState(0);
  const [counter, setCounter] = useState(0);

  function handleStart() {
    // Start counting.
  
    let id = setInterval(() => {
      // Update the current time every 10ms.
      setCounter(counter => {
        return counter + 1 
      });
    }, 1000);
  }

  return (
    <>
      <h1>Counted: {counter}</h1>
      <button onClick={handleStart}>
        Start
      </button>
    </>
  );
}


/* import React, { useEffect, useState } from 'react';

function App() {
    const [count, setCount] = useState(0);

    let id = setInterval(() => {
        setCount(count => {
            return count + 1
        });

        //clearInterval(interval);
    }, 1000);

    return (
        <div>
            <p>Counted {count} times</p>
        </div>
    );
}

export default App; */

/* import React, { useEffect, useState } from 'react';
import "./App.css";

function App() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let interval = setInterval(() => {
            setCount(count => {
                return count + 1
            });
        }, 10000);

        return () => {
            clearInterval(interval)
        }
    })

    return (
        <div>
            <p>Counted {count} times</p>
        </div>
    );
}

export default App;  */

/* function App() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let interval = setInterval(() => {
            setCount(count => {
                return count + 1
            });
        }, 1000);

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <div>
            <p>Counted {count} times</p>
        </div>
    );
}

export default App;  */

/* function App() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let interval = setInterval(() => {
            setCount(count + 1);
        }, 1000);

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <div>
            <p>Counted {count} times</p>
        </div>
    );
}

export default App; */

