import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

const Testimonials = () => {

    const [value, setValue] = React.useState<number | null>(4);

    const [activeIndex, setActiveIndex] = useState(0);
    const [nav1, setNav1] = useState<any | null>(null);
    const [nav2, setNav2] = useState<any | null>(null);
    const sliderRef1 = useRef<any | null>(null);
    const sliderRef2 = useRef<any | null>(null);
    useEffect(() => {
        setNav1(sliderRef1.current);
        setNav2(sliderRef2.current);
    }, []);
    const handleAfterChange = (index: number) => {
        setActiveIndex(index);
        nav2.slickGoTo(index);
    };

    return (
        <section className="home_testi_sc u_spc">
            <div className="conta_iner">
                <div className="s_head text_center">
                    <p className="sub_title">TESTIMONIALS</p>
                    <h2>What Our <mark className="high_light">Students Say</mark> About Us</h2>
                </div>
                <Slider
                    className="testiThumb_slider"
                    asNavFor={nav1}
                    ref={(slider: any) => (sliderRef2.current = slider)}
                    infinite={true}
                    slidesToShow={3}
                    slidesToScroll={1}
                    arrows={false}
                    dots={false}
                    swipe={false}
                    draggable={false}
                    responsive={[
                        {
                            breakpoint: 575,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                            },
                        },
                    ]}
                >
                    <figure className="testiThumb_single">
                        <img src={`/static/images/review1.png`} alt="img" />
                    </figure>
                    <figure className="testiThumb_single">
                        <img src={`/static/images/review2.png`} alt="img" />
                    </figure>
                    <figure className="testiThumb_single">
                        <img src={`/static/images/review3.png`} alt="img" />
                    </figure>
                </Slider>
                <Slider
                    className="testi_slider"
                    asNavFor={nav2}
                    afterChange={handleAfterChange}
                    ref={(slider: any) => (sliderRef1.current = slider)}
                    infinite={true}
                    slidesToShow={1}
                    slidesToScroll={1}
                    arrows={false}
                    dots={true}
                    swipe={false}
                    draggable={false}
                >
                    <div className="testi_single hd_4">
                        <h2>Sarah Stark</h2>
                        <Rating name="read-only" value={value} readOnly emptyIcon={<StarIcon />} />
                        <div className="testi_info">
                            <p>"Working with Catherine has been an absolute game-changer for my academic journey. Her deep knowledge of the subject, combined with her patient and engaging teaching style, has made even the most challenging concepts easy to understand. I went from struggling with my grades to excelling beyond my expectations.</p>
                        </div>
                    </div>
                    <div className="testi_single hd_4">
                        <h2>Joseph Philip</h2>
                        <Rating name="read-only" value={value} readOnly emptyIcon={<StarIcon />} />
                        <div className="testi_info">
                            <p>"Working with Catherine has been an absolute game-changer for my academic journey. Her deep knowledge of the subject, combined with her patient and engaging teaching style, has made even the most challenging concepts easy to understand. I went from struggling with my grades to excelling beyond my expectations.</p>
                        </div>
                    </div>
                    <div className="testi_single hd_4">
                        <h2>Anglena</h2>
                        <Rating name="read-only" value={value} readOnly emptyIcon={<StarIcon />} />
                        <div className="testi_info">
                            <p>"Working with Catherine has been an absolute game-changer for my academic journey. Her deep knowledge of the subject, combined with her patient and engaging teaching style, has made even the most challenging concepts easy to understand. I went from struggling with my grades to excelling beyond my expectations.</p>
                        </div>
                    </div>
                </Slider>
            </div>
        </section>
    )
}

export default Testimonials;