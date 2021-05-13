import React, { useEffect, useState } from 'react';
import { fromEvent, interval } from 'rxjs';
import { buffer, debounceTime, filter } from 'rxjs/operators';
import styled from 'styled-components';
import ButtonGroup from './components/ButtonGroup';

const Timer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Time = styled.h1`
  font-size: 6rem;
  margin: 30px 0;
`;

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
    <Timer>
      <Time>{new Date(time).toISOString().slice(-13, -5)}</Time>
      <ButtonGroup enabled={enabled} />
    </Timer>
  );
}
