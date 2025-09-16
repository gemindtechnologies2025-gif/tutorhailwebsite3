/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Drawer,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import AddressDrawer from "../common/addressDrawer";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SelectDateModal from "../../../Modals/selectDate";
import SelectTimeModal from "../../../Modals/selectTime";

export default function ParentEditBooking() {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const [open2, setOpen2] = React.useState(false);
  const handleCloseModal2 = () => {
    setOpen2(false);
  };

  const [open3, setOpen3] = React.useState(false);
  const handleCloseModal3 = () => {
    setOpen3(false);
  };

  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">
          <section className="uhb_spc pPairing_sc">
            <div className="conta_iner v2">
              <div className="role_head">
                <button
                  className="back_arrow"
                  onClick={() => navigate("/parent/booking-detail/pending")}
                >
                  <img src={`/static/images/back.png`} alt="Back" />
                </button>
                <h1 className="hd_3">Edit Booking</h1>
              </div>
              <div className="role_body">
                <div className="tutorDetail_box">
                  <figure className="lt_s">
                    <img src={`/static/images/userNew.png`} alt="Image" />
                    <span>
                      <StarIcon />
                      4.5 (1800)
                    </span>
                  </figure>
                  <div className="rt_s">
                    <span className="highlight">
                      <img
                        src={`/static/images/star_badge_icon.svg`}
                        alt="Image"
                      />{" "}
                      10+ years Experience
                    </span>
                    <h2>Catherine Bell</h2>
                    <p>
                      <figure>
                        <img
                          src={`/static/images/address_icon.svg`}
                          alt="Icon"
                        />
                      </figure>{" "}
                      New York, United States
                    </p>
                    <span className="tag">Available</span>
                    <hr />
                    <div className="flex">
                      <p>
                        <span>Price</span>
                        <strong>$20/Hour</strong>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card_box v2">
                  <div className="cardBox_head">
                    <h2>Select Booking Date & Time</h2>
                  </div>
                  <div className="cardBox_body">
                    <form className="form schedule_form">
                      <div className="gap_p">
                        <div className="control_group w_50">
                          <TextField
                            fullWidth
                            hiddenLabel
                            placeholder="Select Date"
                            defaultValue="Select Date"
                            InputProps={{
                              readOnly: true,
                              startAdornment: (
                                <InputAdornment position="end">
                                  <CalendarTodayOutlinedIcon />
                                </InputAdornment>
                              ),
                            }}
                            onClick={() => setOpen2(true)}
                          ></TextField>
                        </div>
                        <div className="control_group w_50">
                          <TextField
                            fullWidth
                            hiddenLabel
                            placeholder="Select Time"
                            defaultValue="Select Time"
                            InputProps={{
                              readOnly: true,
                              startAdornment: (
                                <InputAdornment position="end">
                                  <AccessTimeIcon />
                                </InputAdornment>
                              ),
                            }}
                            onClick={() => setOpen3(true)}
                          ></TextField>
                        </div>
                        <div className="control_group w_100">
                          <label>Select Subject</label>
                          <RadioGroup
                            className="checkbox_label"
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                          >
                            <FormControlLabel
                              value="Mathematics"
                              control={<Radio />}
                              label="Mathematics"
                            />
                            <FormControlLabel
                              value="Descrete"
                              control={<Radio />}
                              label="Descrete"
                            />
                            <FormControlLabel
                              value="Statictics"
                              control={<Radio />}
                              label="Statictics"
                            />
                          </RadioGroup>
                        </div>
                        <div className="control_group w_100">
                          <label>Address</label>
                          <RadioGroup
                            className="checkbox_label v2"
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                          >
                            <FormControlLabel
                              value="Home Address"
                              control={<Radio />}
                              label={
                                <>
                                  <strong>Home Address</strong>
                                  <span>
                                    3711 Spring Downtown New York, United States{" "}
                                    <br />
                                    (555) 123-4567
                                  </span>
                                </>
                              }
                            />
                            <FormControlLabel
                              value="Home Address 2"
                              control={<Radio />}
                              label={
                                <>
                                  <strong>Home Address 2</strong>
                                  <span>
                                    3711 Spring Downtown New York, United States{" "}
                                    <br />
                                    (555) 123-4567
                                  </span>
                                </>
                              }
                            />
                            <FormControlLabel
                              className="not_radio"
                              control={<></>}
                              label={
                                <>
                                  <AddIcon /> Add New Address
                                </>
                              }
                              onClick={toggleDrawer(true)}
                            />
                          </RadioGroup>
                        </div>
                      </div>
                      <div className="form_bottom">
                        <p>
                          <span>Total Charges</span>
                          <strong>$00.00</strong>
                        </p>
                        <div className="form_btn">
                          <Button variant="outlined" color="primary">
                            Reset
                          </Button>
                          <Button
                            onClick={() =>
                              navigate("/parent/booking-detail/pending")
                            }
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </ParentLayout>

      <Drawer
        className="address_aside"
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
      >
        {/* <AddressDrawer toggleDrawer={toggleDrawer} /> */}
      </Drawer>

      {/* <SelectDateModal
        open={open2}
        onClose={handleCloseModal2}
        setOpen={setOpen2}
      /> */}

      {/* <SelectTimeModal
        open={open3}
        onClose={handleCloseModal3}
        setOpen={setOpen3}
      /> */}
    </>
  );
}
