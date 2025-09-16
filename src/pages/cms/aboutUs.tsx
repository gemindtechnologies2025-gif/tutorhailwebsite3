import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ParentLayout } from "../../layout/parentLayout";
import { Layout } from "../../layout";
import { TutorLayout } from "../../layout/tutorLayout";
import useGetCms from "../../apiHooks/getcms";
import { store } from "../../app/store";
import ContentLoader from "../../components/ContentLoader";

const AboutUs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, loading } = useGetCms();

  const getLayout = () => {
    switch (location.pathname) {
      case "/parent/about-us":
        return {
          LayoutComponent: ParentLayout,
          link: "/parent/search-result",
          className: "role-layout",
        };
      case "/tutor/about-us":
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
      case "/parent/about-us":
        return (
          <div className="role_head">
            <button className="back_arrow" onClick={() => navigate(link)}>
              <img src={`/static/images/back.png`} alt="Back" />
            </button>
            <p>About Us</p>
          </div>
        );
      case "/tutor/about-us":
        return (
          <div className="role_head">
            <button className="back_arrow" onClick={() => navigate(link)}>
              <img src={`/static/images/back.png`} alt="Back" />
            </button>
            <p>About Us</p>
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
        <section className="cms_sc about_sc uh_spc">
          <div className="conta_iner">
            {renderBackButton()}
            <div className="gap_p">
              <figure className="figure_s">
                <img src={`/static/images/aboutGirl.png`} alt="img" />
              </figure>
              <div className="rt_s">
                <div className="hd_5">
                  <h1>
                    <strong>About Us</strong>
                  </h1>
                </div>

                <Box className="white_box">
                  {loading ? (
                    <ContentLoader />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{ __html: data?.aboutUs || "" }}
                    />
                  )}
                </Box>
              </div>
            </div>
          </div>
        </section>
      </main>
    </LayoutComponent>
  );
};

export default AboutUs;
