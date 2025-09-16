const WhyChooseUs = () => {
    return (
        <section className="home_choose_sc u_spc">
            <div className="conta_iner">
                <div className="gap_p">
                    <div className="lt_s">
                        <figure>
                            <img src={`/static/images/whyChoose.png`} alt="img" />
                        </figure>
                    </div>
                    <div className="rt_s">
                        <p className="sub_title">WHY CHOOSE US?</p>
                        <h2>Creating A Community Of life long <mark className="high_light">learners</mark></h2>
                        <p>At TutorHail, we believe that education is a lifelong journey, not just a destination. Our mission is to create a community of lifelong learners who are empowered to continuously grow, adapt, and thrive in an ever-changing world.</p>
                        <ul>
                            <li>
                                <strong><img src={`/static/images/tick.png`} alt="img" /> Trusted By Thousands</strong>
                                TutorHail is trusted by thousands of parents, guardians, and learners for its reliable and professional tutoring services
                            </li>
                            <li>
                                <strong><img src={`/static/images/tick.png`} alt="img" /> Trusted By Thousands</strong>
                                Whether you're a parent seeking the best educational support for your child, an adult learner looking to enhance your skills.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhyChooseUs;