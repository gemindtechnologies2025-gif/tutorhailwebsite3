/* eslint-disable jsx-a11y/img-redundant-alt */
import { Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { GoogleMap, MarkerF, PolylineF } from "@react-google-maps/api";
import useAuth from "../../../hooks/useAuth";

export default function LocationDrawer({ toggleDrawer, tutor, price }: any) {
  const navigate = useNavigate(); // navigation hook
  const user = useAuth();

  const center = {
    lat: user?.latitude,
    lng: user?.longitude,
  };
  const locations = [
    { lat: user?.latitude, lng: user?.longitude }, // parent point
    { lat: tutor?.latitude, lng: tutor?.longitude }, // tutor point
  ];
  const path = [
    { lat: user?.latitude, lng: user?.longitude }, // parent point
    { lat: tutor?.latitude, lng: tutor?.longitude }, // tutor point
  ];

  return (
    <>
      <Box className="location_inner" role="presentation">
        <div className="head">
          <button onClick={toggleDrawer(false)}>
            <CloseIcon />
          </button>
          <p>
            <strong>Current Location - 7958 Swift Village</strong>
            <span>EST : 10:00 AM</span>
          </p>
        </div>
        <div className="map">
          <GoogleMap
            mapContainerClassName="map_container"
            center={center}
            zoom={5}
            options={{
              fullscreenControl: false,
              
            }}
          >
            <PolylineF
              path={path}
              options={{
                strokeColor: "#0284c7", // Polyline color
                strokeOpacity: 1.0,
                strokeWeight: 5,
                geodesic: true, 
                zIndex: 10000,
              }}
              visible={true}
              onLoad={() => {
                console.log("Polyline");
              }}
            />
            {locations.map((location, index) => (
              <MarkerF key={index} position={location} />
            ))}
          </GoogleMap>
        </div>
        <div className="info">
          <h2>
            <strong>Tutor Detail</strong>
            <Box
              component="a"
              onClick={() => navigate("/parent/tutor-detail/" + tutor?._id)}
            >
              View Details <ArrowForwardIosIcon />
            </Box>
          </h2>
          <div className="info_tutor">
            <figure>
              <img
                src={tutor?.image || `/static/images/userNew.png`}
                alt="Image"
              />
            </figure>
            <h3>{tutor?.name || ""}</h3>
            <span>
              <StarIcon /> {tutor?.avgRating?.toFixed(1) || ""}{" "}
              {tutor?.classCount && `(${tutor?.classCount})`}
            </span>
            <p>${price || ""}/Hour</p>
          </div>
        </div>
      </Box>
    </>
  );
}
