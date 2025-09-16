import React, { useEffect, useState, useRef } from 'react';
import { ParentLayout } from '../../../layout/parentLayout';
import NewSideBarParent from '../../../components/NewSideBarParent';
import Feed from '../../../components/Feed';
import RightBottomLinks from '../../../components/RightBottomLinks';
import { useGetContentQuery } from '../../../service/content';
import { BOOK_FOR, CONTENT_TYPE } from '../../../constants/enums';
import ReelsParent from '../../../components/ReelVideoParent';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Loader from '../../../constants/Loader';
import TutorListing from '../../../components/TutorListing';
import { useLocation } from 'react-router-dom';

function Videos() {
    const sliderRef = useRef<any>(null);
    const [page, setPage] = useState(1);
    const [reel, setReel] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const location=useLocation();
    const {state}=location;
    const [following, setFollowing] = useState<boolean>(state?.following || false);

    // get content when page changes
    const { data: reelsData, isFetching, isLoading } = useGetContentQuery({
        page,
        contentType: CONTENT_TYPE.SHORT_VIDEO,
        limit:20,
        type: BOOK_FOR.OTHER,
        following: following
    });

    // merge new data when fetched
    useEffect(() => {
        if (reelsData?.statusCode === 200) {
            const newData = reelsData?.data?.data || [];
            if (page === 1) {
                setReel(newData);
            } else {
                setReel(prev => [...prev, ...newData]);
            }
            // if returned less than limit → no more data
            if (newData.length < 20) {
                setHasMore(false);
            }
        }
    }, [reelsData, page, following]);

    const settings = {
        vertical: true,
        verticalSwiping: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        dots: false,
        arrows: false,

        beforeChange: (_: number, next: number) => {
            if (next >= reel.length - 1 && hasMore && !isFetching) {
                setPage(prev => prev + 1);
            }
        }
    };

    const [isScrolling, setIsScrolling] = useState(false);

    const handleWheel = (e: React.WheelEvent) => {
        if (isScrolling) return;

        if (e.deltaY > 0) {
            sliderRef.current?.slickNext();
        } else if (e.deltaY < 0) {
            sliderRef.current?.slickPrev();
        }

        // lock for 500ms
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 500);
    };


    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY > 0) {
                sliderRef.current?.slickNext();
            } else if (e.deltaY < 0) {
                sliderRef.current?.slickPrev();
            }
        };
        const sliderEl = sliderRef.current?.innerSlider?.list;
        sliderEl?.addEventListener("wheel", handleWheel, { passive: true });

        return () => {
            sliderEl?.removeEventListener("wheel", handleWheel);
        };
    }, []);


    return (
        <ParentLayout className="role-layout">
            <main className="content">
                <section className="uht_spc home_wrp">
                    <div className="conta_iner v2">
                        <div className="mn_fdx">
                            <NewSideBarParent />
                            {isLoading ? <Loader isLoad={isLoading} /> : reel?.length ? (
                                <div className="mdl_cntnt video_content"
                                    onWheel={handleWheel}>
                                    {/* Slider */}
                                    <Slider {...settings} ref={sliderRef}>
                                        {reel?.map((item: any) => (
                                            <div key={item.id} className='reel_wrapper'>
                                                <ReelsParent  data={item} setFollowing={setFollowing} following={following} />
                                            </div>
                                        ))}
                                    </Slider>

                                    {/* Custom arrows */}
                                    <div className='video_arrows'>
                                        <ArrowCircleUpIcon
                                            onClick={() => sliderRef.current?.slickPrev()}
                                            style={{ fontSize: 32, cursor: 'pointer', margin: '5px' }}
                                        />
                                        <ArrowCircleDownIcon
                                            onClick={() => sliderRef.current?.slickNext()}
                                            style={{ fontSize: 32, cursor: 'pointer', margin: '5px' }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className=" mdl_cntnt video_content no_data">
                                    <figure>
                                        <img src="/static/images/noData.png" alt="no data found" />
                                    </figure>
                                    <p>No Video found</p>
                                </div>
                            )}

                            <div className="sidebar_rt">
                                <TutorListing />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </ParentLayout>
    );
}

export default Videos;
