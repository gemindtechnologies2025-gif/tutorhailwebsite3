import { Layout } from "../../layout";
import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ParentLayout } from "../../layout/parentLayout";
import { TutorLayout } from "../../layout/tutorLayout";
import useGetCms from "../../apiHooks/getcms";
import ContentLoader from "../../components/ContentLoader";

const PrivacyPolicy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { data, loading } = useGetCms();
  const getLayout = () => {
    switch (location.pathname) {
      case "/parent/privacy-policy":
        return {
          LayoutComponent: ParentLayout,
          link: state === "loginP" ? "/auth/as-parent/login" : "/parent/search-result",
          className: "role-layout",
        };
      case "/tutor/privacy-policy":
        return {
          LayoutComponent: TutorLayout,
          link: state === "loginT" ? "/auth/as-tutor/login" : "/tutor/dashboard",
          className: "role-layout",
        };
      case "/privacy-policy":
        return {
          LayoutComponent: Layout,
          link: state === "loginT" ? "/auth/as-tutor/login" : "/auth/as-parent/login",
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
      case "/parent/privacy-policy":
        return (
          <div className="role_head">
            <button className="back_arrow" onClick={() => navigate(link)}>
              <img src={`/static/images/back.png`} alt="Back" />
            </button>
            <p>Privacy Policy</p>
          </div>
        );
      case "/tutor/privacy-policy":
        return (
          <div className="role_head">
            <button className="back_arrow" onClick={() => navigate(link)}>
              <img src={`/static/images/back.png`} alt="Back" />
            </button>
            <p>Privacy Policy</p>
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

  console.log(state, "state in privacy");

  return (
    <LayoutComponent className={className}>
      <main className="content">
        <section className="cms_sc privacy_sc uh_spc">
          <div className="conta_iner">
            {renderBackButton()}
            <div className="gap_p">
              <figure className="figure_s">
                <img src={`static/images/pp.png`} alt="img" />
              </figure>
              <div className="rt_s">
                <div className="hd_5">
                  <h1>
                    <strong>Privacy Policy</strong>
                  </h1>
                </div>
                <Box className="white_box">
                  {loading ? (
                    <ContentLoader />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data?.privacyPolicy || "",
                      }}
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

export default PrivacyPolicy;
