import React, { useCallback, useEffect, useRef, useState } from "react";
import Upvote from "../../../components/Upvote";
import { useGetContentQuery } from "../../../service/content";
import {
    CONTENT_TYPE,
    ForumType,
    TYPE_SUBJECT_LISTING,
} from "../../../constants/enums";
import { ForumTypeInterface } from "../../../types/General";
import Loader from "../../../constants/Loader";
import { TutorLayout } from "../../../layout/tutorLayout";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import useAuth from "../../../hooks/useAuth";
import { TextField } from "@mui/material";
type Filter = {
    subject: string;
    category: string;
    search: string;
};

export const TutorPosts = () => {
    const user = useAuth();
    const [page, setPage] = useState<number>(1);
    const [filters, setFilters] = useState<Filter>({
        subject: "",
        category: "",
        search: "",
    });
    const [debounce, setDebounce] = useState<string>("");
    const observerRef = useRef<any | null>(null)
    const [hasNextPage, setHasNextPage] = useState<boolean>(true)
    const [data1, setData1] = useState<any>([])

    const { data: ForumData, isLoading, isFetching, isSuccess } = useGetContentQuery({
        type: ForumType.OTHERS,
        contentType: CONTENT_TYPE.POST,
        page: page,
        limit: 10,
        ...(debounce ? { search: debounce } : {}),
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
        if (isSuccess && ForumData?.data?.data) {

            setData1((prev: any) => {
                const newData = page === 1
                    ? [...ForumData.data.data]  // fresh load
                    : [...prev, ...ForumData.data.data]; // append for infinite scroll

                const unique = Array.from(
                    new Map(newData.map(item => [item._id, item])).values()
                );

                return unique;
            });
        }

        if (ForumData?.data?.data?.length === 0) {
            setHasNextPage(false);
        }
    }, [isSuccess, ForumData, page]);

    useEffect(() => {
        setPage(1);
        setData1([]);
        setHasNextPage(true);
    }, [debounce]);

    useEffect(() => {
        const delay = 1500; // Debounce delay in milliseconds
        const timerId = setTimeout(() => {
            setDebounce(filters.search);
        }, delay);
        return () => {
            clearTimeout(timerId); // Clear the timeout on cleanup
        };
    }, [filters.search]);

    return (
        <TutorLayout className="role-layout">
            <Loader isLoad={isLoading} />
            <main className="content">
                <section className="uh_spc pSearchResult_sc home_wrp">
                    <div className="conta_iner v2">
                        <div className="mn_fdx">
                            <NewSideBarTutor />
                            <div className="mdl_cntnt">
                                <div className="thoughts">
                                    <div className="th_row">
                                        <figure>
                                            <img
                                                src={user?.image || `/static/images/user.png`}
                                                alt="amelia"
                                            />
                                        </figure>
                                        <div className="input_group">
                                            <TextField
                                                hiddenLabel
                                                placeholder="Got a question or something to share ?"
                                                variant="filled"
                                                value={filters.search}
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        search: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>



                                    </div>
                                </div>


                                {data1?.map(
                                    (item: ForumTypeInterface, i: number) => (
                                        <Upvote key={i} data={item} ref={i === data1?.length - 1 ? lastElementRef : null} />
                                    )
                                )}
                            </div>
                            <div className="sidebar_rt">
                                <section className="side_menu_wrap unlock_bg ">
                                    <div className="group">
                                        <h4>Unlock Learning, Book Your Perfect Tutor Today!</h4>
                                        <button>Book Now</button>
                                    </div>
                                    <figure>
                                        <img
                                            src={`/static/images/unlock_men.png`}
                                            alt="unlock_men"
                                        />
                                    </figure>
                                </section>
                                <section className="side_menu_wrap  page_link">
                                    <ul>
                                        <li>
                                            <a>About Us</a>
                                        </li>
                                        <li>
                                            <a>Contact Us</a>
                                        </li>
                                        <li>
                                            <a>Help Center</a>
                                        </li>
                                        <li>
                                            <a>Terms & conditions</a>
                                        </li>
                                        <li>
                                            <a>Privacy Policy</a>
                                        </li>
                                        <li>
                                            <a>FAQ’s</a>
                                        </li>
                                    </ul>
                                </section>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </TutorLayout>
    );
};
