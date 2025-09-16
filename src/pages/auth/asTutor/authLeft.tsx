/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useNavigate } from 'react-router-dom';

const TutorAuthLeft = () => {

    const navigate = useNavigate();

    return (
        <div className="lt_s">
            <a onClick={() => navigate("/")} className="site_logo">
                <figure>
                    <img src={`/static/images/logoFooter.png`} alt="logo" />
                </figure>
            </a>
            <h1>Empower Your Teaching Journey with TutorHail</h1>
            <p>Unlock Your Potential with Top-Rated Tutors Get Personalized Home Tuition at Your Doorstep</p>
            <figure className="auth_vector3">
                <img src={`/static/images/auth_vector3.png`} alt="Image" />
            </figure>
        </div>
    )
}

export default TutorAuthLeft;