import React, { useState } from "react";
import './Archive.css';

const Archive = ({ onDateSelect }) => {
    const numDays = 30;
    const today = new Date();
    const [dates] = useState(
        Array.from({ length: numDays }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            return d.toISOString().split("T")[0];
        })
    )

    const handleDateChange = (e) => {
        onDateSelect(e.target.value);
    }

    return (
    <select
      className="archive"
      name="archive"
      id="archive"
      onChange={handleDateChange}
    >
      {dates.map((date) => (
        <option key={date} value={date}>
          {date}
        </option>
      ))}
    </select>
  );
};

export default Archive;
