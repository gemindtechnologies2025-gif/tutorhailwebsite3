import { Button, Modal, TextField, IconButton } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { 
  useAddSocialLinkMutation, 
  useDeleteSocialLinkMutation, 
  useGetSocialLinksQuery 
} from "../service/socialLinks";
import { showError, showToast } from "../constants/toast";

interface SelectDateProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const SOCIAL_LINK_TYPE = {
  FACEBOOK: 1,
  LINKEDIN: 2,
  YOUTUBE: 3,
  INSTAGRAM: 4,
};

const SOCIAL_CONFIG = [
  { type: SOCIAL_LINK_TYPE.FACEBOOK, name: "Facebook", icon: "/static/images/fb_hd.svg" },
  { type: SOCIAL_LINK_TYPE.LINKEDIN, name: "LinkedIn", icon: "/static/images/lin_hd.svg" },
  { type: SOCIAL_LINK_TYPE.YOUTUBE, name: "YouTube", icon: "/static/images/youtube_hd.svg" },
  { type: SOCIAL_LINK_TYPE.INSTAGRAM, name: "Instagram", icon: "/static/images/instahd.svg" },
];

export default function AboutProfile({ open, onClose, setOpen }: SelectDateProps) {
  const { data, isLoading, refetch } = useGetSocialLinksQuery({});
  const [deleteApi] = useDeleteSocialLinkMutation();
  const [addLinkApi] = useAddSocialLinkMutation();

  const [links, setLinks] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempLink, setTempLink] = useState("");

  // Map API data with config
  useEffect(() => {
    if (data?.data?.data) {
      const apiLinks = data.data.data; // [{type:1, link:"http://..."}, ...]
      const merged = SOCIAL_CONFIG.map(cfg => {
        const match = apiLinks.find((l: any) => l.type === cfg.type);
        return { ...cfg, url: match?.link || "", id: match?._id };
      });
      setLinks(merged);
    }
  }, [data]);

  const deleteLink = async (id: string) => {
    try {
      const res = await deleteApi({ id }).unwrap();
      if (res?.statusCode === 200) {
        showToast("Link deleted Successfully");
        refetch();
      }
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };

  const addLink = async (type: number, link: string) => {
    try {
      const res = await addLinkApi({ type, link }).unwrap();
      if (res?.statusCode === 200) {
        showToast("Link saved successfully");
        refetch();
      }
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };

  const handleSave = async (index: number) => {
    if (!tempLink.trim()) return;
    const linkObj = links[index];
    await addLink(linkObj.type, tempLink.trim()); // API call
    setEditingIndex(null);
    setTempLink("");
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setTempLink("");
  };

  return (
    <Modal
      className="modal selectDate_modal"
      id="AboutProfile"
      open={open}
      onClose={onClose}
    >
      <div className="modal-dialog">
        <div className="modal-body">
          <div className="btn-close">
            <CloseIcon onClick={() => setOpen(false)} />
          </div>
          <div className="abt_profile_sc social_mdl">
            <div className="title_md">
              <h2>Social Links</h2>
            </div>

            <ul>
              {links.map((link, index) => (
                <li key={link.type}>
                  <figure>
                    <img src={link.icon} alt={link.name} />
                  </figure>
                  <p>
                    {link.name}{" "}
                    {editingIndex === index ? (
                      <>
                        <TextField
                          size="small"
                          required
                          value={tempLink}
                          placeholder={`Enter ${link.name} link`}
                          onChange={(e) => setTempLink(e.target.value)}
                          style={{ marginRight: "8px" }}
                          error={!tempLink.trim()}
                          helperText={!tempLink.trim() ? "Link is required" : ""}
                        />
                        <div className="btn_grp">
                          <button
                            className="btn primary"
                            onClick={() => handleSave(index)}
                            disabled={!tempLink.trim()}
                          >
                            Save
                          </button>
                          <button
                            className="btn danger"
                            onClick={handleCancel}
                            style={{ marginLeft: "4px" }}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : link.url ? (
                      <>
                        <a href={link.url} target="_blank" rel="noreferrer">
                          {link.url}
                        </a>
                        <div className="edit_del">
                          <IconButton size="small" onClick={() => deleteLink(link?.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <button
                            className="edit_btn"
                            onClick={() => {
                              setEditingIndex(index);
                              setTempLink(link.url);
                            }}
                            style={{ marginLeft: "4px" }}
                          >
                            <BorderColorIcon />
                          </button>
                        </div>
                      </>
                    ) : (
                      <a
                        style={{ cursor: "pointer", color: "#0692AA" }}
                        onClick={() => {
                          setEditingIndex(index);
                          setTempLink("");
                        }}
                      >
                        Add Link
                      </a>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}

