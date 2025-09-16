import React from 'react'
import { ParentLayout } from '../../../layout/parentLayout'
import Reels from '../../../components/ReelVideo'
import Feed from '../../../components/Feed'
import RightBottomLinks from '../../../components/RightBottomLinks'
import SessionSummary from '../../../components/SessionSummary'
import { useParams } from 'react-router-dom'
import { useGetContentByIdQuery } from '../../../service/content'
import NewSideBarTutor from '../../../components/NewSideBarTutor'
import { TutorLayout } from '../../../layout/tutorLayout'
// import Reels from '../../../components/reels'


function ShortVideoDetailsTutor() {
    const { id } = useParams();
    const { data: ForumData, isLoading } = useGetContentByIdQuery({
        id: id,

    });

    console.log(ForumData?.data, 'ForumData');

    return (
        <>
            <TutorLayout className="role-layout" >
                <main className="content">
                    <section className="uh_spc  home_wrp  ">
                        <div className="conta_iner v2">
                            <div className="mn_fdx">
                                <NewSideBarTutor />
                                <div className="mdl_cntnt">
                                    <Reels data={ForumData?.data} />
                                </div>

                                <div className="sidebar_rt">
                                    <RightBottomLinks />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </TutorLayout>
        </>

    )
}

export default ShortVideoDetailsTutor
