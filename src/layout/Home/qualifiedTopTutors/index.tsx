import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetAllTypeTutorQuery } from "../../../service/parentDashboard";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TutorsCard from "../../../components/TutorsCard";
import { TUTOR_TYPE } from "../../../constants/enums";

const QualifiedTutors = () => {


    const {data} = useGetAllTypeTutorQuery({page:1,limit:10,type:TUTOR_TYPE.POPULAR,body:{}});
    const navigate = useNavigate();

    console.log(data?.data?.data,'data');
    

    

    return (
        <section className="home_tutor_sc ub_spc">
            <div className="conta_iner home_sc_slider">
                <div className="s_head text_center">
                    <h2>Choose Your Home Tutor from 20,000+ <br /> <mark className="high_light">Qualified Tutors</mark></h2>
                </div>
                <Slider
                    className="tutor_slider"
                    loop={false}
                    infinite={false}
                    slidesToShow={4}
                    slidesToScroll={1}
                    arrows={true}
                    dots={false}
                    responsive={[
                    
                        {
                            breakpoint: 1199,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1,
                            },
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                            },
                        },
                        {
                            breakpoint: 575,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                centerMode: true,
                                centerPadding: "40px"
                            },
                        },
                    ]}
                >
                    {data?.data?.data?.length
                        ? [...data?.data?.data].slice(0, 6).map((item, index) => (
                            <div key={index}>
                                <TutorsCard item={item} />
                            </div>

                        ))
                        : undefined}
                    {data?.data?.data?.length > 6 ? (
                        <div >
                            <div className="see_all">
                                <Box onClick={() => navigate('/parent/popular-tutor')} component="a">See All <ArrowForwardIosIcon /></Box>
                            </div>
                        </div>
                    ) : ("")}

                </Slider>
            </div >
        </section >
    )
}

export default QualifiedTutors;