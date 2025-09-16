import { Modal } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { showError } from "../constants/toast";
import { UploadMedia, Uploadpdf } from "../utils/mediaUpload";
import { CHAT_MEDIA } from "../constants/enums";

type Conversion = { name: string };

interface GradesProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    img: string;
    setImg: Dispatch<SetStateAction<string>>;
    sendImage: any;
     setLoading:any;

}

export default function ChooseFileModal({
    open,
    onClose,
    setOpen,
    img,
    setImg,
    sendImage,
setLoading
}: GradesProps) {

    
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true)
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files).slice(0, 10); // Max 4
        try {
            const uploaded = await Promise.all(
                fileArray.map((file) => UploadMedia(file))
            );
            const uploadedUrls = uploaded.map((res) => res.data?.image);
            sendImage(
                [...uploadedUrls,
                ], CHAT_MEDIA.IMAGE);
                 setLoading(false)

        } catch (error) {
            console.error("Image upload failed:", error);
             setLoading(false)
        }
    };




    const handleDocUpload = async (event: any) => {
        setOpen(false);
        const file = event.target?.files?.[0];

        if (!file || file.type !== "application/pdf") {
            showError("Accept only pdf");
            return;
        }

        const res = await Uploadpdf(file); // Adjust this if the function name differs
        if (res?.statusCode === 200) {
            setImg(res?.data?.image);
            sendImage(res?.data?.image, CHAT_MEDIA.DOC);
        } else {
            showError(res?.message);
        }
    };

    return (
        <Modal
            className="modal setup_modal"
            id="gradesModal"
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={open}
            onClose={onClose}
        >
            <div className="modal-dialog">
                <div className="modal-body">
                    <div className="modal_title hd_3_1">
                        <h2>Choose File</h2>
                        <div className="btn-close">
                            <CloseIcon onClick={() => setOpen(false)} />
                        </div>
                    </div>
                    <ul className="vehicle_list">
                        <li>
                            <label
                                htmlFor="upload-input"
                                className="btnn btn_icon"
                                style={{ cursor: "pointer" }}
                            >
                                <figure >
                                    <img src={"/static/images/picture.png"} alt="car" />
                                </figure>
                                <input
                                    id="upload-input"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    
                                    onChange={handleImageUpload}
                                    multiple
                                />
                            </label>

                            <h3>Image</h3>
                        </li>
                        <li

                        >
                            <label
                                htmlFor="upload-input-1"
                                className="btnn btn_icon"
                                style={{ cursor: "pointer" }}
                            >
                                <figure >
                                    <img src={"/static/images/pdf.png"} alt="car" />
                                </figure>
                                <input
                                    id="upload-input-1"
                                    type="file"
                                    accept="application/pdf"
                                    style={{ display: "none" }}
                                    onChange={handleDocUpload}
                                />
                            </label>
                            <h3>Pdf</h3>
                        </li>

                    </ul>
                </div>
            </div>
        </Modal>
    );
}