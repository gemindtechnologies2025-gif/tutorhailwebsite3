import React, { useEffect, useLayoutEffect, useState } from "react";
import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";
import generateJwt from "../../utils/jwt";
import "./Zoom.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ParentLayout } from "../../layout/parentLayout";
import { TutorLayout } from "../../layout/tutorLayout";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { getRole, role } from "../../reducers/authSlice";
import DummyHeader from "../../layout/tutorLayout/header/dummyHeader";
import ParentHeader from "../../layout/parentLayout/header";

const ZoomCall = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const { state } = location;
  const roleName = useAppSelector(getRole);
  const dispatch = useAppDispatch();
  console.log(state?.data?.from, 'state?.data?.from');

  const setRole = () => {
    dispatch(role({ roleName: roleName || "parent" }));
  }

  const [sessionContainer, setSessionContainer] = useState<HTMLElement | null>(
    null
  );
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const joinZoomSession = async () => {
      if (!isMounted || isSessionActive) {
        console.warn("Session is already active.");
        return;
      }

      const sessionName = state?.data?.sessionName || "";
      const displayName = state?.data?.displayName || "User";
      const roleType = state?.data?.roleType || "1";
      const sessionIdleTimeoutMins =
        state?.data?.sessionIdleTimeoutMins || "10";

      try {
        // Generate JWT
        const token = await generateJwt(sessionName, roleType);

        if (!token) {
          navigate(state?.data?.from == 'class' ? `/${type}/my-bookings` : `/${type}/booking-detail/accepted/${id}`, { replace: true });
          return;
        }

        // Fetch or set session container
        const container = document.getElementById("sessionContainer");
        if (!container) {
          navigate(state?.data?.from == 'class' ? `/${type}/my-bookings` : `/${type}/booking-detail/accepted/${id}`, { replace: true });
          return;
        }

        setSessionContainer(container);

        // Join session using the Zoom SDK
        await uitoolkit.joinSession(container, {
          videoSDKJWT: token,
          sessionName,
          userName: displayName,
          features: [
            "video",
            "audio",
            "settings",
            "users",
            "chat",
            "share",
            "reactions",
          ],
          options: {
            init: {},
            audio: {
              connect: true,
              mute: true,
              autoAdjustSpeakerVolume: false,
            },
            video: {
              localVideoOn: true,
              cursor: "always",
              displaySurface: "monitor",
              autoStartVideo: true,

            },
            layout: {
              mode: "grid",
              resize: true,
            },
            pagination: {
              pageSize: 25,
            },
            share: {
              mirror: false,
            },
            reactions: {
              enable: true,
            },
          },
          sessionIdleTimeoutMins: parseInt(sessionIdleTimeoutMins, 10),
        });

        setIsSessionActive(true);

        uitoolkit.onSessionClosed(() => {
          sessionClosed();
          navigate(state?.data?.from == 'class' ? `/${type}/my-bookings` : `/${type}/booking-detail/accepted/${id}`, { replace: true });
        });
      } catch (e) {
        console.error("Error joining session:", e);
        navigate(state?.data?.from == 'class' ? `/${type}/my-bookings` : `/${type}/booking-detail/accepted/${id}`, { replace: true });
      }
    };

    joinZoomSession();

    return () => {
      isMounted = false;
      if (sessionContainer) {
        uitoolkit.closeSession(sessionContainer);
        setSessionContainer(null); //new chnage
        setIsSessionActive(false);
        navigate(state?.data?.from == 'class' ? `/${type}/my-bookings` : `/${type}/booking-detail/accepted/${id}`, { replace: true });
      }
    };
  }, [state, isSessionActive]);

  const sessionClosed = () => {
    console.log("Session closed");
    setIsSessionActive(false);
    navigate(state?.data?.from == 'class' ? `/${type}/my-bookings` : `/${type}/booking-detail/accepted/${id}`, { replace: true });

    if (sessionContainer) {
      uitoolkit.closeSession(sessionContainer);
      navigate(state?.data?.from == 'class' ? `/${type}/my-bookings` : `/${type}/booking-detail/accepted/${id}`, { replace: true });

    }
  };

 

  useLayoutEffect(() => {
    setRole()
  }, [])

  return (
    <>
      {roleName === "parent" ? (
        < >
          <ParentHeader zoom={true} />
          <div id="join-flow">
            <div id="sessionContainer"></div>
          </div>
        </>
      ) : (
        <>
          <DummyHeader />
          <div id="join-flow">
            <div id="sessionContainer"></div>
          </div>
        </>

      )}

    </>
  );
};

export default ZoomCall;
