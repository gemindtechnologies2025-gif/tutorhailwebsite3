/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import NewSideBarParent from "../../../components/NewSideBarParent";
import { useGetInquiriesQuery } from "../../../service/inquiry";
import Loader from "../../../constants/Loader";
import moment from "moment";
import { TEASER_VIDEO_STATUS } from "../../../constants/enums";
import { showWarning } from "../../../constants/toast";

export default function InquireyPage() {

  const [selected, setSelected] = useState<any>({});
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [data1, setData1] = useState<any>([]);
  const observerRef = useRef<any | null>(null);
  const { data: inquiries, isLoading, isFetching, isSuccess } = useGetInquiriesQuery({
    page: page,
    limit: 10,
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
    if (isSuccess && inquiries?.data?.data) {

      setData1((prev: any) => {
        const newData = page === 1
          ? [...inquiries.data.data]  // fresh load
          : [...prev, ...inquiries.data.data]; // append for infinite scroll

        const unique = Array.from(
          new Map(newData.map(item => [item._id, item])).values()
        );

        return unique;
      });
    }

    if (inquiries?.data?.data?.length === 0) {
      setHasNextPage(false);
    }
  }, [isSuccess, inquiries, page]);

  return (
    <>
      <ParentLayout className="role-layout">
        <Loader isLoad={isLoading} />
        <main className="content">
          <section className="uh_spc inq_wrp home_wrp">
            <div className="conta_iner v2">
              <div className="gap_m grid_three">
                <NewSideBarParent />
                <ul className="cmn_crd_wp  inq_card md_ul">
                  {data1?.length
                    ? data1?.map((item: any, index: number) => {
                      return (
                        <li key={item?._id}>
                          <div
                            className="in_row"
                            onClick={() =>  { item?.status == TEASER_VIDEO_STATUS.PENDING ? showWarning("Your inquiry status is still pending"): setSelected(item)}}
                            ref={index === data1?.length - 1 ? lastElementRef : null}
                          >
                            <figure>
                              <img
                                style={{objectFit:"cover"}}
                                src={
                                  item?.tutor?.image ||
                                  `/static/images/emaa.png`
                                }
                                alt="emaa"
                              />
                            </figure>
                            <div className="dsc">
                              <h4>
                                {item?.tutor?.name || "-"}{" "}
                                <span>
                                  {item?.createdAt
                                    ? moment(item?.createdAt).format("LLL")
                                    : ""}
                                </span>{" "}
                              </h4>
                              <p>
                                {item?.other?.length > 100
                                  ? item?.other?.slice(0, 100) + "..."
                                  : item?.other}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`status ${item?.status == TEASER_VIDEO_STATUS.PENDING ? "pending" : item?.status == TEASER_VIDEO_STATUS.REJECTED ? "rejected" : ""} `}
                          >
                            {" "}
                            {item?.status == TEASER_VIDEO_STATUS.PENDING
                              ? "Pending"
                              : item?.status == TEASER_VIDEO_STATUS.APPROVED
                                ? "Answered"
                                : "Rejected"}
                          </span>
                        </li>
                      );
                    })
                    : (
                      <div className=" mdl_cntnt video_content no_data">
                        <figure>
                          <img src="/static/images/noData.png" alt="no data found" />
                        </figure>
                        <p>No Inquiry found</p>
                      </div>
                    )}
                </ul>
                {selected?._id ? (
                  <div className="answer_sec sidebar_rt">
                    <ul className="cmn_crd_wp inq_card">
                      <li>
                        <div className="in_row">
                          <figure>
                            <img src={`/static/images/emaa.png`} alt="emaa" />
                          </figure>
                          <div className="dsc">
                            <h4>
                              {selected?.tutor?.name || ""}{" "}
                              <span>
                                {selected?.createdAt
                                  ? moment(selected?.createdAt).format("LLL")
                                  : ""}
                              </span>{" "}
                            </h4>
                            <p>{selected?.other || ""}</p>
                          </div>
                        </div>
                        {selected?.revert ? (
                          <div className="ans_bx">
                            <button className="btn primary">
                              Admin revert
                            </button>
                            {/* <h6>1:01 PM</h6> */}
                            <p>{selected?.revert || ""}</p>
                          </div>
                        ) : null}

                        {selected?.tutorRevert ? (
                          <div className="ans_bx">
                            <button className="btn primary">
                              Tutor revert
                            </button>
                            <p>{selected?.tutorRevert || ""}</p>
                          </div>
                        ) : null}
                      </li>
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </main>
      </ParentLayout>
    </>
  );
}
