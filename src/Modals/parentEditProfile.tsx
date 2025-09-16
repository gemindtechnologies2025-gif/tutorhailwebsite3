import React from "react";
import { CardMedia, Input, InputAdornment, MenuItem, Modal, TextField } from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import PhoneInput from "react-phone-input-2";
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import MaleIcon from '@mui/icons-material/Male';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useLazyGetUserQuery } from "../service/auth";

interface ParentEditProfileProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ParentEditProfileModal({
    open,
    onClose,
    setOpen,
}: ParentEditProfileProps) {

    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState(0);
    const [image, setImage] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [getProfile] = useLazyGetUserQuery();
    const [profileData, setProfileData] = useState<any>();
   


    return (
        <Modal
            className="modal parentEditProfile_modal"
            id="parentEditProfileModal"
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
                    <h2>Edit Profile</h2>
                    <form className="form">
                        <div className="control_group text_center">
                            {image ? (
                                <div className="upload_image">
                                    <div className="upload_image_holder">
                                        <figure>
                                            <CardMedia
                                                component="img"
                                                image={image}
                                                alt="photo"
                                            />
                                        </figure>
                                        <CloseIcon
                                            onClick={() => {
                                                setImage("");
                                                setFileName("");
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <label className="upload_image" htmlFor="icon-button-file">
                                    <Input
                                        sx={{ display: "none" }}
                                        id="icon-button-file"
                                        type="file"
                                        inputProps={{
                                            accept: "image/png,image/jpeg",
                                        }}
                                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                            const files = (event.target as HTMLInputElement)
                                                .files;
                                            if (files && files[0].type.includes("image")) {
                                                setFileName(files[0].name);
                                                setImage(URL.createObjectURL(files[0]));
                                            } else {
                                                setAlertType(0);
                                                setShowAlert(true);
                                                setAlertMessage(
                                                    "This field only accepts images."
                                                );
                                            }
                                        }}
                                    />
                                    <span className="upload_image_holder">
                                        <figure>
                                            <img src={`/static/images/add_icon.svg`} alt="" />
                                        </figure>
                                    </span>
                                </label>
                            )}
                        </div>
                        <div className="control_group">
                            <TextField
                                hiddenLabel
                                fullWidth
                                placeholder="Enter your Full Name"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PermIdentityIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            ></TextField>
                        </div>
                        <div className="control_group">
                            <TextField
                                hiddenLabel
                                fullWidth
                                placeholder="Enter your Email ID"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailOutlineIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            ></TextField>
                        </div>
                        <div className="control_group">
                            <PhoneInput
                                country={"us"}
                                placeholder="Enter Your Phone Number"
                                enableSearch={true}
                                // onlyCountries={["in", "sa"]}
                            />
                        </div>
                        <div className="control_group">
                            <TextField
                                select
                                placeholder="Gender"
                                label="Gender"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MaleIcon />
                                        </InputAdornment>
                                    ),
                                }}>
                                <MenuItem value="10">Male</MenuItem>
                                <MenuItem value="20">Female</MenuItem>
                            </TextField>
                        </div>
                        <div className="control_group">
                            <TextField
                                hiddenLabel
                                fullWidth
                                placeholder="Enter your Address"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PlaceOutlinedIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            ></TextField>
                        </div>
                        <div className="form_btn">
                            <Button variant="outlined" color="primary" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button color="primary">Change Password</Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}