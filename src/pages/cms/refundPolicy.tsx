import { Layout } from "../../layout";
import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ParentLayout } from "../../layout/parentLayout";
import { TutorLayout } from "../../layout/tutorLayout";
import useGetCms from "../../apiHooks/getcms";
import ContentLoader from "../../components/ContentLoader";

const RefundPolicy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { data, loading } = useGetCms();


  const getLayout = () => {
    switch (location.pathname) {
      case "/parent/refund-policy":
        return {
          LayoutComponent: ParentLayout,
          link: state === "loginP" ? "/auth/as-parent/login" : "/parent/search-result"
          ,
          className: "role-layout",
        };
      case "/tutor/refund-policy":
        return {
          LayoutComponent: TutorLayout,
          link: state === "loginT" ? "/auth/as-tutor/login" : "/tutor/dashboard",
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
      case "/refund-policy":
        return (
          <div className="role_head">
            <button className="back_arrow" onClick={() => navigate(link)}>
              <img src={`/static/images/back.png`} alt="Back" />
            </button>
            <p>Refund Policy</p>
          </div>
        );
      case "/tutor/refund-policy":
        return (
          <div className="role_head">
            <button className="back_arrow" onClick={() => navigate(link)}>
              <img src={`/static/images/back.png`} alt="Back" />
            </button>
            <p>Refund Policy</p>
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
                    <strong>Refund Policy</strong>
                  </h1>
                </div>
                <Box className="white_box">
                  {loading ? (
                    <ContentLoader />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data?.refundPolicy || "",
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

export default RefundPolicy;
