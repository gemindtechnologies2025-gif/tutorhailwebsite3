import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetContentQuery } from "../service/content";
import { CONTENT_TYPE, TEASER_VIDEO_STATUS } from "../constants/enums";
import { useAppSelector } from "../hooks/store";
import { getRole } from "../reducers/authSlice";

const TeaserVideos = ({ shortVideo }: any) => {
  const navigate = useNavigate();
  const location=useLocation();
  const {state}=location;
  const [page, setPage] = useState<number>(1);
  const roleName = useAppSelector(getRole);
    const observerRef = useRef<any | null>(null)
    const [hasNextPage, setHasNextPage] = useState<boolean>(true)
    const [data1, setData1] = useState<any>([])
  
  const { data,isLoading,isFetching,isSuccess } = useGetContentQuery({
    setting: 1,
    contentType: shortVideo
      ? CONTENT_TYPE.SHORT_VIDEO
      : CONTENT_TYPE.TEASER_VIDEO,
    page: page,
    limit: 18,
    ...(state?.tutorId ? { tutorId: state?.tutorId } : {}),

  });

   const lastElementRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (isLoading  || isFetching ) return;
  
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
        if (isSuccess && data?.data?.data) {
          setData1((prev: any) => {
            const newData = page === 1
              ? [...data?.data?.data]
              : [...prev, ...data?.data?.data];
    
            const unique = Array.from(
              new Map(newData.map(item => [item._id, item])).values()
            );
    
            return unique;
          });
        }
        if (data?.data?.data?.length === 0) {
          setHasNextPage(false);
        }
      }, [isSuccess, data, page]);
        return (
        <>
       <div className="tsr_wp">
        <div className="gap_m">
          {data1?.length
            ? data1?.map((item: any, index: number) => {
              return (
                <div
                ref={index === data1?.length - 1 ? lastElementRef : null}
                  className="video-card"
                  onClick={() => {
                    if (item?.contentStatus !== TEASER_VIDEO_STATUS.PENDING) {
                      if (shortVideo) {
                        navigate(`/tutor/shortVideos/${item?._id}`);
                      } else {
                        navigate(
                          `/${roleName === "tutor" ? "tutor" : "parent"}/teaserVideos/${item?._id}`
                        );
                      }
                    }
                  }}
                >
                  <video
                    src={item?.images?.[0] || "/static/videos/sample.mp4"} // replace with actual video url
                    muted
                    preload="metadata"
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {item?.contentStatus == TEASER_VIDEO_STATUS.PENDING || item?.contentStatus == TEASER_VIDEO_STATUS.REJECTED ? (
                    <div className="waiting-approval">
                      <span>
                        <p>{item?.contentStatus == TEASER_VIDEO_STATUS.REJECTED ? "Video Rejected" : "Waiting for Approval"}</p>
                      </span>
                    </div>
                  ) : (
                    <div className="play-button">
                      <span>
                        <img src={`/static/images/play_icn.svg`} alt="Play" />
                      </span>
                    </div>
                  )}

                  <div className="video-details">
                    <h4>{item?.title || ""}</h4>

                    <div className="video-views">
                      <span>
                        <img
                          src={`/static/images/play_icn.svg`}
                          alt="Views"
                        />
                      </span>
                      <span>{item?.views || 0}</span>
                    </div>
                  </div>
                </div>
              );
            })
            :
            <div className=" mdl_cntnt video_content no_data">
              <figure>
                <img src="/static/images/noData.png" alt="no data found" />
              </figure>
              <p>No Video found</p>
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default TeaserVideos;
