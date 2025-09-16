/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Congratulations = () => {

    const navigate = useNavigate();

    return (
        <main className="content">
            <section className="auth_sc profileSetup_sc">
                <div className="lt_s">
                    <a onClick={() => navigate("/")} className="site_logo">
                        <figure>
                            <img src={`/static/images/logo.png`} alt="logo" />
                        </figure>
                    </a>
                    <figure className="auth_vector2">
                        <img src={`/static/images/auth_vector2.png`} alt="Image" />
                    </figure>
                </div>
                <div className="rt_s u_spc">
                    <div className="inner success hd_3">
                        <figure>
                            <img src={`/static/images/tick_icon.svg`} alt="Image" />
                        </figure>
                        <h2><strong>Congratulations!!</strong></h2>
                        <p>Your account has been setup. Please book tutor and start learning</p>
                        <Button onClick={() => navigate('/parent/search-result')}>Start Learning</Button>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Congratulations;