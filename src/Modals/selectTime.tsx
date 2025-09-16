import {
  Checkbox,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TextField, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Button from "@mui/material/Button";
import moment from "moment";
import { showToast, showWarning } from "../constants/toast";
import clsx from "clsx";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface SelectTimeProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  teachingSlots?: any;
  selectedDates?: any;
  setSelectedDates?: any;
  selectedTime?: any;
  setSelectedTime?: any;
  bookSlots?: any;
  setBookSlots?: any;
  time?: any;
  setTime?: any;
  customStart?: any;
  customEnd?: any;
  setCustomStart: Dispatch<SetStateAction<any>>;
  setCustomEnd: Dispatch<SetStateAction<any>>;
  teachingStartTime: string;
  teachingEndTime: string;

}

export default function SelectTimeModal({
  open,
  onClose,
  setOpen,
  teachingSlots,
  selectedDates,
  selectedTime,
  setSelectedDates,
  setSelectedTime,
  bookSlots,
  setBookSlots,
  setTime,
  time,
  customStart,
  customEnd, setCustomEnd, setCustomStart, teachingStartTime, teachingEndTime
}: SelectTimeProps) {



  const handleTimeChange = (time: Dayjs | null) => {
    setSelectedTime(-1);
    setTime({
      start: "",
      end: "",
    });
    if (time) {
      const utcTime = time.utc().format();
      setCustomStart(utcTime);
    } else {
      setCustomStart(null);
    }

  };

  const handleTimeChangeEnd = (time: Dayjs | null) => {
    setSelectedTime(-1);
    if (time) {
      const utcTime = time.utc().format();
      setCustomEnd(utcTime);
      setTime({
        start: customStart,
        end: utcTime
      })
    } else {
      setCustomEnd(null);
    }


  };

  const checkBookedSlot = (
    teachingSlot: { start: string; end: string },
    bookedSlotArray: [{ startTime: string; endTime: string }]
  ) => {
    for (let i = 0; i < bookedSlotArray?.length; i++) {
      let slot = bookedSlotArray[i];

      if (
        moment(teachingSlot?.start)
          .set({
            date: moment().get("date"),
            month: moment().get("month"),
            year: moment().get("year"),
          })
          .isBetween(
            moment(slot?.startTime).set({
              date: moment().get("date"),
              month: moment().get("month"),
              year: moment().get("year"),
            }),
            moment(slot?.endTime).set({
              date: moment().get("date"),
              month: moment().get("month"),
              year: moment().get("year"),
            })
          ) ||
        moment(teachingSlot?.start)
          .set({
            date: moment().get("date"),
            month: moment().get("month"),
            year: moment().get("year"),
          })
          ?.isSame(
            moment(slot?.startTime).set({
              date: moment().get("date"),
              month: moment().get("month"),
              year: moment().get("year"),
            })
          ) ||
        moment(teachingSlot?.end)
          .set({
            date: moment().get("date"),
            month: moment().get("month"),
            year: moment().get("year"),
          })
          .isBetween(
            moment(slot?.startTime).set({
              date: moment().get("date"),
              month: moment().get("month"),
              year: moment().get("year"),
            }),
            moment(slot?.endTime).set({
              date: moment().get("date"),
              month: moment().get("month"),
              year: moment().get("year"),
            })
          )
      ) {
        return true;
      }
    }
    return false;
  };

  const calculateTotalTime = () => {
    if (customStart && customEnd) {
      const start = moment(customStart);
      const end = moment(customEnd);
      const diffInMinutes = end.diff(start, 'minutes');
      const totalMinutes = diffInMinutes * (selectedDates?.length || 1);
      const totalHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;

      return `${totalHours}hours ${remainingMinutes}m`;
    }

    return "";
  };





  return (
    <Modal
      className="modal selectTime_modal"
      id="selectTimeModal"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
      onClose={onClose}
    >
      <div className="modal-dialog">
        <div className="modal-body">
          <div className="btn-close">
            <CloseIcon onClick={() => setOpen(false)} />
          </div>
          <h2>Select Time Slot For Booking</h2>
          <form className="form">
            {(selectedTime !== -1 && selectedDates?.length > 0) || (customEnd && customStart) ? (
              <div className="control_group flex">
                <label> Total Hours</label>
                <div className="quantity">
                  <TextField
                    hiddenLabel
                    type="text"
                    InputProps={{
                      readOnly: true,
                    }}
                    value={selectedTime !== -1 ? `${selectedDates?.length} hour` : calculateTotalTime()}
                    inputProps={{ min: 1 }}
                  />
                </div>
              </div>
            ) : null}
            <div className="control_group">

              <div className="time-slots-container">
                {teachingSlots
                  ?.filter(
                    // @ts-ignore
                    (slot) =>
                      !(
                        selectedDates?.includes(
                          moment().format("YYYY-MM-DD")
                        ) &&
                        moment(slot?.start)
                          .set({
                            date: moment().get("date"),
                            month: moment().get("month"),
                            year: moment().get("year"),
                          })
                          .isBefore(moment())
                      )
                  )
                  ?.map((item: any, index: any) => {
                    const isBooked = checkBookedSlot(
                      item,
                      bookSlots
                        // @ts-ignore
                        ?.filter((bookedDate) =>
                          selectedDates?.includes(
                            moment(bookedDate?.date).format("YYYY-MM-DD")
                          )
                        )
                        // @ts-ignore
                        ?.map((item) => item?.bookings)
                        .flat()
                    );
                    return (
                      <p
                        onClick={() => {
                          if (isBooked) {
                            showWarning("Slot is already booked");
                          } else {
                            setSelectedTime(index);
                            setTime(item);
                            setCustomEnd(null)
                            setCustomStart(null)
                          }
                        }}
                        className={clsx({
                          booked: isBooked,
                          available: !isBooked && !(index === selectedTime),
                          selected: index === selectedTime,
                        })}
                        key={index}
                      >
                        {`${moment(item.start).format(
                          "hh:mm A"
                        )} - ${moment(item.end).format("hh:mm A")}`}
                      </p>
                    );
                  })}
                <h6 className="customHeading">Choose custom time slot</h6>
                <div className="customTime">
                  <div className="control_group w_50 mar">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        className="label_hidden"
                        label="Start Time"
                        onChange={handleTimeChange}
                        minutesStep={30}
                        minTime={teachingStartTime ? dayjs(teachingStartTime) : undefined}
                        value={customStart ? dayjs(customStart) : null}
                        closeOnSelect={false}

                      />
                    </LocalizationProvider>
                  </div>
                  <div className="control_group w_50 mar">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        className="label_hidden"
                        label="End Time"
                        minutesStep={30}
                        onChange={handleTimeChangeEnd}
                        value={customEnd ? dayjs(customEnd) : null}
                        disabled={!customStart}
                        maxTime={teachingEndTime ? dayjs(teachingEndTime) : undefined}
                        minTime={customStart ? dayjs(customStart) : undefined}
                        closeOnSelect={false}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
            </div>

            <div className="form_btn">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setOpen(false);
                  setSelectedTime(-1);
                  setCustomStart(null);
                  setCustomEnd(null)
                }}
              >
                Cancel
              </Button>
              <Button color="primary" onClick={() => {
                if (selectedTime === -1 && customStart === null && customEnd === null) {
                  showWarning("Please select time slot");
                } else if (customStart !== null && customEnd === null) {
                  showWarning("Please select end time")
                  return;
                }
                setOpen(false)
              }}>
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
