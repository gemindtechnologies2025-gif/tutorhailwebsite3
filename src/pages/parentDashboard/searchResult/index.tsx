/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useRef, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import { useNavigate } from "react-router-dom";
import {
  ForumTypeInterface,
  TutorDetails,
} from "../../../types/General";
import {
  Drawer,
} from "@mui/material";
import {
  useGetAllTypeTutorQuery,
  useGetPopularTutorQuery,
} from "../../../service/parentDashboard";
import LocationDrawer from "../common/locationDrawer";
import TutorListing from "../../../components/TutorListing";
import Upvote from "../../../components/Upvote";
import TutorsCard from "../../../components/TutorsCard";
import {
  useGetContentQuery,
} from "../../../service/content";
import { CONTENT_TYPE, ForumType, TUTOR_TYPE } from "../../../constants/enums";
import Loader from "../../../constants/Loader";
import NewSideBarParent from "../../../components/NewSideBarParent";


export default function ParentSearchResult() {
  const navigate = useNavigate(); // hook for the navigation
  const [open, setOpen] = React.useState(false); // state to handle open for the track location
  const [debounce, setDebounce] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  console.log(debounce, 'search');

  const { data, isLoading: searchLoading, refetch } = useGetAllTypeTutorQuery({
    page: 1,
    limit: 100,
    type: TUTOR_TYPE.RECOMMENDED,
    body: { search: debounce }
  }, { skip: !debounce });
  
  const { data: ForumData, isLoading } = useGetContentQuery({
    type: ForumType.OTHERS,
    contentType: CONTENT_TYPE.FORUM,
    page: 1,
    limit: 2,
  });
  const { data: teaserVideos, isLoading: teaserLoading } = useGetContentQuery({
    type: ForumType.OTHERS,
    contentType: CONTENT_TYPE.TEASER_VIDEO,
    page: 1,
    limit: 2,
  });

  const {
    data: tutorData,
    isSuccess,
    error,
    isLoading: tutorLoading,
  } = useGetPopularTutorQuery({ limit: 4 }); // api hook for the popular and recommended tutor
  const [popularTutor, setPopularTutor] = useState<TutorDetails[]>([]); // state to store the data of the popular tutor
  const [recommended, setRecommended] = useState<TutorDetails[]>([]);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };


  useEffect(() => {
    if (isSuccess) {
      setPopularTutor(tutorData?.data?.tutor?.slice(0, 6));
      setRecommended(tutorData?.data?.recomended?.slice(0, 6));
    }
  }, [isSuccess, tutorData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounce(search);
    }, 1500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  if (isLoading) {
    return <Loader isLoad={isLoading} />;
  }

  return (
    <>
      <ParentLayout className="role-layout" search={search} setSearch={setSearch}>
        <main className="content">
          <section className="uh_spc pSearchResult_sc home_wrp parent_home">
            <div className="conta_iner v2">
              <div className="mn_fdx">
                <NewSideBarParent />
                {search ? (
                  <div className="mdl_cntnt">
                    <p
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        color: "black",
                      }}
                    >
                      Search results
                    </p>
                    <div className="gap_m ">
                      {data?.data?.data?.length
                        ? data?.data?.data
                          ?.map((item: any, index: number) => {
                            return <TutorsCard item={item} />;
                          })
                        : (
                          <div className=" mdl_cntnt video_content no_data">
                            <figure>
                              <img src="/static/images/noData.png" alt="no data found" />
                            </figure>
                            <p>No result found</p>
                          </div>
                        )}
                    </div>

                  </div>
                ) : (
                  
                  <div className="mdl_cntnt">
                    {ForumData?.data?.data?.map(
                      (item: ForumTypeInterface, i: number) => (
                        <Upvote key={i} data={item} />
                      )
                    )}

                    <div
                      onClick={() => navigate("/parent/formdiscussion")}
                      className="see"
                    >
                      {ForumData?.data?.data?.length ? (

                        <p>See All</p>
                      ) : null}
                    </div>
                    <p
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        color: "black",
                      }}
                    >
                      Recommended tutors
                    </p>
                    <div className="gap_m ">
                      {recommended?.length
                        ? recommended
                          ?.slice(0, 2)
                          ?.map((item: any, index: number) => {
                            return <TutorsCard item={item} />;
                          })
                        : null}
                    </div>
                    <div
                      onClick={() => navigate("/parent/recomended-tutor")}
                      className="see"
                    >
                      {recommended?.length ? (

                        <p>See All</p>
                      ) : null}
                    </div>

                    <div className="frst_cls ">
                      <div className="inner">
                        <h2>Try Your First Class – Totally Free!</h2>
                        <p>No commitment. Just come and learn.</p>
                        <button onClick={()=>navigate('/parent/classes')} className="btn primary">Avail Now</button>
                      </div>
                    </div>

                    {/* tutor  */}
                    <div className="gap_m uh_spc">
                      <p
                        style={{
                          fontSize: "24px",
                          fontWeight: "600",
                          color: "black",
                          marginTop: "20px",
                          marginBottom: "-10px",
                        }}
                      >
                        Popular tutors
                      </p>
                      {popularTutor?.length
                        ? popularTutor
                          ?.slice(0, 2)
                          ?.map((item: any, index: number) => {
                            return <TutorsCard item={item} />;
                          })
                        : null}
                    </div>
                    <div
                      onClick={() => navigate("/parent/popular-tutor")}
                      className="see"
                    >
                      {popularTutor?.length ? (

                        <p>See All</p>
                      ) : null}
                    </div>
                    <p
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        color: "black",
                      }}
                    >
                      Explore Visual Learning
                    </p>
                    <div className="tsr_wp">
                      <div className="gap_m">
                        {teaserVideos?.data?.data?.length
                          ? teaserVideos?.data?.data?.map(
                            (item: any, index: number) => {
                              return (
                                <div onClick={() => navigate(`/parent/teaserVideos/${item?._id}`)} className="video-card">
                                  <video
                                    src={
                                      item?.images?.[0] ||
                                      "/static/videos/sample.mp4"
                                    } // replace with actual video url
                                    muted
                                    preload="metadata"
                                    playsInline
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />

                                  <div className="play-button">
                                    <span>
                                      <img
                                        src={`/static/images/play_icn.svg`}
                                        alt="Play"
                                      />
                                    </span>
                                  </div>

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
                            }
                          )
                          : null}
                      </div>
                    </div>
                    {teaserVideos?.data?.data?.length ? (
                      <div
                        onClick={() => navigate("/parent/teaserVideos")}
                        className="see"
                      >
                        <p>See All</p>
                      </div>
                    ) : null}
                  </div>
                )}
                <div className="res_flexbox">
                  <div className="mdl_cntnt">
                    {ForumData?.data?.data?.map(
                      (item: ForumTypeInterface, i: number) => (
                        <Upvote key={i} data={item} />
                      )
                    )}

                    <div
                      onClick={() => navigate("/parent/formdiscussion")}
                      className="see"
                    >
                      {ForumData?.data?.data?.length ? (

                        <p>See All</p>
                      ) : null}
                    </div>
                    <p
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        color: "black",
                      }}
                    >
                      Recommended tutors
                    </p>
                    <div className="gap_m ">
                      {recommended?.length
                        ? recommended
                          ?.slice(0, 2)
                          ?.map((item: any, index: number) => {
                            return <TutorsCard item={item} />;
                          })
                        : null}
                    </div>
                    <div
                      onClick={() => navigate("/parent/recomended-tutor")}
                      className="see"
                    >
                      {recommended?.length ? (

                        <p>See All</p>
                      ) : null}
                    </div>

                    <div className="frst_cls ">
                      <div className="inner">
                        <h2>Try Your First Class – Totally Free!</h2>
                        <p>No commitment. Just come and learn.</p>
                        <button onClick={()=>navigate('/parent/classes')} className="btn primary">Avail Now</button>
                      </div>
                    </div>

                    {/* tutor  */}
                    <div className="gap_m uh_spc">
                      <p
                        style={{
                          fontSize: "24px",
                          fontWeight: "600",
                          color: "black",
                          marginTop: "20px",
                          marginBottom: "-10px",
                        }}
                      >
                        Popular tutors
                      </p>
                      {popularTutor?.length
                        ? popularTutor
                          ?.slice(0, 2)
                          ?.map((item: any, index: number) => {
                            return <TutorsCard item={item} />;
                          })
                        : null}
                    </div>
                    <div
                      onClick={() => navigate("/parent/popular-tutor")}
                      className="see"
                    >
                      {popularTutor?.length ? (

                        <p>See All</p>
                      ) : null}
                    </div>
                    <p
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        color: "black",
                      }}
                    >
                      Explore Visual Learning
                    </p>
                    <div className="tsr_wp">
                      <div className="gap_m">
                        {teaserVideos?.data?.data?.length
                          ? teaserVideos?.data?.data?.map(
                            (item: any, index: number) => {
                              return (
                                <div onClick={() => navigate(`/parent/teaserVideos/${item?._id}`)} className="video-card">
                                  <video
                                    src={
                                      item?.images?.[0] ||
                                      "/static/videos/sample.mp4"
                                    } // replace with actual video url
                                    muted
                                    preload="metadata"
                                    playsInline
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />

                                  <div className="play-button">
                                    <span>
                                      <img
                                        src={`/static/images/play_icn.svg`}
                                        alt="Play"
                                      />
                                    </span>
                                  </div>

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
                            }
                          )
                          : null}
                      </div>
                    </div>
                    {teaserVideos?.data?.data?.length ? (
                      <div
                        onClick={() => navigate("/parent/teaserVideos")}
                        className="see"
                      >
                        <p>See All</p>
                      </div>
                    ) : null}
                  </div>
                   <div className="sidebar_rt">
                  {recommended?.length ? (
                    <TutorListing recommended={recommended} />
                  ) : null}
                </div>
                </div>

                <div className="sidebar_rt">
                  {recommended?.length ? (
                    <TutorListing recommended={recommended} />
                  ) : null}
                </div>
              </div>

            </div>
          </section>
        </main>
        <Drawer
          className="location_aside"
          anchor="right"
          open={open}
          onClose={toggleDrawer(false)}
        >
          <LocationDrawer toggleDrawer={toggleDrawer} />
        </Drawer>
      </ParentLayout>
    </>
  );
}
