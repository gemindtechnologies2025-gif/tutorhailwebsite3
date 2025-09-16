import { Layout } from "../../layout";
import { useLocation, useNavigate } from "react-router-dom";
import { ParentLayout } from "../../layout/parentLayout";
import { TutorLayout } from "../../layout/tutorLayout";
import useGetCms from "../../apiHooks/getcms";

const ContactUs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useGetCms();
  const getLayout = () => {
    switch (location.pathname) {
      case "/parent/contact-us":
        return {
          LayoutComponent: ParentLayout,
          link: "/parent/search-result",
          className: "role-layout",
        };
      case "/tutor/contact-us":
        return {
          LayoutComponent: TutorLayout,
          link: "/tutor/dashboard",
          className: "role-layout",
        };
      default:
        return {
          LayoutComponent: Layout,
          link: "/",
        };
    }
  };

  const { LayoutComponent, link, className } = getLayout();

  const renderBackButton = () => {
    switch (location.pathname) {
      case "/parent/contact-us":
        return (
          <div className="role_head">
            <button className="back_arrow" onClick={() => navigate(link)}>
              <img src={`/static/images/back.png`} alt="Back" />
            </button>
            <p>Contact Us</p>
          </div>
        );
      case "/tutor/contact-us":
        return (
          <div className="role_head">
            <button className="back_arrow" onClick={() => navigate(link)}>
              <img src={`/static/images/back.png`} alt="Back" />
            </button>
            <p>Contact Us</p>
          </div>
        );
      default:
        return (
          <button className="back_arrow" onClick={() => navigate(link)}>
            <img src={`/static/images/back.png`} alt="Back" />
          </button>
        );
    }
  };

  return (
    <LayoutComponent className={className}>
      <main className="content">
        <section className="cms_sc contact_sc uh_spc">
          <div className="conta_iner">
            {renderBackButton()}
            <div className="gap_p">
              <figure className="figure_s">
                <img src={`/static/images/contactGirl.png`} alt="img" />
              </figure>
              <div className="rt_s">
                <div className="hd_5">
                  <h1>
                    <strong>Contact Us</strong>
                  </h1>
                </div>
                <ul className="contact_list">
                  <li
                    onClick={() => {
                      window.open(
                        `https://wa.me/${data?.contactSupport?.dialCode.replace("+", "") + "" + data?.contactSupport?.phoneNo}?`
                      );
                    }}
                  >
                    <figure>
                      <img src={`/static/images/msgIcon.png`} alt="img" />
                    </figure>
                    <p>
                      <strong>Chat with us</strong>
                      <span>
                        For a better experience, chat from your registered
                        number
                      </span>
                    </p>
                  </li>
                  <a href={`tel:${data?.contactSupport?.dialCode + "" + data?.contactSupport?.phoneNo}`}>
                    <li style={{
                      marginBottom: "20px "
                    }}>
                      <figure>
                        <img src={`/static/images/callIcon.png`} alt="img" />
                      </figure>
                      <p>
                        <strong>Call now</strong>
                        <span>
                          For a better experience, call from your registered
                          number
                        </span>
                      </p>
                    </li>
                  </a>

                  <a href={`mailto:${data?.contactSupport?.email}`}>
                    <li>
                      <figure>
                        <img src={`/static/images/notesIcon.png`} alt="img" />
                      </figure>
                      <p>
                        <strong>Write to us</strong>
                        <span>Average response time 24-28 hrs</span>
                      </p>
                    </li>
                  </a>
                </ul>
                <div className="address_contactus" >
                  <figure style={{ width:"50px"}}>
                    <img src="/static/images/green-house.png" alt="img" />
                  </figure>
                  <div className="address_contactus_1">
                    <strong>Address</strong>
                    <span>Plot 1190, Block 217, Kampala, Uganda,0000</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </LayoutComponent>
  );
};

export default ContactUs;
