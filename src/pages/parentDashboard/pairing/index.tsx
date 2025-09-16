/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import { useNavigate } from "react-router-dom";
import { useGetPairingQuery } from "../../../service/booking";
import Pagination from "../../../constants/Pagination";
import moment from "moment";
import { Card, CardContent, Skeleton } from "@mui/material";

export default function ParentPairing() {
  const navigate = useNavigate();

  // states
  const [page, setPage] = useState<number>(1);

  const {
    data: response,
    isError,
    isLoading,
    isSuccess,
  } = useGetPairingQuery({ page: page, bookingStatus: 2, limit: 12 }); // API Hook to fetch the pairing details

  // onChange handler for the page
  const onPageChange = (newPage: number) => {
    setPage(newPage);
  };

  let totalPages = Math.ceil((response?.data?.totalBooking || 12) / 12);

  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">
          <section className="uhb_spc pPairing_sc">
            <div className="conta_iner v2">
              <div className="role_head">
                <button
                  className="back_arrow"
                  onClick={() => navigate("/parent/search-result")}
                >
                  <img src={`/static/images/back.png`} alt="Back" />
                </button>
                <h1 className="hd_3">Pairing</h1>
              </div>
              <div className="role_body">
                <div className="pairing_list gap_m">
                  {isLoading &&
                    Array.from(new Array(6)).map((item, index) => (
                      <BookingCard key={index} />
                    ))}

                  {isSuccess && response?.data?.booking?.length
                    ? response?.data?.booking?.map((item, index) => (
                      <div className="pairing_item" key={item?._id}>
                        <p>
                          {item?.bookingdetails[0]?.otp?.pairingType === 1
                            ? "Start"
                            : item?.bookingdetails[0]?.otp?.pairingType === 2
                              ? "End"
                              : ""}{" "}
                          Booking Code -{" "}
                          <strong>
                            {item?.bookingdetails[0]?.otp?.otp || ""}
                          </strong>
                        </p>
                        <div className="box">
                          <figure>
                            <img
                              src={
                                item?.tutors?.image ||
                                `/static/images/userNew.png`
                              }
                              alt="Image"
                            />
                          </figure>
                          <h2>{item?.tutors?.name || ""}</h2>
                          <ul>
                            <li>
                              <span>Date & Time</span>
                              <strong>
                                {moment(
                                  item?.bookingdetails[0]?.startTime
                                ).format("D MMMM,YY HH:mm a")}
                              </strong>
                            </li>
                            <li>
                              <span>Subject</span>
                              <strong>{item?.subjects[0]?.name || ""}</strong>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ))
                    : (
                      <div className="no_data">
                        <figure>
                          <img src="/static/images/noData.png" alt="no data found" />
                        </figure>
                        <p>No Pairing found</p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </section>
          {response?.data?.booking && response?.data?.booking?.length > 0 ? (
            <Pagination
              module={response?.data?.booking}
              page={page}
              onPageChange={onPageChange}
              totalPages={totalPages}
            />
          ) : null}
        </main>
      </ParentLayout>
    </>
  );
}

const BookingCard = () => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 2,
        borderRadius: 2,
        width: "44%",
        marginTop: "10px",
      }}
    >
      <Skeleton
        variant="rectangular"
        width={100}
        height={100}
        sx={{ marginRight: 2 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="80%" />
      </CardContent>
    </Card>
  );
};
