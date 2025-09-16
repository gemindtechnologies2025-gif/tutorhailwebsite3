/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Card, Box, Skeleton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useGetParentBookingQuery } from "../../../service/booking";
import moment from "moment";
import Pagination from "../../../constants/Pagination";
import { GRADE_TYPE_NAME } from "../../../constants/enums";
import NewSideBarParent from "../../../components/NewSideBarParent";
import { useGetBookedClassQuery } from "../../../service/class";
import GradeIcon from '@mui/icons-material/Grade';
import RateClassModal from "../../../Modals/RateClass";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../constants/Loader";
import ImageGrid from "../../../components/ImageGrid";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type Rate = {
  id: string, classId: string, tutorId: string
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

export default function ParentBookings() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [value1, setValue1] = React.useState(0);
  const user = useAuth();
  const observerRef = useRef<any | null>(null)
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [data1, setData1] = useState<any>([])
  const [page, setPage] = useState<number>(1);
  const [tab, setTab] = useState<number>(1);
  const { data: groupClass, isLoading: isLoadingGroup, isFetching: isFetch, isSuccess: successGroup } =
    useGetBookedClassQuery({
      classModeOnline: value1 == 0 ? true : false,
      page: page,
      limit: 20,
    },{skip:tab==1});
  const [openRate, setOpenRate] = useState<boolean>(false);
  const [ids, setIds] = useState<Rate>({
    id: "", classId: '', tutorId: ""
  })
  // API Hooks
  const { data, isLoading, isSuccess, isError, isFetching } = useGetParentBookingQuery({
    tab: value === 0 ? 1 : value === 1 ? 3 : 2,
    page: page,
    limit: 12,
  },{skip:tab==2});

  const handleJoinCallByParent = (id: string) => {
    navigate(`/zoom-call/${id}?type=parent`, {
      state: {
        data: {
          sessionName: id,
          displayName: user?.name,
          roleType: "0",
          sessionIdleTimeoutMins: "60",
          from: 'class'
        }
      }
    })
  }

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


  const statusCheck = (num: number): string => {
    switch (num) {
      case 1:
        return "Pending";
      case 2:
        return "Accepted";
      case 3:
        return "Completed";
      case 4:
        return "Rejected";
      case 5:
        return "Cancelled";
      case 6:
        return "Ongoing";
      case 7:
        return "Upcoming";
      default:
        return "Unknown";
    }
  };



  // onchange handler for the tab
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChange1 = (event: React.SyntheticEvent, newValue: number) => {
    setValue1(newValue);
  };
  


  useEffect(() => {
    setPage(1);
    setData1([]);
    setHasNextPage(true);
  }, [tab, value, value1]);


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
      <ParentLayout className="role-layout">
        <main className="content">
          <section className="ut_spc pBooking_sc home_wrp pfd_wrp booking_scc">
            <div className="conta_iner v2">
              <div className="gap_m grid_2">
                <NewSideBarParent />

                <div className="rt_v2 ">
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
                          {isSuccess && data1?.length ? (
                            data1?.map((item: any, index: number) => (
                              <li
                                
                                onClick={() =>
                                  navigate(
                                    "/parent/booking-detail/accepted/" +
                                    item?._id
                                  )
                                }
                                key={item?._id}
                              >
                                <div ref={data1?.length === index + 1 ? lastElementRef : null} className="booking_inner">
                                  <figure>
                                    <img
                                      src={
                                        item?.tutors?.image ||
                                        `/static/images/userNew.png`
                                      }
                                      alt="Emma2"
                                    />
                                    <figcaption>
                                      {<StarIcon />}
                                      {item?.tutors?.avgRating
                                        ? item.tutors.avgRating.toFixed(1)
                                        : "0"}
                                    </figcaption>
                                  </figure>
                                  <div>
                                    <h3>{item?.tutors?.name || ""}</h3>
                                    <p>
                                      {moment(
                                        item?.bookingdetails?.[0]?.date
                                      ).format("LLL") || "-"}
                                    </p>
                                    <h5>
                                      {" "}
                                      $
                                      {item?.grandTotal ? item?.grandTotal?.toFixed(2) : 0
                                      }
                                      /hour
                                    </h5>
                                    {/* <h5> ${item?.teachingdetails?.price}/hour</h5> */}
                                    <strong>
                                      {item?.classModeOnline
                                        ? "Online"
                                        : "Offline"}
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
                                  <p>
                                    {item?.classId !== undefined &&
                                      item?.classId !== null
                                      ? GRADE_TYPE_NAME[Number(item?.classId)]
                                      : ""}{" "}
                                  </p>
                                </div>
                                <h4
                                  style={
                                    item?.bookingStatus == 1
                                      ? { backgroundColor: "#b0aa1ac4" }
                                      : item?.bookingStatus == 4 ||
                                        item?.bookingStatus == 5
                                        ? { backgroundColor: "red" }
                                        : {}
                                  }
                                  className="booking_com"
                                >
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
                          <Loader isLoad={isLoading} />
                          }
                        <ul className="booking_card gap_m">
                          {isSuccess && data1?.length ? (
                            data1?.map((item: any, index: number) => (
                              <li
                                onClick={() =>
                                  navigate(
                                    "/parent/booking-detail/accepted/" +
                                    item?._id
                                  )
                                }
                                key={item?._id}
                              >
                                <div ref={data1?.length === index + 1 ? lastElementRef : null} className="booking_inner">
                                  <figure>
                                    <img
                                      src={
                                        item?.tutors?.image ||
                                        `/static/images/userNew.png`
                                      }
                                      alt="Emma2"
                                    />
                                    <figcaption>
                                      {item?.tutors?.avgRating && <StarIcon />}
                                      {item?.tutors?.avgRating
                                        ? item.tutors.avgRating.toFixed(1)
                                        : ""}
                                    </figcaption>
                                  </figure>
                                  <div>
                                    <h3>{item?.tutors?.name || ""}</h3>
                                    <p>
                                      {moment(
                                        item?.bookingdetails?.[0]?.date
                                      ).format("LLL") || "-"}
                                    </p>
                                    <h5>
                                      {" "}
                                      $
                                      {item?.grandTotal ? item?.grandTotal?.toFixed(2) : 0
                                      }
                                      /hour
                                    </h5>
                                    <strong>
                                      {item?.classModeOnline
                                        ? "Online"
                                        : "Offline"}
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
                                  <p>
                                    {item?.classId !== undefined &&
                                      item?.classId !== null
                                      ? GRADE_TYPE_NAME[Number(item?.classId)]
                                      : ""}{" "}
                                  </p>
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
                          <Loader isLoad={isLoading} />
                          }
                        <ul className="booking_card gap_m">
                          {isSuccess && data1?.length ? (
                            data1?.map((item: any, index: number) => (
                              <li
                                onClick={() =>
                                  navigate(
                                    "/parent/booking-detail/accepted/" +
                                    item?._id
                                  )
                                }
                                key={item?._id}
                              >
                                <div ref={data1?.length === index + 1 ? lastElementRef : null} className="booking_inner">
                                  <figure>
                                    <img
                                      src={
                                        item?.tutors?.image ||
                                        `/static/images/userNew.png`
                                      }
                                      alt="Emma2"
                                    />
                                    <figcaption>
                                      {item?.tutors?.avgRating && <StarIcon />}
                                      {item?.tutors?.avgRating
                                        ? item.tutors.avgRating.toFixed(1)
                                        : ""}
                                    </figcaption>
                                  </figure>
                                  <div>
                                    <h3>{item?.tutors?.name || ""}</h3>
                                    <p>
                                      {moment(
                                        item?.bookingdetails?.[0]?.date
                                      ).format("LLL") || "-"}
                                    </p>
                                    <h5>
                                      {" "}
                                      $
                                      {item?.grandTotal ? item?.grandTotal?.toFixed(2) : 0
                                      }
                                      /hour
                                    </h5>
                                    <strong>
                                      {item?.classModeOnline
                                        ? "Online"
                                        : "Offline"}
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
                                  <p>
                                    {item?.classId !== undefined &&
                                      item?.classId !== null
                                      ? GRADE_TYPE_NAME[Number(item?.classId)]
                                      : ""}{" "}
                                  </p>
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
                         {isLoadingGroup &&
                          <Loader isLoad={isLoadingGroup} />
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
                                        <b onClick={() => {
                                          setIds({
                                            id: item?._id,
                                            classId: item?.classData?._id,
                                            tutorId: item?.tutor?._id
                                          })
                                          setOpenRate(true)
                                        }} > <GradeIcon />Rate Now </b>
                                        <button onClick={() => handleJoinCallByParent(item?.classSlots?._id)} className="btn btn-primary">Join</button>
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
                          {isLoadingGroup &&
                          <Loader isLoad={isLoadingGroup} />
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
                      <RateClassModal
                        open={openRate}
                        onClose={() => setOpenRate(false)}
                        setOpen={setOpenRate}
                        id={ids?.id}
                        classId={ids?.classId}
                        tutorId={ids?.tutorId}
                      />

                    </>
                  )}
                </div>
              </div>
                
            </div>
          </section>
        </main>
      </ParentLayout>
    </>
  );
}


