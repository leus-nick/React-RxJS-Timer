import React, { useEffect, useState } from 'react';
import { fromEvent, interval } from 'rxjs';
import { buffer, debounceTime, filter } from 'rxjs/operators';

export default function App() {
  const [time, setTime] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const timer$ = interval(1000);
    const toggleButtonClick$ = fromEvent(document.querySelector('.toggleTimerButton'), 'click');
    const resetButtonClick$ = fromEvent(document.querySelector('.resetButton'), 'click');
    const waitButtonClick$ = fromEvent(document.querySelector('.waitButton'), 'click');
    const doubleWaitButtonClick$ = waitButtonClick$.pipe(
      buffer(waitButtonClick$.pipe(debounceTime(299))),
      filter((clicks) => clicks.length === 2),
    );

    const timerSubscription = timer$.subscribe({
      next: () => {
        if (enabled) {
          setTime((timerCount) => timerCount + 1000);
        }
      },
    });

    const toggleSubscription = toggleButtonClick$.subscribe({
      next: () => {
        setEnabled(!enabled);
        if (enabled) setTime(0);
      },
    });

    const resetSubscription = resetButtonClick$.subscribe({
      next: () => {
        setTime(0);
      },
    });

    const waitButtonSubscription = doubleWaitButtonClick$.subscribe({
      next: () => {
        setEnabled(false);
      },
    });

    return () => {
      toggleSubscription.unsubscribe();
      timerSubscription.unsubscribe();
      resetSubscription.unsubscribe();
      waitButtonSubscription.unsubscribe();
    };
  }, [enabled]);

  return (
    <div>
      <h1>{new Date(time).toISOString().slice(-13, -5)}</h1>
      <button className='toggleTimerButton' type='button'>
        {!enabled ? 'Start' : 'Stop'}
      </button>
      <button className='resetButton' type='button'>
        Reset
      </button>
      <button className='waitButton' type='button'>
        Wait
      </button>
    </div>
  );
}
