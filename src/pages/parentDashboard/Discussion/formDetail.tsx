import React, { useState } from 'react'
import { ParentLayout } from '../../../layout/parentLayout'
import NewSideBarParent from '../../../components/NewSideBarParent'
import Upvote from '../../../components/Upvote'
import { TextField } from '@mui/material'
import { useNavigate, useParams } from "react-router-dom";
import { AddFormAndDisscussion } from '../../../Modals/AddFormAndDisscussion'
import { useGetContentByIdQuery, useGetContentQuery } from '../../../service/content'
import { CONTENT_TYPE, ForumType } from '../../../constants/enums'
import { ForumTypeInterface } from '../../../types/General'
import Loader from '../../../constants/Loader'


export const MyFormDetails = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {id}=useParams();

    const { data: ForumData, isLoading } = useGetContentByIdQuery({
            id: id
        },{skip:!id});

  

    return (
        <ParentLayout className="role-layout">
            <Loader isLoad={isLoading} />
            <main className="content">
                <section className="uh_spc pSearchResult_sc home_wrp">
                    <div className="conta_iner v2">
                        <div className="mn_fdx">
                            <NewSideBarParent />
                            <div className="mdl_cntnt">
                                <Upvote data={ForumData?.data} />
                            </div>
                            <div className="sidebar_rt">
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
        </ParentLayout>
    )
}

