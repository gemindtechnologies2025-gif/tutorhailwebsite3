/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import NewSideBarParent from "../../../components/NewSideBarParent";
import { TutorLayout } from "../../../layout/tutorLayout";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import { TextField } from "@mui/material";
import {
  useGetInquiriesQuery,
  useRevertInqueryByTutorMutation,
} from "../../../service/inquiry";
import moment from "moment";
import { TEASER_VIDEO_STATUS } from "../../../constants/enums";
import Loader from "../../../constants/Loader";
import { isValidInput } from "../../../utils/validations";
import { showError, showToast } from "../../../constants/toast";

export default function TutorInquireyPage() {
    const [page, setPage] = useState<number>(1);
  const { data: inquiries, isLoading,isFetching,isSuccess } = useGetInquiriesQuery({
    page: page,
    limit: 10,
  });
  const [selected, setSelected] = useState<any>({});
  const [revert, setRevert] = useState<string>("");
  const [sendReply, { isLoading: loadingReply }] =
    useRevertInqueryByTutorMutation();
  const observerRef = useRef<any | null>(null)
    const [hasNextPage, setHasNextPage] = useState<boolean>(true)
    const [data1, setData1] = useState<any>([])

  const sendReplyFunc = async () => {
    const body = {
      inquiryId: selected?._id,
      tutorRevert: revert,
    };
    try {
      const res = await sendReply({ body }).unwrap();
      if (res?.statusCode == 200) {
        showToast("Revert sent successfully");
      }
    } catch (error: any) {
      showError(error?.data?.message || "");
    }
  };

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
      [isLoading, isFetching, isFetching, hasNextPage]
    );

    useEffect(() => {
        if (isSuccess && inquiries?.data?.data) {
    
          setData1((prev: any) => {
            const newData = page === 1
              ? [...inquiries?.data?.data]
              : [...prev, ...inquiries?.data?.data];
    
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
      <TutorLayout className="role-layout">
        <Loader isLoad={isLoading} />
        <main className="content">
          <section className="uh_spc inq_wrp home_wrp">
            <div className="conta_iner v2">
              <div className="gap_m grid_three">
                <NewSideBarTutor />

                <ul className="cmn_crd_wp  inq_card md_ul">
                  {data1?.length
                    ? data1?.map((item: any, index: number) => {
                        return (
                          <li key={item?._id}>
                            <div
                              className="in_row"
                              onClick={() => setSelected(item)}
                              ref={index===data1?.length-1 ? lastElementRef : null}
                            >
                              <figure>
                                <img
                                  src={
                                    item?.parent?.image ||
                                    `/static/images/emaa.png`
                                  }
                                  alt="emaa"
                                />
                              </figure>
                              <div className="dsc">
                                <h4>
                                  {item?.parent?.name || "-"}{" "}
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
                              {selected?.parent?.name || ""}{" "}
                              <span>
                                {selected?.createdAt
                                  ? moment(selected?.createdAt).format("LLL")
                                  : ""}
                              </span>{" "}
                            </h4>
                          </div>
                        </div>
                        <p>{selected?.other || ""}</p>
                        {selected?.tutorRevert ? (
                             <div className="dsc">
                             <h6>Your Revert:{" "}
                                <span style={{color:'grey'}}>
                                {selected?.tutorRevert || ""}{" "}
                                 </span>                              
                             </h6>
                           </div>
                        ):(
                            <>
                            <form className="out_row">
                            <div
                              className="control_group"
                              style={{ marginTop: "15px" }}
                            >
                              <TextField
                                fullWidth
                                multiline
                                minRows={6}
                                maxRows={6}
                                placeholder="Share your thoughts..."
                                value={revert}
                                onChange={(e) => {
                                  if (isValidInput(e.target.value)) {
                                    setRevert(e.target.value);
                                  }
                                }}
                              />
                            </div>
                          </form>
                          <button onClick={sendReplyFunc} className="btn primary">
                            Submit
                          </button>
                            </>
                        )}
                      
                      </li>
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </main>
      </TutorLayout>
    </>
  );
}
