import React, { useEffect, useState, useRef } from 'react';
import { ParentLayout } from '../../../layout/parentLayout';
import NewSideBarParent from '../../../components/NewSideBarParent';
import Feed from '../../../components/Feed';
import RightBottomLinks from '../../../components/RightBottomLinks';
import { useGetContentByIdQuery, useGetContentQuery } from '../../../service/content';
import { CONTENT_TYPE } from '../../../constants/enums';
import ReelsParent from '../../../components/ReelVideoParent';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Loader from '../../../constants/Loader';
import { useParams } from 'react-router-dom';

function VideosDetails() {
    const sliderRef = useRef<any>(null);
    
    const {id}=useParams();

 
     const { data: ForumData, isLoading } = useGetContentByIdQuery({
       id: id,
     });

     
   

    const settings = {
        vertical: true,
        verticalSwiping: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        dots: false,
        arrows: false,
       
    };

    return (
        <ParentLayout className="role-layout">
            <Loader isLoad={isLoading}/>

            <main className="content">
                <section className="uht_spc home_wrp">
                    <div className="conta_iner v2">
                        <div className="mn_fdx">
                            <NewSideBarParent />
                            <div className="mdl_cntnt video_content">
                                {/* Slider */}
                                <Slider {...settings} ref={sliderRef}>
                                   
                                        <div>
                                            <ReelsParent single={true} data={ForumData?.data} />
                                        </div>
                                  
                                </Slider>

                             
                            </div>

                            <div className="sidebar_rt">
                                <RightBottomLinks />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </ParentLayout>
    );
}

export default VideosDetails;
