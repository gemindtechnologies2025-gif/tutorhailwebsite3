const Download = () => {
    return (
        <section className="home_download_sc ub_spc">
            <div className="conta_iner">
                <div className="inner">
                    <figure className="phone_img">
                        <img src={`/static/images/phones1.png`} alt="img" />
                    </figure>
                    <div className="rt_s">
                        <p className="sub_title">MORE FEATURES AWAITS YOU</p>
                        <h2><strong>Download our Application for a Better Experience</strong></h2>
                        <div className="btn_flex">
                            <button onClick={()=>window.open("https://play.google.com/store/apps/details?id=com.tutorHail")}><img src={`/static/images/googlePlay.png`} alt="img" /></button>
                            <button onClick={()=>window.open("https://apps.apple.com/in/app/tutorhail/id6736560074")}><img src={`/static/images/appStore.png`} alt="img" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Download;