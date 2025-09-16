import { Button, Modal } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import dayjs from "dayjs";

import { DayMouseEventHandler, DayPicker } from "react-day-picker";
import { isSameDay, isAfter, startOfDay } from "date-fns";
import "react-day-picker/style.css";
import moment from "moment";
interface SelectDateProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedDates: string[];
  setSelectedDates: Dispatch<SetStateAction<string[]>>;
  value: Date[];
  setValue: Dispatch<SetStateAction<Date[]>>;
}

export default function SelectDateModal({
  open,
  onClose,
  setOpen,
  selectedDates,
  setSelectedDates,
  setValue,
  value,
}: SelectDateProps) {
  const [dateVal, setDateVal] = useState<string[]>([]);
  const handleDayClick: DayMouseEventHandler = (day, modifiers) => {
    const newValue = [...value];
    if (modifiers.selected) {
      const index = value?.findIndex((d) => isSameDay(day, d));
      newValue.splice(index, 1);
    } else {
      newValue.push(day);
    }
    setValue(newValue);
    setDateVal(() => {
      return newValue?.map((item) => moment(item).format("YYYY-MM-DD"));
    });
  };

  const handleResetClick = () => {
    setSelectedDates([]);
    setValue([])
  };

  const isPastDate = (date: Date) => {
    const today = startOfDay(new Date());
    return isAfter(today, date);
  };
  return (
    <Modal
      className="modal selectDate_modal"
      id="selectDateModal"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
      onClose={()=>{
        // handleResetClick();
        onClose();
      }}
    >
      <div className="modal-dialog">
        <div className="modal-body">
          <div className="btn-close">
            <CloseIcon onClick={() => {setOpen(false);}} />
          </div>
          <h2>Select Date For Booking</h2>
          <form className="form">
            <DayPicker
              onDayClick={handleDayClick}
              modifiers={{ selected: value }}
              disabled={isPastDate}
              modifiersStyles={{
                disabled: { color: "#ccc" },
              }}
              footer={
                <Button
                  sx={{ width: "100px" }}
                  onClick={() => {
                    setSelectedDates([...dateVal]);
                    setOpen(false);
                  }}
                >
                  Save
                </Button>
              }
            />
          </form>
        </div>
      </div>
    </Modal>
  );
}
