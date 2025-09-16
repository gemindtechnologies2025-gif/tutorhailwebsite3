import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ParentLayout } from '../../../layout/parentLayout';
import NewSideBarParent from '../../../components/NewSideBarParent';
import { RecommendedClasses } from '../../../components/RecommendedClasses';
import Chatbar from '../../../components/Chatbar';
import { Button, Checkbox, FormControlLabel, Input, InputAdornment, MenuItem, Select, styled, Switch, SwitchProps, TextField, Typography } from '@mui/material';
import { TabCard } from '../../../components/TabCard';
import { CLASS_SETTING } from '../../../constants/enums';
import NewSideBarTutor from '../../../components/NewSideBarTutor';
import { TutorLayout } from '../../../layout/tutorLayout';
import { useNavigate } from 'react-router-dom';
import { useGetClassesForTutorQuery } from '../../../service/class';

function TutorClasses() {
    const [type, setType] = useState<number>(1);
    const observerRef = useRef<any | null>(null)
    const [hasNextPage, setHasNextPage] = useState<boolean>(true)
    const [data1, setData1] = useState<any>([])
    const [page, setPage] = useState<number>(1);

    const { data: classData, isLoading, isFetching, isSuccess } = useGetClassesForTutorQuery({ setting: CLASS_SETTING.PUBLISH, limit: 10, page: page, canBePrivate: type == 1 ? false : true });
    const navigate = useNavigate();


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
    }, [type]);

    useEffect(() => {
        if (isSuccess && classData?.data?.data) {

            setData1((prev: any) => {
                const newData = page === 1
                    ? [...classData.data.data]  // fresh load
                    : [...prev, ...classData.data.data]; // append for infinite scroll

                const unique = Array.from(
                    new Map(newData.map(item => [item._id, item])).values()
                );

                return unique;
            });
        }

        if (classData?.data?.data?.length === 0) {
            setHasNextPage(false);
        }
    }, [isSuccess, classData, page]);

    return (
        <>
            <TutorLayout className="role-layout">
                <main className="content">
                    <section className="uh_spc pSearchResult_sc home_wrp">
                        <div className="conta_iner v2">
                            <div className="mn_fdx">
                                <NewSideBarTutor />
                                <div className="mdl_cntnt ">
                                    <ul className='cstmm_tabs'>
                                        <TabCard onClick={() => setType(1)} name='Public Class' isActive={type == 1 ? true : false} />
                                        <TabCard onClick={() => setType(2)} name='Private Class' isActive={type == 2 ? true : false} />
                                    </ul>

                                    <div className='gap_m rec_clsss'>
                                        {data1?.length ? data1?.map((item: any,index:number) => {
                                            return (
                                                <RecommendedClasses data={item} ref={index === data1?.length - 1 ? lastElementRef : null} />
                                            )
                                        }) : (
                                            <div className=" mdl_cntnt video_content no_data">
                                                <figure>
                                                    <img src="/static/images/noData.png" alt="no data found" />
                                                </figure>
                                                <p>No Class found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="sidebar_rt">
                                    <button onClick={() => navigate("/tutor/create-class")} className='btn transparent' >Create class</button>
                                    <section className="side_menu_wrap unlock_bg ">
                                        <div className="group">
                                            <h4>Unlock Learning, Book Your Perfect Tutor Today!</h4>
                                            <button>Book Now</button>
                                        </div>
                                        <figure>
                                            <img src={`/static/images/unlock_men.png`} alt="unlock_men" />
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
        </>
    );
}

export default TutorClasses;