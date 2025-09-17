/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import { useGetBookingsQuery, useJoinVideoCallMutation, useLazyGetBookingsQuery } from "../../../service/tutorApi";
import { showError } from "../../../constants/toast";
import Pagination from "../../../constants/Pagination";
import Loader from "../../../constants/Loader";
import moment from "moment";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import { Class_Variables, GRADE_TYPE_NAME } from "../../../constants/enums";
import { useGetBookedClassQuery } from "../../../service/class";
import { toast } from "sonner";
import useAuth from "../../../hooks/useAuth";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TutorBookings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [tab, setTab] = useState<number>(1);
  const user = useAuth();
  const [value, setValue] = React.useState(0);
  const [value1, setValue1] = React.useState(0);
  const [page, setPage] = useState<number>(1);
  const observerRef = useRef<any | null>(null)
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [data1, setData1] = useState<any>([])

  const { data: groupClass, isLoading: isLoadingGroup, isFetching: isFetch, isSuccess: successGroup } =
    useGetBookedClassQuery({
      classModeOnline: value1 == 0 ? true : false,
      page: page,
      limit: 10,
    }, { skip: tab == 1 });

 

  const { data, isLoading, isSuccess, isError, isFetching } = useGetBookingsQuery({
    bookingType: value === 0 ? 1 : value === 1 ? 3 : 2,
    page: page,
  }, { skip: tab == 2 });

