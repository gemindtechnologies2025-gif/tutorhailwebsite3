import React, { useCallback, useEffect, useRef, useState } from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import Loader from "../../../constants/Loader";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import TeaserVideos from "../../../components/TeaserVideos";
import AddVideoRgt from "../../../components/AddVideoRgt";
import { ParentLayout } from "../../../layout/parentLayout";
import NewSideBarParent from "../../../components/NewSideBarParent";
import TutorListing from "../../../components/TutorListing";
import { CONTENT_TYPE, TEASER_VIDEO_STATUS } from "../../../constants/enums";
import { useNavigate } from "react-router-dom";
import { useGetContentQuery } from "../../../service/content";
import { TextField } from "@mui/material";
import { isValidInput } from "../../../utils/validations";
import { useDebounce } from "../../../constants/useDebounce";

interface TutorTeaserVideosProps { }



const ParentShortVideosAll: React.FC<TutorTeaserVideosProps> = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [query, setQuery] = useState<string>("");
    const debounceValue = useDebounce(query, 750);
    const observerRef = useRef<any | null>(null)
    const [hasNextPage, setHasNextPage] = useState<boolean>(true)
    const [data1, setData1] = useState<any>([])
    const { data, isLoading, isFetching, isSuccess } = useGetContentQuery({
        setting: 1,
        contentType: CONTENT_TYPE.SHORT_VIDEO,
        page: page,
        limit: 12,
        ...(debounceValue ? { search: debounceValue } : {}),
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
        setPage(1);
        setData1([]);
        setHasNextPage(true);
    }, [debounceValue]);
    useEffect(() => {
        if (isSuccess && data?.data?.data) {

            setData1((prev: any) => {
                const newData = page === 1
                    ? [...data.data.data]  // fresh load
                    : [...prev, ...data.data.data]; // append for infinite scroll

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
            <ParentLayout className="role-layout">
                <Loader />
                <main className="content">
                    <section className="uh_spc  home_wrp">
                        <div className="conta_iner v2">
                            <div className="mn_fdx">
                                <NewSideBarParent />

                                <div className="mdl_cntnt slide_fliter ">
                                    <div className=" control_group d_flex">

                                        <TextField
                                            className="search-field"
                                            placeholder="search.."
                                            value={query}
                                            onChange={(e) => {
                                                if (isValidInput(e.target.value)) {
                                                    setQuery(e.target.value);
                                                }
                                            }}
                                        />

                                    </div>
                                    <div className="tsr_wp">
                                        <div className="gap_m">
                                            {data1?.length
                                                ? data1?.map((item: any, index: number) => {
                                                    return (
                                                        <div
                                                            ref={index === data1?.length - 1 ? lastElementRef : null}
                                                            className="video-card"
                                                            onClick={() => {
                                                                navigate(`/parent/videos/${item?._id}`);
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


                                                            <div className="play-button">
                                                                <span>
                                                                    <img src={`/static/images/play_icn.svg`} alt="Play" />
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
                                                })
                                                : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="sidebar_rt">
                                    <TutorListing />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </ParentLayout>
        </>
    );
};

export default ParentShortVideosAll;
