import React from 'react'
import { ParentLayout } from '../../../layout/parentLayout'
import NewSideBarParent from '../../../components/NewSideBarParent'

export const Calender = () => {
    return (

        <>
            <ParentLayout className="role-layout" >
                <main className="content">
                    <section className="uh_spc home_wrp calender_wrp">
                        <div className="conta_iner v2">
                            <div className="mn_fdx">
                                <NewSideBarParent />
                                <div>
                                    <figure><img src={`/static/images/calender.png`} alt="" /></figure>
                                </div>
                            </div>
                        </div>
                    </section>

                </main>



            </ParentLayout>
        </>
    )
}

export default Calender

