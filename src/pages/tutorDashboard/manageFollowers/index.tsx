import React, { useCallback, useEffect, useRef, useState } from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import { useNavigate } from "react-router-dom";
import { useGetFollowersQuery, useGetViewersQuery, useLazyGetBookingsQuery } from "../../../service/tutorApi";
import { showError } from "../../../constants/toast";
import moment from "moment";
import Pagination from "../../../constants/Pagination";
import Loader from "../../../constants/Loader";
import NewSideBarTutor from "../../../components/NewSideBarTutor";

export default function TutorFollowers() {
  const [page, setPage] = useState<number>(1);
  const [tab, setTab] = useState<number>(1);
  const observerRef = useRef<any | null>(null)
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [data1, setData1] = useState<any>([])

  const { data: followers, isLoading: loadingFollowers, isSuccess, isFetching } = useGetFollowersQuery({ page: page, limit: 12 },{skip:tab==2})
  const { data: viewers, isLoading: loadingViewers, isSuccess: isSuccessView, isFetching: isFetch } = useGetViewersQuery({ page: page, limit: 12 },{skip:tab==1})



  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingFollowers || isFetching || isFetch || loadingViewers) return;

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
    [loadingFollowers, isFetching, isFetch, loadingViewers, hasNextPage]
  );
  useEffect(() => {
    setPage(1);
    setData1([]);
    setHasNextPage(true);
  }, [tab]);

  useEffect(() => {
    if (isSuccessView && viewers?.data?.viewers) {

      setData1((prev: any) => {
        const newData = page === 1
          ? [...viewers?.data?.viewers]
          : [...prev, ...viewers?.data?.viewers];

        const unique = Array.from(
          new Map(newData.map(item => [item._id, item])).values()
        );

        return unique;
      });
    }

    if (viewers?.data?.viewers?.length === 0) {
      setHasNextPage(false);
    }
  }, [isSuccessView, viewers, page]);

  useEffect(() => {
    if (isSuccess && followers?.data?.followers) {

      setData1((prev: any) => {
        const newData = page === 1
          ? [...followers?.data?.followers]
          : [...prev, ...followers?.data?.followers];

        const unique = Array.from(
          new Map(newData.map(item => [item._id, item])).values()
        );

        return unique;
      });
    }

    if (followers?.data?.followers?.length === 0) {
      setHasNextPage(false);
    }
  }, [isSuccess, followers, page]);


  return (
    <>
      <TutorLayout className="role-layout">
        <Loader isLoad={loadingFollowers || loadingViewers} />
        <main className="content">

          <section className="uhb_spc pBookingDetail_sc home_wrp">
            <div className="conta_iner v2">
              <div className="gap_m grid_2">
                <NewSideBarTutor />
                <div className=" pdf_inr  rt_v2">
                  <div className="tab_div">
                    <p onClick={() => setTab(1)} className={tab == 1 ? "active" : ""}>Followers</p>
                    <p onClick={() => setTab(2)} className={tab == 2 ? "active" : ""}>Viewers</p>
                  </div>
                  <div
                    className="users_list gap_m"
                  >
                    {data1?.length ? (
                      data1?.map((item: any, index: number) => {
                        return (
                          <div
                            className="user_item"
                          ref={data1?.length === index + 1 ? lastElementRef : null}
                          >

                            <div className="infoBox">
                              <figure>
                                <img
                                  src={
                                    item?.parentId?.image
                                      ? item?.parentId?.image
                                      : `/static/images/user.png`
                                  }
                                  alt="Image"
                                />
                              </figure>
                              <h2>
                                {item?.parentId?.name ? item?.parentId.name : "-"}
                              </h2>
                              <ul>
                                <li>
                                  <span> {item?.parentId?.email
                                    ? item?.parentId?.email
                                    : "-"}</span>

                                </li>
                                <li>
                                  <span>{item?.parentId?.phoneNo
                                    ? item?.parentId?.dialCode + " " + item?.parentId?.phoneNo
                                    : "-"}</span>
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
