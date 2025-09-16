import React, { useEffect, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import { useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useLazyGetUserQuery } from "../../../service/auth";
import { showError } from "../../../constants/toast";
import { getToken, setCredentials } from "../../../reducers/authSlice";
import { getFromStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import ChangePasswordModal from "../../../Modals/changePassword";
import ParentEditProfileModal from "../../../Modals/parentEditProfile";

export default function ParentProfile() {
  const navigate = useNavigate();
  const [getProfile] = useLazyGetUserQuery();
  const [profileData, setProfileData] = useState<any>();
  const dispatch = useAppDispatch();
  const tokenFromRed = useAppSelector(getToken);

  const token = getFromStorage(STORAGE_KEYS.token);
  const fetchUser = async () => {
    try {
      const res = await getProfile({}).unwrap();
      if (res?.statusCode === 200 && token) {
        setProfileData(res?.data);
        dispatch(
          setCredentials({
            user: res?.data,
            token: token,
          })
        );
      }
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };

//  console.log(profileData, "my profile");

  useEffect(() => {
    if (tokenFromRed) {
      fetchUser();
    }
  }, [tokenFromRed]);

  const [open1, setOpen1] = useState(false);
  const handleCloseModal1 = () => {
    setOpen1(false);
  };

  const [open2, setOpen2] = useState(false);
  const handleCloseModal2 = () => {
    setOpen2(false);
  };
//  console.log(profileData, "inParebt");
  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">
          <section className="uhb_spc pProfile_sc">
            <div className="conta_iner v2">
              <div className="role_head">
                <button
                  className="back_arrow"
                  onClick={() => navigate("/parent/search-result")}
                >
                  <img src={`/static/images/back.png`} alt="Back" />
                </button>
                <h1 className="hd_3">Profile</h1>
              </div>
              <div className="role_body">
                <div className="profile_box">
                  <figure>
                    <img
                      src={
                        profileData?.image
                          ? profileData?.image
                          : `/static/images/user.png`
                      }
                      alt="logo"
                    />
                  </figure>
                  <p>
                    <strong>
                      {profileData?.name ? profileData?.name : "-"}
                    </strong>
                    <span>{profileData?.email ? profileData?.email : "-"}</span>
                  </p>
                  <IconButton
                    className="roundIcon_btn"
                    onClick={() =>
                      navigate("/auth/as-parent/profile-setup", {
                        state: "edit",
                      })
                    }
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                </div>
                <ul className="profile_detail">
                  <li>
                    <span>Full Name</span>
                    <strong>
                      {profileData?.name ? profileData?.name : "-"}
                    </strong>
                  </li>
                  <li>
                    <span>Phone</span>
                    <strong>
                      {profileData?.dialCode && profileData?.phoneNo
                        ? profileData?.dialCode + profileData?.phoneNo
                        : "-"}
                    </strong>
                  </li>
                  <li>
                    <span>Address</span>
                    <strong>
                      {profileData?.address ? profileData?.address : "-"}{" "}
                    </strong>
                  </li>
                </ul>
                {!profileData?.isSocialLogin && (
                  <div className="pass_box">
                    <p>Change Password</p>
                    <Box component="a" onClick={() => setOpen1(true)}>
                      Change
                    </Box>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </ParentLayout>

      <ChangePasswordModal
        open={open1}
        onClose={handleCloseModal1}
        setOpen={setOpen1}
      />

      <ParentEditProfileModal
        open={open2}
        onClose={handleCloseModal2}
        setOpen={setOpen2}
      />
    </>
  );
}
