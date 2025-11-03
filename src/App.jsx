import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import alarmSound from "./alarm.mp3";


//coutoun function

function CountdownTimer() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [amPm, setAmPm] = useState("AM");
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const combineDateTime = () => {
    if (!date || !time) return null;
    let [hours, minutes] = time.split(":").map(Number);
    if (amPm === "PM" && hours < 12) hours += 12;
    if (amPm === "AM" && hours === 12) hours = 0;

    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
  };
  //validation for inputs

  const validateInputs = () => {
    const errors = {};
    const targetDateTime = combineDateTime();

    if (!date) errors.date = "Please select a date.";
    if (!time) errors.time = "Please select a time.";
    if (targetDateTime && targetDateTime.getTime() <= Date.now())
      errors.time = "Please select a future date and time.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //start countdown

  const startCountdown = () => {
    if (!validateInputs()) return;

    const targetTime = combineDateTime().getTime();
    setMessage("");
    setIsRunning(true);
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const timeDiff = targetTime - currentTime;

      if (timeDiff <= 0) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        setMessage("🎉 Time is up!");
        if (audioRef.current) audioRef.current.play();
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    }, 1000);
  };

  //stop countdown

  const stopCountdown = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setMessage("⏸️ Countdown stopped.");
  };

  const resetCountdown = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setDate("");
    setTime("");
    setAmPm("AM");
    setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
    setMessage("");
    setErrors({});
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="timer-wrapper">
      <div className="animated-bg"></div>
      <div className="timer-card">
        <h1 className="title">⏳ Countdown Timer</h1>

        <div className="input-row">
          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
            {errors.date && <div className="error-msg">{errors.date}</div>}
          </div>

          <div className="time-select">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-field"
            />
            <select
              value={amPm}
              onChange={(e) => setAmPm(e.target.value)}
              className="input-field"
            >
              <option>AM</option>
              <option>PM</option>
            </select>
            {errors.time && <div className="error-msg">{errors.time}</div>}
          </div>
        </div>

        <div className="button-group">
          <button
            className="start-button"
            onClick={startCountdown}
            disabled={isRunning}
          >
            Start Countdown
          </button>
          <button
            className="stop-button"
            onClick={stopCountdown}
            disabled={!isRunning}
          >
            Stop
          </button>
          <button className="reset-button" onClick={resetCountdown}>
            Reset
          </button>
        </div>

        <div className="countdown-display">
          {Object.keys(timeLeft).map((key) => (
            <div className="time-box" key={key}>
              <span className="time-value animate">{timeLeft[key]}</span>
              <span className="time-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
            </div>
          ))}
        </div>

        {message && <div className="message">{message}</div>}
      </div>

      <audio ref={audioRef} src={alarmSound} />
    </div>
  );
}

export default CountdownTimer;
