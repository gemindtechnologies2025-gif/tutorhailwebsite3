import { ParentLayout } from "../../../layout/parentLayout";
import NewSideBarParent from "../../../components/NewSideBarParent";
import { RecommendedClasses } from "../../../components/RecommendedClasses";
import {
    CLASS_LIST_TYPE,
} from "../../../constants/enums";
import { useGetClassesForParentQuery } from "../../../service/class";
import TutorListing from "../../../components/TutorListing";
import Loader from "../../../constants/Loader";
import FreeClasses from "../../../components/FreeClasses";
import { useNavigate } from "react-router-dom";

function ClassPageParent() {

    const navigate = useNavigate();
    const { data: classData, isLoading } = useGetClassesForParentQuery({
        type: CLASS_LIST_TYPE.RECOMMENDED,
        page: 1,
        limit: 2,
    });

    const { data: classDataPopular } = useGetClassesForParentQuery({
        type: CLASS_LIST_TYPE.POPULAR,
        page: 1,
        limit: 2,
    });


    const { data: classDataFree } = useGetClassesForParentQuery({
        isFreeLesson: true,
        page: 1,
        limit: 10,
    });



    return (
        <>
            <ParentLayout className="role-layout">
                <Loader isLoad={isLoading} />
                <main className="content">
                    <section className="uh_spc pSearchResult_sc home_wrp">
                        <div className="conta_iner v2">
                            <div className="mn_fdx">
                                <NewSideBarParent />
                                <div className="mdl_cntnt slide_fliter">
                                    {classData?.data?.data?.length ?
                                        <div className="gap_m rec_clsss">
                                            <div className="class_head_div">
                                                <p className="class_head">Recomended Classes</p>
                                                <p onClick={()=>navigate('/parent/recommendedClasses')} className="class_head_see">See all</p>
                                            </div>
                                            {classData?.data?.data?.map((item: any, index: number) => {
                                                return <RecommendedClasses data={item} />;
                                            })}
                                        </div>
                                        : null}

                                    {classDataPopular?.data?.data?.length ?
                                        <div className="gap_m rec_clsss" style={{ marginTop: "10px" }}>
                                            <div className="class_head_div">
                                                <p className="class_head">Popular Classes</p>
                                                <p  onClick={()=>navigate('/parent/popularClasses')}  className="class_head_see">See all</p>
                                            </div>
                                            {classDataPopular?.data?.data?.map((item: any, index: number) => {
                                                return <RecommendedClasses data={item} />;
                                            })}
                                        </div>
                                        : null}

                                    {classDataFree?.data?.data?.length ?
                                        <div className="gap_m rec_clsss" style={{ marginTop: "10px" }}>
                                            <div className="class_head_div">
                                                <p className="class_head">Free Classes</p>
                                                <p onClick={()=>navigate('/parent/freeClasses')} className="class_head_see">See all</p>
                                            </div>
                                            <div className="free_classes">
                                                <div className="cards_row">
                                                    {classDataFree?.data?.data?.map((item: any, index: number) => {
                                                        return <FreeClasses data={item} />;
                                                    })}
                                                </div></div>
                                        </div>
                                        : null}

                                    {classData?.data?.data?.length === 0 && classDataPopular?.data?.data?.length === 0 && classDataFree?.data?.data?.length === 0 ? (
                                        <div className="gap_m rec_clsss">

                                            <div className=" mdl_cntnt video_content no_data">
                                                <figure>
                                                    <img src="/static/images/noData.png" alt="no data found" />
                                                </figure>
                                                <p>No Class found</p>
                                            </div>

                                        </div>
                                    ) : null}



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
}

export default ClassPageParent;
