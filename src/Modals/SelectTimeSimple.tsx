import {
    Modal,
    Button,
    TextField,
    IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Close";  // cross icon
import moment from "moment";
import { useState } from "react";
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { showWarning } from "../constants/toast";

interface Slot {
    start: string;
    end: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    selectedDates: string[];
    slots: Slot[];
    setSlots: React.Dispatch<React.SetStateAction<Slot[]>>;
}

export default function SelectTimeSlotModal({
    open,
    onClose,
    selectedDates,
    slots,
    setSlots
}: Props) {
    const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);



    // Deduplicate slot times by start+end time (ignoring date)
    const uniqueTimes = Array.from(
        new Set(
            slots.map(s => {
                const localStart = moment.utc(s.start).local().format('HH:mm');
                const localEnd = moment.utc(s.end).local().format('HH:mm');
                return `${localStart}-${localEnd}`;
            })
        )
    );

    const handleAddSlots = (time: Dayjs | null) => {
        if (!time) return;

        const newSlots: Slot[] = [];

        for (const date of selectedDates) {
            const startMoment = moment.utc(`${date}T${time.format('HH:mm')}`); // save UTC
            const endMoment = startMoment.clone().add(1, 'hour');

            const isToday = date === moment().format('YYYY-MM-DD');
            if (isToday && startMoment.local().isBefore(moment())) {
                showWarning(`Please select a future time for today`);
                return;
            }

            const sameStart = slots.some(s =>
                moment(s.start).format('YYYY-MM-DD') === date &&
                moment(s.start).format('HH:mm') === startMoment.format('HH:mm')
            );
            if (sameStart) {
                showWarning(`Slot already exists on ${moment(date).format('MMM DD')}`);
                return;
            }

            const duplicate = slots.some(s =>
                moment(s.start).format('YYYY-MM-DD') === date &&
                moment(s.start).isSame(startMoment)
            );
            if (duplicate) {
                showWarning(`Slot already exists`);
                return;
            }

            newSlots.push({
                start: startMoment.toISOString(),
                end: endMoment.toISOString(),
            });
        }

        setSlots(prev => [...prev, ...newSlots]);
    };


    const handleRemoveTime = (timeKey: string) => {
        const [startTime] = timeKey.split('-');
        setSlots(prev =>
            prev.filter(s =>
                moment.utc(s.start).local().format('HH:mm') !== startTime
            )
        );
    };

    return (
        <Modal open={open} onClose={onClose} className="modal selectTime_modal">
            <div className="modal-dialog">
                <div className="modal-body">
                    <div className="btn-close">
                        <CloseIcon onClick={onClose} />
                    </div>
                    <h2>Select Time Slot</h2>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            label="Select Start Time"
                            value={selectedTime}
                            onChange={(time) => setSelectedTime(time)}
                            onAccept={(time) => handleAddSlots(time)}
                        />
                    </LocalizationProvider>

                    <div className="time-slots-list">
                        {uniqueTimes.map((timeKey, idx) => {
                            const [start, end] = timeKey.split('-');
                            return (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                                    <p style={{ margin: 0 }}>
                                        {moment(start, 'HH:mm').format('hh:mm A')} - {moment(end, 'HH:mm').format('hh:mm A')}
                                    </p>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveTime(timeKey)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            );
                        })}
                    </div>


                    <div className="form_btn">
                        <Button variant="outlined" onClick={onClose}>Close</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
