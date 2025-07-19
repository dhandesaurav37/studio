
"use client";

import React, { useState, useEffect } from 'react';

export function CountdownTimer() {
  const calculateTimeLeft = () => {
    // Set a target date for the countdown.
    // For this example, let's set it to 1 day from now.
    const difference = +new Date().setHours(new Date().getHours() + 24) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval as keyof typeof timeLeft]) {
      return;
    }

    timerComponents.push(
      <div key={interval} className="flex flex-col items-center">
        <div className="text-3xl md:text-5xl font-bold text-red-500 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
          {String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}
        </div>
        <div className="text-xs md:text-sm uppercase tracking-wider mt-2">
          {interval}
        </div>
      </div>
    );
  });

  return (
    <div className="text-center py-8 mt-8">
      <h3 className="text-lg font-semibold text-red-500 mb-4">
        Official Spiderman Backpack Goes Live In
      </h3>
      <div className="flex justify-center gap-4 md:gap-8">
        {timerComponents.length ? timerComponents : <span>Time's up!</span>}
      </div>
    </div>
  );
}
