import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomDatePicker({ changeDueDate, customStyle = "" }) {
    const [startDate, setStartDate] = useState(new Date());
    const changeHandler = (date) => {
        setStartDate(date);
        changeDueDate(date);
    };
    return (
        <DatePicker
            selected={startDate}
            onChange={(date) => changeHandler(date)}
            className={`${customStyle}`}
        />
    );
}
