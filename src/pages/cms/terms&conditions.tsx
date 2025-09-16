import { Layout } from "../../layout";
import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ParentLayout } from "../../layout/parentLayout";
import { TutorLayout } from "../../layout/tutorLayout";
import useGetCms from "../../apiHooks/getcms";
import ContentLoader from "../../components/ContentLoader";

const TermsAndConditions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { data, loading } = useGetCms();
  console.log(state, "state in terms");


  const getLayout = () => {
    switch (location.pathname) {
      case "/parent/terms-and-conditions":
        return {
          LayoutComponent: ParentLayout,
          link: state === "loginP" ? "/auth/as-parent/login" : "/parent/search-result"
          ,
          className: "role-layout",
        };
      case "/tutor/terms-and-conditions":
        return {
          LayoutComponent: TutorLayout,
          link: state === "loginT" ? "/auth/as-tutor/login" : "/tutor/dashboard",
          className: "role-layout",
        };
      case "/terms-and-conditions":
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

  console.log(state, "state in terms");


  const { LayoutComponent, link, className } = getLayout();

  const renderBackButton = () => {
    switch (location.pathname) {
      case "/parent/terms-and-conditions":
        return (
          <div className="role_head">
            <button className="back_arrow" onClick={() => navigate(link)}>
              <img src={`/static/images/back.png`} alt="Back" />
            </button>
            <p>Terms & Condition</p>
          </div>
        );
      case "/tutor/terms-and-conditions":
        return (
          <div className="role_head">
            <button className="back_arrow" onClick={() => navigate(link)}>
              <img src={`/static/images/back.png`} alt="Back" />
            </button>
            <p>Terms & Condition</p>
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
        <section className="cms_sc terms_sc uh_spc">
          <div className="conta_iner">
            {renderBackButton()}
            <div className="gap_p">
              <figure className="figure_s">
                <img src={`/static/images/pp.png`} alt="img" />
              </figure>
              <div className="rt_s">
                <div className="hd_5">
                  <h1>
                    <strong>Terms & Conditions</strong>
                  </h1>
                </div>
                <Box className="white_box">
                  {loading ? (
                    <ContentLoader />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data?.termsAndConditions || "",
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

export default TermsAndConditions;
