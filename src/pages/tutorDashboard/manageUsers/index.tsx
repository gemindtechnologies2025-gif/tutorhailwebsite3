import React, { useCallback, useEffect, useRef, useState } from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import { useNavigate } from "react-router-dom";
import { useGetBookingsQuery, useLazyGetBookingsQuery } from "../../../service/tutorApi";
import { showError } from "../../../constants/toast";
import moment from "moment";
import Pagination from "../../../constants/Pagination";
import Loader from "../../../constants/Loader";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import {  GRADE_TYPE_NAME } from "../../../constants/enums";

export default function TutorUsers() {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
const observerRef = useRef<any | null>(null)
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [data1, setData1] = useState<any>([])

  const { data, isLoading, isSuccess, isError, isFetching } = useGetBookingsQuery({
      bookingStatus: 3, page: page
    });

    const lastElementRef = useCallback(
        (node: HTMLDivElement | null) => {
          if (isLoading || isFetching) return;
    
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
        [isLoading, isFetching, hasNextPage]
      );
    

      useEffect(() => {
          if (isSuccess && data?.data?.booking) {
      
            setData1((prev: any) => {
              const newData = page === 1
                ? [...data.data.booking]  // fresh load
                : [...prev, ...data.data.booking]; // append for infinite scroll
      
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

  // const fetchUsers = async () => {
  //   setIsLoading(true);
  //   try {
  //     const res = await getBookings({ bookingStatus: 3, page: page }).unwrap();
  //     setIsLoading(false);
  //     if (res?.statusCode === 200) {
  //       setUsers(res?.data?.booking);
  //       setCount(res?.data?.totalBooking);
  //     }
  //   } catch (error: any) {
  //     setIsLoading(false);
  //     showError(error?.data?.message);
  //   }
  // };


  return (
    <>
      <TutorLayout className="role-layout">
        <Loader isLoad={isLoading} />
        <main className="content">
          <section className="uhb_spc pBookingDetail_sc home_wrp">
            <div className="conta_iner v2">
              <div className="gap_m grid_2">
                <NewSideBarTutor />
                <div className=" pdf_inr  rt_v2">
                  <div
                    className="users_list gap_m"
                  >
                    {data1?.length ? (
                      data1?.map((item: any, index: number) => {
                        return (
                          <div
                          ref={index === data1?.length - 1 ? lastElementRef : null}
                            className="user_item"
                            onClick={() =>
                              navigate(`/tutor/user-detail/${item?._id}`)
                            }
                          >
                            <ul className="top">
                              <li>
                                <span>Date :</span>
                                <strong>
                                  {moment(
                                    item?.bookingdetails?.[0]?.date
                                  ).format("DD/MM/YYYY") || "-"}
                                </strong>
                              </li>
                              <li>
                                <span>Time :</span>
                                <strong>
                                  {moment(
                                    item?.bookingdetails?.[0]?.startTime
                                  ).format("hh:mmA")}{" "}
                                  -{" "}
                                  {moment(
                                    item?.bookingdetails?.[0]?.endTime
                                  ).format("hh:mmA") || "-"}
                                </strong>
                              </li>
                            </ul>
                            <div className="infoBox">
                              <figure>
                                <img
                                  src={
                                    item?.parents?.image
                                      ? item?.parents?.image
                                      : `/static/images/user.png`
                                  }
                                  alt="Image"
                                />
                              </figure>
                              <h2>
                                {item?.parents?.name ? item?.parents.name : "-"}
                              </h2>
                              <ul>
                                <li>
                                  <span>Subject</span>
                                  <strong>
                                    {item?.subjects?.[0]?.name
                                      ? item?.subjects?.[0]?.name
                                      : "-"}
                                  </strong>
                                </li>
                                <li>
                                  <span>Grade</span>
                                  <strong>{item?.classId ? (GRADE_TYPE_NAME[item?.classId]):""}</strong>
                                </li>
                              </ul>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="no_data">
                        <figure>
                          <img
                            src="/static/images/noData.png"
                            alt="no data found"
                          />
                        </figure>
                        <p>No user found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              
            </div>
          </section>
        </main>
      </TutorLayout>
    </>
  );
}
