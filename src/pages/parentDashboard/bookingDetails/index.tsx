import React from 'react'
import { ParentLayout } from '../../../layout/parentLayout'
import SessionSummary from '../../../components/SessionSummary'
import { ProfileCard } from '../../../components/ProfileCard'
import BookingDateTime from '../../../components/BookingDateTime'
import RightBottomLinks from '../../../components/RightBottomLinks'
import NewSideBarParent from '../../../components/NewSideBarParent'

export const BookingDetails = () => {
    return (
        <>
            <ParentLayout className="role-layout" >
                <main className="content mn_booking_dtls">
                    <section className="uh_spc  home_wrp bkng_dtlss">
                        <div className="conta_iner v2">
                            <div className="mn_fdx">
                                <div className="sidebar_lt">
                                    <NewSideBarParent />
                                </div>
                                <div className="mdl_cntnt">
                                    <ProfileCard />
                                    <BookingDateTime />
                                </div>

                                <div className="sidebar_rt">
                                    <SessionSummary />
                                    <RightBottomLinks />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

            </ParentLayout>
        </>
    )
}

export default BookingDetails