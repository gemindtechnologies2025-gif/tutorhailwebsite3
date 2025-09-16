import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { showError } from "../constants/toast";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  slotDates: string[];
  setSlotDates: Dispatch<SetStateAction<string[]>>;
  startDate: string | null;
  setStartDate: Dispatch<SetStateAction<string | null>>;
  endDate: string | null;
  setEndDate: Dispatch<SetStateAction<string | null>>;
  repeatEveryWeeks: number;
  setRepeatEveryWeeks: Dispatch<SetStateAction<number>>;
  continueForWeeks: number;
  setContinueForWeeks: Dispatch<SetStateAction<number>>;
  slotTime: { [dayIndex: number]: { start: string; end: string }[] };
  setSlotTime: Dispatch<
    SetStateAction<{ [dayIndex: number]: { start: string; end: string }[] }>
  >;
  slotDuration: number;
  setSlotDuration: Dispatch<SetStateAction<number>>;
  selectedTime: string;
  setSelectedTime: Dispatch<SetStateAction<string>>;
  formSubmitted: boolean;
}

export default function CustomSelector({
  slotDates,
  setSlotDates,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  repeatEveryWeeks,
  setRepeatEveryWeeks,
  continueForWeeks,
  setContinueForWeeks,
  slotTime,
  setSlotTime,
  slotDuration,
  setSlotDuration,
  selectedTime,
  setSelectedTime,
  formSubmitted,
}: Props) {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [durationType, setDurationType] = useState<"weeks" | "date">("weeks");
  const [endDateLocal, setEndDateLocal] = useState<Date | null>(null);
  const [isMultiDayMode, setIsMultiDayMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDayForSlots, setCurrentDayForSlots] = useState<number | null>(
    null
  );

  // Set initial startDate
  useEffect(() => {
    if (!startDate) {
      const today = dayjs().toISOString();
      setStartDate(today);
    }
  }, [startDate, setStartDate]);

  useEffect(() => {
    if (slotDates.length && selectedDays.length === 0) {
      const uniqueDays = Array.from(
        new Set(slotDates.map((iso) => new Date(iso).getDay()))
      );
      setSelectedDays(uniqueDays);
      setIsMultiDayMode(uniqueDays.length > 1);
      // Set the first day as current for slot management if not in multi-day mode
      if (uniqueDays.length > 0 && !isMultiDayMode) {
        setCurrentDayForSlots(uniqueDays[0]);
      }
    }
  }, [slotDates, selectedDays, isMultiDayMode]);

  // Validate and set endDate based on durationType
  useEffect(() => {
    if (!startDate) return;
    const start = dayjs(startDate);
    if (durationType === "weeks") {
      if (continueForWeeks < 1) {
        setError("Duration must be at least 1 week");
        return;
      }
      const calculatedEnd = start.add(continueForWeeks, "week");
      setEndDate(calculatedEnd.toISOString());
      setError(null);
    } else if (durationType === "date") {
      if (endDateLocal) {
        if (!endDateLocal) {
          setError("Please select an end date");
          setEndDate(null);
          return;
        }
        if (dayjs(endDateLocal).isSameOrBefore(start)) {
          setError("End date must be after start date");
          return;
        }
        setEndDate(dayjs(endDateLocal).toISOString());
        setError(null);
      }
    }
  }, [durationType, continueForWeeks, endDateLocal, startDate, setEndDate]);

  const handleDurationTypeChange = (type: "weeks" | "date") => {
    setDurationType(type);
    if (type === "weeks") {
      setEndDateLocal(null);
      setEndDate(null);
    } else if (type === "date") {
      setContinueForWeeks(0);
    }
  };

  // Auto-calculate slotDates based on selected days with validation
  useEffect(() => {
    if (!startDate || !endDate || selectedDays.length === 0) {
      setSlotDates([]);
      return;
    }
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    if (end.isSameOrBefore(start)) {
      setError("End date must be after start date");
      setSlotDates([]);
      return;
    }

    // Generate all dates between start and end
    const allDates = [];
    let current = start;
    while (current.isSameOrBefore(end)) {
      allDates.push(current);
      current = current.add(1, "day");
    }

    const filtered = allDates.filter((date) => {
      const weekOffset = Math.floor(date.diff(start, "week"));
      const getWeekDays = Object.keys(slotTime)?.map((item) => Number(item));
      return (
        weekOffset % repeatEveryWeeks === 0 &&
        getWeekDays?.length !== 0 &&
        getWeekDays.includes(date.day())
      );
    });
    if (filtered.length === 0) {
      setError("No dates match the selected criteria");
    } else {
      setError(null);
    }
    const slotDatesISO = filtered.map((d) => d.toISOString());
    console.log("Final slotDates:", slotDatesISO);
    setSlotDates(slotDatesISO);
  }, [startDate, endDate, selectedDays, repeatEveryWeeks, setSlotDates]);

  const handleDayToggle = (dayIndex: number) => {
    let updated: number[];
    if (isMultiDayMode) {
      updated = selectedDays.includes(dayIndex)
        ? selectedDays.filter((d) => d !== dayIndex)
        : [...selectedDays, dayIndex];
    } else {
      updated = [dayIndex];
    }
    setSelectedDays(updated);
    // Set the first selected day as current for slot management in single mode
    if (!isMultiDayMode && updated.length > 0) {
      setCurrentDayForSlots(updated[0]);
    }
  };

  console.log(selectedDays, slotTime, "selectedDays");

  const shouldDisableDate = (date: any) => {
    if (!startDate) return false;
    return dayjs(date).isBefore(dayjs(startDate));
  };

  // Check overlap inside one day
  const doesOverlap = (
    dayIndex: number,
    start: string,
    end: string
  ): boolean => {
    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const newStart = toMinutes(start);
    const newEnd = toMinutes(end);
    return (slotTime[dayIndex] || []).some(
      ({ start: existingStart, end: existingEnd }) => {
        const existStart = toMinutes(existingStart);
        const existEnd = toMinutes(existingEnd);
        return newStart < existEnd && newEnd > existStart;
      }
    );
  };

  const addTimeSlot = () => {
    if (!selectedTime) return;
    // Determine which days to add the slot to
    const targetDays = isMultiDayMode
      ? selectedDays
      : currentDayForSlots !== null
        ? [currentDayForSlots]
        : selectedDays.slice(0, 1);
    if (targetDays.length === 0) {
      showError("Please select at least one day");
      return;
    }
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes + slotDuration, 0, 0);
    const endTime = date.toTimeString().slice(0, 5);
    let hasOverlap = false;
    // Check for overlaps first
    targetDays.forEach((dayIndex) => {
      if (doesOverlap(dayIndex, selectedTime, endTime)) {
        showError(
          `This time overlaps with an existing slot on ${WEEKDAYS[dayIndex]}`
        );
        hasOverlap = true;
      }
    });
    if (hasOverlap) return;
    // Add slots to all target days
    const updatedSlotTime = { ...slotTime };
    targetDays.forEach((dayIndex) => {
      if (!updatedSlotTime[dayIndex]) {
        updatedSlotTime[dayIndex] = [];
      }
      updatedSlotTime[dayIndex].push({ start: selectedTime, end: endTime });
    });
    setSlotTime(updatedSlotTime);
    setSelectedTime("");
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setSlotTime((prev) => {
      const updated = { ...prev };
      if (updated[dayIndex]) {
        updated[dayIndex] = updated[dayIndex].filter((_, i) => i !== slotIndex);
        if (updated[dayIndex].length === 0) {
          delete updated[dayIndex];
        }
      }
      return updated;
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{
        width: "100%",
        padding: "20px",
        backgroundColor: "#ffffff",
        border: "2px solid #4caf50",
        borderRadius: "10px",
        margin: "10px 0"
      }}>
        <h3 style={{
          color: "#4caf50",
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          Class Scheduling & Recurrence
        </h3>
        {/* Slot Duration Dropdown */}
        <div style={{ marginBottom: "20px", width: "100%" }}>
          <label style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#333"
          }}>
            Slot Duration
          </label>
          <select
            value={slotDuration}
            onChange={(e) => setSlotDuration(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#fff"
            }}
          >
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
          </select>
        </div>
        {/* Multi-day toggle */}
        <div style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <input
            type="checkbox"
            checked={isMultiDayMode}
            onChange={(e) => {
              const newMode = e.target.checked;
              setIsMultiDayMode(newMode);
              if (!newMode && selectedDays.length > 1) {
                // When switching from multi to single, keep only the first day
                const firstDay = selectedDays[0];
                setSelectedDays([firstDay]);
                setCurrentDayForSlots(firstDay);
              }
            }}
            style={{
              width: "18px",
              height: "18px",
              marginRight: "8px",
              appearance: "checkbox",   // 👈 add this
              WebkitAppearance: "checkbox", // Safari fix
            }}
          />
          <label style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333"
          }}>
            Multi-day selection mode
          </label>
        </div>
        {/* Weekday buttons */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#333"
          }}>
            Days of the Week
          </label>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px"
          }}>
            {WEEKDAYS.map((day, index) => (
              <button type="button"
                key={day}
                onClick={() => handleDayToggle(index)}
                disabled={
                  !isMultiDayMode &&
                  currentDayForSlots !== index &&
                  selectedDays.includes(index)
                }
                style={{
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  border: "2px solid #4caf50",
                  borderRadius: "4px",
                  backgroundColor: selectedDays.includes(index) ? "#4caf50" : "#fff",
                  color: selectedDays.includes(index) ? "#fff" : "#4caf50",
                  cursor: "pointer",
                  minWidth: "40px",
                  height: "35px"
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        {/* Add slot */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#333"
          }}>
            Slot Time
          </label>
          <div style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap"
          }}>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "10px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
            <button type="button"
              onClick={addTimeSlot}
              style={{
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "bold",
                borderRadius: "4px",
                cursor: "pointer",
                minWidth: "80px"
              }}
            >
              Add
            </button>
          </div>
        </div>
        {/* Show slots for each day */}
        {Object.entries(slotTime)
          .filter(([dayIndex]) => selectedDays.includes(Number(dayIndex)))
          .map(([dayIndex, slots]) => (
            <div key={dayIndex} style={{ marginTop: "20px", width: "100%" }}>
              <h4 style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "10px",
                color: "#333"
              }}>
                {WEEKDAYS[Number(dayIndex)]} Slots
              </h4>
              {slots.map((slot, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "8px",
                    padding: "12px",
                    background: "#f5f5f5",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {slot.start} - {slot.end}
                  </span>
                  <button type="button"
                    onClick={() => removeTimeSlot(Number(dayIndex), index)}
                    style={{
                      backgroundColor: "#f44336",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ))}
        {formSubmitted &&
          selectedDays.every((day) => (slotTime[day] || []).length === 0) && (
            <div style={{
              color: "#f44336",
              marginTop: "10px",
              fontSize: "14px",
              fontWeight: "bold"
            }}>
              Please add at least one time slot
            </div>
          )}

        {/* Repeat every */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#333"
          }}>
            Recurrence Interval
          </label>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap"
          }}>
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>Repeat every</span>
            <input
              type="number"
              value={repeatEveryWeeks}
              onChange={(e) => {
                const value = Math.max(1, Number(e.target.value));
                setRepeatEveryWeeks(value);
              }}
              min={1}
              style={{
                width: "80px",
                padding: "8px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>week(s)</span>
          </div>
        </div>
        {/* Duration */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#333"
          }}>
            Duration
          </label>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            flexWrap: "wrap",
            gap: "10px"
          }}>
            <input
              type="radio"
              checked={durationType === "weeks"}
              onChange={() => handleDurationTypeChange("weeks")}
              style={{ marginRight: "8px" , appearance: "checkbox",   // 👈 add this
                WebkitAppearance: "checkbox"}}
            />
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>Continue for</span>
            <input
              type="number"
              value={continueForWeeks}
              onChange={(e) => {
                const value = Math.max(1, Number(e.target.value));
                setContinueForWeeks(value);
              }}
              min={1}
              disabled={durationType !== "weeks"}
              style={{
                width: "80px",
                padding: "8px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px",
               
              }}
            />
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>weeks</span>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px"
          }}>
            <input
              type="radio"
              checked={durationType === "date"}
              onChange={() => handleDurationTypeChange("date")}
              style={{ marginRight: "8px" , appearance: "checkbox",   // 👈 add this
                WebkitAppearance: "checkbox"}}
            />
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>End on</span>
            <input
              type="date"
              value={endDateLocal ? dayjs(endDateLocal).format('YYYY-MM-DD') : ''}
              onChange={(e) => {
                if (e.target.value) {
                  setEndDateLocal(new Date(e.target.value));
                }
              }}
              disabled={durationType !== "date"}
              min={startDate ? dayjs(startDate).add(1, "day").format('YYYY-MM-DD') : undefined}
              style={{
                padding: "8px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
          </div>
        </div>
        {error && (
          <div style={{
            color: "#f44336",
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "4px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
}
