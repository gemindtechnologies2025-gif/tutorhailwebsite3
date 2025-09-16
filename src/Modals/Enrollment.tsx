import { Button, Checkbox, Modal } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import "react-day-picker/style.css";
import moment from "moment";
import { useAppSelector } from "../hooks/store";
import { getRole } from "../reducers/authSlice";
import {
  useBookClassMutation,
  useUpdateClassSlotsByIdMutation,
} from "../service/class";
import { showError, showToast } from "../constants/toast";
import BookForModal from "./BookClassForModal";

interface SelectDateProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  slots: any[];
  duration: any;
  fee: any;
  days: any;
  classMode:any;
}

export default function Enrollment({
  open,
  onClose,
  setOpen,
  slots,
  duration,
  fee,
  days,
  classMode
}: SelectDateProps) {
  const role = useAppSelector(getRole);
  const [updateSlot] = useUpdateClassSlotsByIdMutation();
  const [selected, setSelected] = useState<string[]>([]);
  const [openBookFor, setOpenBookFor] = useState<boolean>(false);
  const onCloseBook = () => setOpenBookFor(false);
  const [lastEndTime, setLastEndTime] = useState<string | null>(null);

  const disableSlot = async () => {
    const body = {
      slotIds: selected,
      status: false,
    };
    try {
      const res = await updateSlot({ body: body }).unwrap();
      if (res?.statusCode === 200) {
        showToast("Slot Disabled successfully");
        setSelected([]);
      }
    } catch (error: any) {
      showError(error?.data?.message || "");
    }
  };

  const enableSlot = async () => {
    const body = {
      slotIds: selected,
      status: true,
    };
    try {
      const res = await updateSlot({ body: body }).unwrap();
      if (res?.statusCode === 200) {
        showToast("Slot Enabled successfully");
        setSelected([]);
      }
    } catch (error: any) {
      showError(error?.data?.message || "");
    }
  };

  // useEffect(() => {
  //   if (selected?.length === 0) {
  //     setLastEndTime(null);
  //     return;
  //   }

  //   const selectedSlots = slots
  //     ?.filter((s) => selected?.includes(s?._id))
  //     ?.sort(
  //       (a, b) =>
  //         new Date(a?.startTime)?.getTime() - new Date(b?.startTime)?.getTime()
  //     );

  //   const lastSlot = selectedSlots[selectedSlots?.length - 1];

  //   if (lastSlot?.endTime) {
  //     setLastEndTime(lastSlot?.endTime);
  //   }
  // }, [selected, slots]);

  return (
    <Modal
      className="modal selectDate_modal"
      id="AboutProfile"
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

          <div className="abt_profile_sc social_mdl enroll_mdl">
            <div className="title_md">
              <h2>
                {" "}
                <span>
                  <CalendarMonthIcon />
                </span>{" "}
                Available Sessions
              </h2>
            </div>

            <div className="modal_body">
              <div className="control_group">
                <div className="lt">
                  {/* <Checkbox name="allowComment" /> */}
                  {/* <p>Select All </p> */}
                </div>
                <div className="rt">
                  <span className="status ">{slots?.length || 0} Session</span>
                  <span className="status badge">{days} day</span>
                </div>
              </div>

              <ul>
                {slots?.map((session, index) => (
                  <li
                    onClick={() => {
                      setSelected((prev) => {
                        const isAlreadySelected = prev.includes(session._id);

                        if (isAlreadySelected) {
                          return prev.filter((id) => id !== session._id);
                        }

                        const selectedSessions = slots.filter((s) =>
                          prev.includes(s._id)
                        );
                        const hasStatusTrue = selectedSessions.some(
                          (s) => s.status === true
                        );
                        const hasStatusFalse = selectedSessions.some(
                          (s) => s.status === false
                        );

                        if (
                          (session.status === true && hasStatusFalse) ||
                          (session.status === false && hasStatusTrue)
                        ) {
                          return [session._id];
                        }

                        return [...prev, session._id];
                      });
                    }}
                    className={`${selected?.includes(session?._id) ? "active" : ""}`}
                    key={index}
                  >
                    <div className="session_card">
                      <div className="lt">
                        <h6>
                          <AccessTimeIcon />
                          {session?.startTime
                            ? moment(session?.startTime).format("dddd")
                            : ""}

                          {session?._id ===
                          slots
                            ?.filter((s) => s?.status === true)
                            ?.sort(
                              (a, b) =>
                                new Date(a?.startTime).getTime() -
                                new Date(b?.startTime).getTime()
                            )?.[0]?._id ? (
                            <span className="btn primary"> Next</span>
                          ) : (
                            ""
                          )}
                        </h6>
                        <p>
                          <span>
                            <EventIcon />
                          </span>{" "}
                          {session?.startTime
                            ? moment(session?.startTime).format("LL")
                            : ""}
                        </p>

                        <p>
                          {moment(session?.startTime).format("HH:MM A") +
                            "-" +
                            moment(session?.endTime).format("HH:MM A")}
                          {duration ? ` (${duration} Min)` : ""}
                        </p>
                        <p>
                          Remaining Seats:{" "}
                          <pre>{session?.remainingSeats || "0"}</pre>
                        </p>
                      </div>
                      <div className="rt">
                        {role === "parent" ? (
                          <button className="btn voilet">
                            {selected?.includes(session?._id)
                              ? "Selected"
                              : "Select"}
                          </button>
                        ) : (
                          <button className="btn voilet">
                            {session?.status ? "Available" : "Unavailable"}
                          </button>
                        )}

                        <p>{fee}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {role === "parent" && selected.length > 0 ? (
                <div className="btm_btn">
                  <button
                    onClick={() => setOpenBookFor(true)}
                    className="btn primary"
                  >
                    Book Slot
                  </button>
                </div>
              ) : role === "tutor" && selected.length > 0 ? (
                <div className="btm_btn">
                  {slots.find((s) => selected.includes(s._id))?.status ===
                  true ? (
                    <button onClick={disableSlot} className="btn primary">
                      Disable Slot
                    </button>
                  ) : (
                    <button onClick={enableSlot} className="btn primary">
                      Enable Slot
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <BookForModal
          open={openBookFor}
          setOpen={setOpenBookFor}
          onClose={onCloseBook}
          slots={selected}
          classMode={classMode}
          // endDate={lastEndTime}
        />
      </div>
    </Modal>
  );
}