const handleChange1 = (event: React.SyntheticEvent, newValue: number) => {
    setValue1(newValue);
  };
  
  
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetching || isFetch || isLoadingGroup) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            setPage((prev) => prev + 1);
          }
        },
        {
          threshold: 0.5,      // fire when 50% visible
          rootMargin: "100px", // preload earlier
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetching, isFetch, isLoadingGroup, hasNextPage]
  );


  useEffect(() => {
    setPage(1);
    setData1([]);
    setHasNextPage(true);
  }, [tab, value, value1]);



  const handleJoinCallByParent = (item: any) => {
    navigate(`/dyte-call/${item?._id}?type=tutor`, {
      state: {
        data: {
          dyteId: item?.classData?.dyteMeeting?.meetingId,
          displayName: user?.name,
          roleType: "0",
          sessionIdleTimeoutMins: "60",
          from: 'class'
        }
      }
    })
  }


  const statusCheck = (num: number): string => {
    switch (num) {
      case 1:
        return "PENDING";
      case 2:
        return "ACCEPTED";
      case 3:
        return "COMPLETED";
      case 4:
        return "REJECTED";
      case 5:
        return "CANCELLED";
      case 6:
        return "ONGOING";
      case 7:
        return "UPCOMING";
      default:
        return "UNKNOWN";
    }
  };

  const navigationLink = (item: any): string => {

    switch (item?.bookingStatus) {
      case 1:
        return `/tutor/booking-detail/pending/${item?._id}`;
      case 2:
        return `/tutor/booking-detail/accepted/${item?._id}`;
      case 3:
        return `/tutor/booking-detail/completed/${item?._id}`;
      case 4:
        return `/tutor/booking-detail/cancelled/${item?._id}`;
      case 5:
        return `/tutor/booking-detail/cancelled/${item?._id}`;
      case 6:
        return `/tutor/booking-detail/ongoing/${item?._id}`;
      default:
        return `/tutor/booking-detail/ongoing/${item?._id}`;
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useLayoutEffect(() => {
    if (state) {
      setValue(state?.tab - 1)
    }
  }, [])

  useEffect(() => {
    if (successGroup && groupClass?.data) {

      setData1((prev: any) => {
        const newData = page === 1
          ? [...groupClass?.data]
          : [...prev, ...groupClass?.data];

        const unique = Array.from(
          new Map(newData.map(item => [item._id, item])).values()
        );

        return unique;
      });
    }

    if (groupClass?.data?.length === 0) {
      setHasNextPage(false);
    }
  }, [successGroup, groupClass, page]);

  useEffect(() => {
    if (isSuccess && data?.data?.booking) {

      setData1((prev: any) => {
        const newData = page === 1
          ? [...data?.data?.booking]
          : [...prev, ...data?.data?.booking];

        const unique = Array.from(
          new Map(newData.map(item => [item._id, item])).values()
        );

        return unique;
      });
    }

    if (data?.data?.booking?.length === 0) {
      setHasNextPage(false);
    }
  }, [isSuccess, data, page]);




  return (
    <>
      <TutorLayout className="role-layout">
        <Loader isLoad={isLoading} />
        <main className="content">


          <section className="ut_spc pBooking_sc home_wrp pfd_wrp booking_scc">
            <div className="conta_iner v2">
              <div className="gap_m grid_2">

                <NewSideBarTutor />


                <div className="role_body ">
                  <div className="tab_div" style={{ marginBottom: "20px" }}>
                    <p
                      onClick={() => setTab(1)}
                      className={tab == 1 ? "active" : ""}
                    >
                      One to One
                    </p>
                    <p
                      onClick={() => setTab(2)}
                      className={tab == 2 ? "active" : ""}
                    >
                      Group
                    </p>
                  </div>
                  {tab === 1 ? (
                    <>
                      <Tabs
                        className="custom_tabs"
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                      >
                        <Tab label="Upcoming Bookings" {...a11yProps(0)} />
                        <Tab label="Ongoing Bookings" {...a11yProps(1)} />
                        <Tab label="Past Bookings" {...a11yProps(2)} />

                      </Tabs>
                      <CustomTabPanel value={value} index={0}>
                        {isLoading &&
                          <Loader isLoad={isLoading} />
                        }
                        <ul className="booking_card gap_m">
                          {data1?.length ? (
                            data1?.map((item: any, index: number) => (
                              <li onClick={() =>
                                navigate(navigationLink(item))
                              }
                                key={item?._id}>
                                <div ref={data1?.length === index + 1 ? lastElementRef : null} className="booking_inner">
                                  <figure>
                                    <img
                                      src={
                                        item?.parents?.image
                                          ? item?.parents?.image
                                          : `/static/images/user.png`
                                      }
                                      alt="Emma2"
                                    />

                                  </figure>
                                  <div>
                                    <h3>{item?.parents?.name || ""}</h3>
                                    <p> {moment(
                                      item?.bookingdetails?.[0]?.startTime
                                    ).format("LL")}</p>
                                    <p>
                                      {moment(
                                        item?.bookingdetails?.[0]?.startTime
                                      ).format("hh:mmA")}{" "}
                                      -{" "}
                                      {moment(
                                        item?.bookingdetails?.[0]?.endTime
                                      ).format("hh:mmA") || "-"}
                                    </p>
                                    <h5>
                                      ${(
                                        item?.grandTotal && item?.bookingdetails?.length
                                          ? item.grandTotal / item.bookingdetails.length
                                          : 0
                                      ).toFixed(2)}
                                      /hour
                                    </h5>

                                    <strong>
                                      {item?.classModeOnline ? "Online" : "Offline"}
                                    </strong>
                                    <span>
                                      {" "}
                                      <img
                                        src={`/static/images/rightNext.png`}
                                        alt="rightNext"
                                      />
                                    </span>
                                  </div>
                                </div>
                                <div className="booking_btm">
                                  <p>{item?.subjects?.[0]?.name || ""}</p>
                                  <p>{item?.classId !== undefined && item?.classId !== null ? GRADE_TYPE_NAME[Number(item?.classId)] : ""}   </p>
                                </div>
                                <h4 style={item?.bookingStatus == 1 ? { backgroundColor: '#b0aa1ac4' } : item?.bookingStatus == 4 || item?.bookingStatus == 5 ? { backgroundColor: 'red' } : {}} className="booking_com">
                                  {statusCheck(item?.bookingStatus)}
                                </h4>
                              </li>
                            ))
                          ) : (
                            <div className="no_data">
                              <figure>
                                <img
                                  src="/static/images/noData.png"
                                  alt="no data found"
                                />
                              </figure>
                              <p>No booking found</p>
                            </div>
                          )}
                        </ul>
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={1}>
                        {isLoading &&
                          <Loader isLoad={isLoading} />}
                        <ul className="booking_card gap_m">
                          {data1?.length ? (
                            data1?.map((item: any, index: number) => (
                              <li
                                onClick={() => navigate(navigationLink(item))}
                                key={item?._id}
                              >
                                <div ref={data1?.length === index + 1 ? lastElementRef : null} className="booking_inner">
                                  <figure>
                                    <img
                                      src={
                                        item?.parents?.image ||
                                        `/static/images/userNew.png`
                                      }
                                      alt="Emma2"
                                    />

                                  </figure>
                                  <div>
                                    <h3>{item?.parents?.name || ""}</h3>
                                    <p> {moment(
                                      item?.bookingdetails?.[0]?.startTime
                                    ).format("LL")}</p>
                                    <p>
                                      {moment(
                                        item?.bookingdetails?.[0]?.startTime
                                      ).format("hh:mmA")}{" "}
                                      -{" "}
                                      {moment(
                                        item?.bookingdetails?.[0]?.endTime
                                      ).format("hh:mmA") || "-"}
                                    </p>
                                    <h5>
                                      ${(
                                        item?.grandTotal && item?.bookingdetails?.length
                                          ? item.grandTotal / item.bookingdetails.length
                                          : 0
                                      ).toFixed(2)}
                                      /hour
                                    </h5>
                                    <strong>
                                      {item?.classModeOnline ? "Online" : "Offline"}
                                    </strong>
                                    <span>
                                      {" "}
                                      <img
                                        src={`/static/images/rightNext.png`}
                                        alt="rightNext"
                                      />
                                    </span>
                                  </div>
                                </div>
                                <div className="booking_btm">
                                  <p>{item?.subjects?.[0]?.name || ""}</p>
                                  <p>{item?.classId !== undefined || item?.classId !== null ? GRADE_TYPE_NAME[Number(item?.classId)] : ""}   </p>
                                </div>
                                <h4 className="booking_com">
                                  {statusCheck(item?.bookingStatus)}
                                </h4>
                              </li>
                            ))
                          ) : (
                            <div className="no_data">
                              <figure>
                                <img
                                  src="/static/images/noData.png"
                                  alt="no data found"
                                />
                              </figure>
                              <p>No booking found</p>
                            </div>
                          )}
                        </ul>
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={2}>
                        {isLoading &&
                          <Loader isLoad={isLoading} />}
                        <ul className="booking_card gap_m">
                          {data1?.length ? (
                            data1?.map((item: any,index:number) => (
                              <li onClick={() =>
                                navigate(
                                  navigationLink(item)
                                )
                              }
                                key={item?._id}>
                                <div ref={data1?.length === index + 1 ? lastElementRef : null} className="booking_inner">
                                  <figure>
                                    <img
                                      src={
                                        item?.parents?.image ||
                                        `/static/images/userNew.png`
                                      }
                                      alt="Emma2"
                                    />

                                  </figure>
                                  <div>
                                    <h3>{item?.parents?.name || ""}</h3>
                                    <p> {moment(
                                      item?.bookingdetails?.[0]?.startTime
                                    ).format("LL")}</p>
                                    <p>
                                      {moment(
                                        item?.bookingdetails?.[0]?.startTime
                                      ).format("hh:mmA")}{" "}
                                      -{" "}
                                      {moment(
                                        item?.bookingdetails?.[0]?.endTime
                                      ).format("hh:mmA") || "-"}
                                    </p>
                                    <h5>
                                      ${(
                                        item?.grandTotal && item?.bookingdetails?.length
                                          ? item.grandTotal / item.bookingdetails.length
                                          : 0
                                      ).toFixed(2)}
                                      /hour
                                    </h5>
                                    <strong>
                                      {item?.classModeOnline ? "Online" : "Offline"}
                                    </strong>
                                    <span>
                                      {" "}
                                      <img
                                        src={`/static/images/rightNext.png`}
                                        alt="rightNext"
                                      />
                                    </span>
                                  </div>
                                </div>
                                <div className="booking_btm">
                                  <p>{item?.subjects?.[0]?.name || ""}</p>
                                  <p>{item?.classId !== undefined || item?.classId !== null ? GRADE_TYPE_NAME[Number(item?.classId)] : ""}   </p>

                                </div>
                                <h4 className="booking_com">
                                  {statusCheck(item?.bookingStatus)}
                                </h4>
                              </li>
                            ))
                          ) : (
                            <div className="no_data">
                              <figure>
                                <img
                                  src="/static/images/noData.png"
                                  alt="no data found"
                                />
                              </figure>
                              <p>No booking found</p>
                            </div>
                          )}
                        </ul>
                      </CustomTabPanel>
                     
                    </>
                  ) : (
                    <>
                      <Tabs
                        className="custom_tabs"
                        value={value1}
                        onChange={handleChange1}
                        aria-label="basic tabs example"
                      >
                        <Tab label="Online Bookings" {...a11yProps(0)} />
                        <Tab label="Offline Bookings" {...a11yProps(1)} />
                      </Tabs>
                      <CustomTabPanel value={value1} index={0}>
                        {isLoading ?

                          <Loader isLoad={isLoadingGroup} /> : null
                        }
                        <ul className="booking_card gap_m">
                          {data1?.length ? (
                            data1?.map(
                              (item: any, index: number) => (
                                <li key={item?._id}>
                                  <div ref={data1?.length === index + 1 ? lastElementRef : null} className="booking_inner">
                                    <div>
                                      <h3>{item?.classData?.topic || ""}</h3>
                                      <p>
                                        {item?.subjectId?.name || ""}
                                        {item?.tutor?.userName
                                          ? ` | Tutor : ${item?.tutor?.userName}`
                                          : ""}
                                        {item?.classSlots?.startTime
                                          ? ` | ${moment(item?.classSlots?.startTime).format("LLL")}`
                                          : ""}
                                      </p>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <p>Session Type:Group </p>
                                        <p>
                                          {item?.classSlots?.startTime
                                            ? `${moment(item?.classSlots?.startTime).format("LT")} - ${moment(item?.classSlots?.endDate).format("LT")}`
                                            : ""}
                                        </p>
                                      </div>
                                      <div
                                        className="rate_class"
                                      >
                                        <b
                                        > </b>
                                        <button
                                          onClick={() => handleJoinCallByParent(item)}
                                          className="btn btn-primary">Join</button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )
                            )
                          ) : (
                            <div className="no_data">
                              <figure>
                                <img
                                  src="/static/images/noData.png"
                                  alt="no data found"
                                />
                              </figure>
                              <p>No booking found</p>
                            </div>
                          )}
                        </ul>
                      </CustomTabPanel>
                      <CustomTabPanel value={value1} index={1}>
                        {isLoading ?

                          <Loader isLoad={isLoadingGroup} /> : null
                        }
                        <ul className="booking_card gap_m">
                          {data1?.length ? (
                            data1?.map(
                              (item: any, index: number) => (
                                <li key={item?._id}>
                                  <div ref={data1?.length === index + 1 ? lastElementRef : null} className="booking_inner">
                                    <div>
                                      <h3>{item?.classData?.topic || ""}</h3>
                                      <p>
                                        {item?.subjectId?.name || ""}
                                        {item?.tutor?.userName
                                          ? ` | Tutor : ${item?.tutor?.userName}`
                                          : ""}
                                        {item?.classSlots?.startTime
                                          ? ` | ${moment(item?.classSlots?.startTime).format("LLL")}`
                                          : ""}
                                      </p>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <p>Session Type:Group </p>
                                        <p>
                                          {item?.classSlots?.startTime
                                            ? `${moment(item?.classSlots?.startTime).format("LT")} - ${moment(item?.classSlots?.endDate).format("LT")}`
                                            : ""}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )
                            )
                          ) : (
                            <div className="no_data">
                              <figure>
                                <img
                                  src="/static/images/noData.png"
                                  alt="no data found"
                                />
                              </figure>
                              <p>No booking found</p>
                            </div>
                          )}
                        </ul>
                      </CustomTabPanel>

                    </>
                  )}

                </div>
              </div>
            </div>
          </section>
        </main>
      </TutorLayout>
    </>
  );
}
