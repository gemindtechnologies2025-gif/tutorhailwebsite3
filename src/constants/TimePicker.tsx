import React from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface CustomTimePickerProps {
    label: string;
    value: Dayjs | null;
    onChange: (value: Dayjs | null) => void;
    minTime?: Dayjs;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ label, value, onChange, minTime }) => {


    const handleChange = (time: Dayjs | null) => {
        if (time) {
            const minutes = time.minute();
            const roundedMinutes = Math.round(minutes / 30) * 30;
            const adjustedTime = time
                .minute(roundedMinutes)
                .second(0)
                .millisecond(0);  

            if (!time.isSame(adjustedTime)) {
                onChange(adjustedTime);
            }
        } else {
            onChange(time);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
                label={label}
                value={value}
                onChange={handleChange}
                minTime={minTime}
                views={['hours', 'minutes']}
            />
        </LocalizationProvider>
    );
};

export default CustomTimePicker;
