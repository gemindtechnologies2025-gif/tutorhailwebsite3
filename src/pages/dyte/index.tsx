
import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DyteMeeting } from "@dytesdk/react-ui-kit";
import { useDyteClient } from "@dytesdk/react-web-core";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { getRole, role } from "../../reducers/authSlice";
import DummyHeader from "../../layout/tutorLayout/header/dummyHeader";
import "./Dyte.css";

const DyteCall: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const type = new URLSearchParams(location.search).get("type");
  const roleName = useAppSelector(getRole);
  const dispatch = useAppDispatch();

  const setRole = () => {
    dispatch(role({ roleName: roleName || "parent" }));
  };

  const [client, initClient] = useDyteClient();
  const [initializing, setInitializing] = useState(true);
  const [initError, setInitError] = useState("");

  useLayoutEffect(() => {
    setRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let mounted = true;
    const navigateBack = () =>
      navigate(
        state?.data?.from === "class"
          ? `/${type}/my-bookings`
          : `/${type}/booking-detail/accepted/${id}`,
        { replace: true }
      );

    const createAndInit = async () => {
      setInitializing(true);
      setInitError("");
      
      const item =
        state?.data?.item ??
        state?.item ??
        state?.data?.classData ??
        (state?.data && typeof state.data === "object" ? state.data : undefined);
      const meetingId = state?.data?.dyteId;
       

      if (!meetingId) {
        setInitError("Missing meeting ID.");
        setInitializing(false);
        setTimeout(navigateBack, 1200);
        return;
      }

      const displayName = state?.data?.displayName || "User";
      const preset_name = state?.data?.secondaryRole === 1 ? "tutor" : "learner";

      try {
        const resp = await axios.post(
          `https://api.realtime.cloudflare.com/v2/meetings/${meetingId}/participants`,
          {
            name: displayName,
            picture: state?.data?.picture || "https://i.imgur.com/test.jpg",
            preset_name,
            client_specific_id: `client-${Date.now()}`,
          },
          {
            headers: {
              Authorization:
                "Basic MTVhMzAyZTgtYTEzMy00NDk1LTlkOWYtZThjODRlYzAwNTUwOjVmNDJmZTY1ZTI1NDA0NDg0MGQ2",
              "Content-Type": "application/json",
            },
          }
        );

        const token = resp.data?.token || resp.data?.data?.token;
        if (!token) throw new Error("No token returned from server");
        if (!mounted) return;

        await initClient({
          authToken: token,
          defaults: { audio: true, video: true },
        });
      } catch (err: any) {
        console.error("Dyte init error:", err?.response?.data || err.message);
        setInitError(err?.response?.data?.message || err?.message || "Failed to join meeting");
        setTimeout(navigateBack, 1500);
      } finally {
        if (mounted) setInitializing(false);
      }
    };

    createAndInit();

    return () => {
      mounted = false;
      try {
        client?.leaveRoom?.();
      } catch (e) {}
    };
    
  }, [state]);

  if (initializing || !client) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>{initError ? initError : "Initializing meeting..."}</p>
          {initError && (
            <button onClick={() => navigate("/")} className="home-button">
              Back to Home
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="meeting-container">
      {roleName !== "parent" ? (
        <DummyHeader />
      ) : (
        <header className="meeting-header">
          <div className="header-info">
            <h1>Dyte Meeting</h1>
            <p>You are in the meeting</p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => {
                try {
                  client.leaveRoom();
                } catch (e) {
                  console.warn(e);
                } finally {
                  navigate("/");
                }
              }}
              className="leave-button"
            >
              Leave
            </button>
          </div>
        </header>
      )}
      <main className="meeting-main">
        <DyteMeeting
          meeting={client}
          mode="fill"
          showSetupScreen={true}
          style={{ height: '100%', width: '100%' }}
        />
      </main>
    </div>
  );
};

export default DyteCall;
