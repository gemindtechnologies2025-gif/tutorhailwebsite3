import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ParentLayout } from '../../../layout/parentLayout'
import NewSideBarParent from '../../../components/NewSideBarParent'
import TutorListing from '../../../components/TutorListing'
import { useNavigate } from 'react-router-dom';
import { useGetPairingQuery } from '../../../service/booking';
import moment from 'moment';

function PairingCode() {

    const navigate = useNavigate();
    const observerRef = useRef<any | null>(null)

    // states
    const [page, setPage] = useState<number>(1);
    const [hasNextPage, setHasNextPage] = useState<boolean>(true)
    const [data1, setData1] = useState<any>([])


    const {
        data: response,
        isError,
        isLoading,
        isSuccess,
        isFetching
    } = useGetPairingQuery({ page: page, bookingStatus: 2, limit: 12 }); // API Hook to fetch the pairing details




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
        if (isSuccess && response?.data?.booking) {

            setData1((prev: any) => {
                const newData = page === 1
                    ? [...response?.data.booking]  // fresh load
                    : [...prev, ...response.data.booking]; // append for infinite scroll

                const unique = Array.from(
                    new Map(newData.map(item => [item._id, item])).values()
                );

                return unique;
            });
        }

        if (response?.data?.booking?.length === 0) {
            setHasNextPage(false);
        }
    }, [isSuccess, response, page]);
    return (
        <>
            <ParentLayout className="role-layout">
                <main className="content">
                    <section className="uh_spc  home_wrp">
                        <div className="conta_iner v2">
                            <div className="mn_fdx">
                                <NewSideBarParent />
                                <div className="mdl_cntnt">
                                    {isSuccess && data1?.length
                                        ? data1?.map((item: any, index: number) => (
                                            <div ref={index === data1?.length - 1 ? lastElementRef : null} className='bkng_mn_code'>
                                                <h4>Your Booking Code <span>  {item?.bookingdetails?.[0]?.otp?.otp || ""}</span></h4>
                                                <div className='mn_white'>
                                                    <div className='inner'>
                                                        <figure><img src={item?.tutors?.image || `/static/images/userNew.png`} alt="" /></figure>
                                                        <div className='dtls'>
                                                            <h5>{item?.tutors?.name || ""}</h5>
                                                            <p> {moment(
                                                                item?.bookingdetails[0]?.startTime
                                                            ).format("D MMMM,YY HH:mm a")}</p>
                                                            <pre>{item?.subjects[0]?.name || ""}</pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        : (
                                            <div className="no_data">
                                                <figure>
                                                    <img src="/static/images/noData.png" alt="no data found" />
                                                </figure>
                                                <p>No Pairing found</p>
                                            </div>
                                        )}
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

    )
}

export default PairingCode;