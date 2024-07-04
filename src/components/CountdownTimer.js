import React, { useState, useEffect, useRef } from 'react';
import './CountdownTimer.css';

const CountdownTimer = () => {
  const [time, setTime] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [tileColor, setTileColor] = useState('#009DFF');
  const [tiles, setTiles] = useState([]);
  const endTimeRef = useRef(null);

  const rows = 10;
  const cols = 10;
  const totalTiles = rows * cols;

  useEffect(() => {
    const initialTiles = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(tileColor));
    setTiles(initialTiles);
  }, [tileColor]);

  useEffect(() => {
    if (isRunning && endTimeRef.current) {
      const updateTilesAndTime = () => {
        const currentTime = Date.now();
        const remainingTime = Math.max(0, Math.floor((endTimeRef.current - currentTime) / 1000));
        setTime(remainingTime);

        const percentage = remainingTime / (hours * 3600 + minutes * 60 + seconds);
        const blackTilesCount = Math.floor(totalTiles * (1 - percentage));

        const updatedTiles = Array(rows)
          .fill(null)
          .map(() => Array(cols).fill(tileColor));

        let count = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (count < blackTilesCount) {
              updatedTiles[r][c] = 'black';
              count++;
            }
          }
        }

        setTiles(updatedTiles);

        if (remainingTime <= 0) {
          setIsRunning(false);
          clearInterval(interval);
        }
      };

      const interval = setInterval(updateTilesAndTime, 1000);
      updateTilesAndTime(); // Update immediately without waiting for the first interval

      return () => clearInterval(interval);
    }
  }, [isRunning, hours, minutes, seconds, tileColor, totalTiles]);

  const startTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds > 0) {
      setTime(totalSeconds);
      setIsRunning(true);
      endTimeRef.current = Date.now() + totalSeconds * 1000;
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTiles(Array(rows).fill(null).map(() => Array(cols).fill(tileColor)));
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="countdown-timer flex flex-col items-center p-4">
      <div className="grid grid-cols-10 gap-1 mb-8" style={{ width: '350px', height: '350px' }}>
        {tiles.flat().map((color, index) => (
          <div
            key={index}
            className="aspect-square"
            style={{
              backgroundColor: color,
              width: '30px',
              height: '30px',
            }}
          ></div>
        ))}
      </div>
      <div className="text-4xl font-bold mb-8">{formatTime(time)}</div>
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
          placeholder="HH"
          className="input-timer"
        />
        <span className="self-center">:</span>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
          placeholder="MM"
          className="input-timer"
        />
        <span className="self-center">:</span>
        <input
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
          placeholder="SS"
          className="input-timer"
        />
      </div>
      <div className="flex gap-2 mb-4">
        <button 
          onClick={startTimer} 
          disabled={isRunning}
          className="btn-start"
        >
          Start
        </button>
        {isRunning && (
          <button 
            onClick={stopTimer}
            className="btn-stop"
          >
            Stop
          </button>
        )}
        <button 
          onClick={resetTimer}
          className="btn-reset"
        >
          Reset
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="color"
          value={tileColor}
          onChange={(e) => setTileColor(e.target.value)}
          className="w-12 h-12"
        />
        <span className="self-center">Choose tile color</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
