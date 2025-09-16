const SkillsTutors = () => {

    return (
        <section className="home_skills_sc ut_spc">
            <div className="conta_iner">
                <div className="s_head text_center">
                    <h2>Unlock New Skills And Learn Every Day <br /> With  A <mark className="high_light">Top Tutor</mark> By Your side</h2>
                </div>
                <ul className="img_flex">
                    <li><figure><img src={`/static/images/top1.png`} alt="img" /></figure></li>
                    <li><figure><img src={`/static/images/top2.png`} alt="img" /></figure></li>
                    <li><figure><img src={`/static/images/top3.png`} alt="img" /></figure></li>
                </ul>
                <ul className="content_flex">
                    <li>
                        <strong>90%</strong>
                        <span>of our students see their Learning journey made better by a passionate tutor from TutorHail.</span>
                    </li>
                    <li>
                        <strong>9/10</strong>
                        <span>of our guardians or users reported better learning outcomes from a tutor got from TutorHail.</span>
                    </li>
                </ul>
            </div>
        </section>
    )
}

export default SkillsTutors;