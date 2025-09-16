import { Layout } from "../../layout";
import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ParentLayout } from "../../layout/parentLayout";
import { TutorLayout } from "../../layout/tutorLayout";
import useGetCms from "../../apiHooks/getcms";
import ContentLoader from "../../components/ContentLoader";

const Eula = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { data, loading } = useGetCms();


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
      default:
        return {
          LayoutComponent: Layout,
          link: "/",
        };
    }
  };

//  console.log(state, "state in terms");


  const { LayoutComponent, link, className } = getLayout();

 

  return (
    <LayoutComponent className={className}>
      <main className="content">
        <section className="cms_sc terms_sc uh_spc">
          <div className="conta_iner">
           
            <div className="gap_p">
                <div className="hd_5" style={{textAlign:"center"}}>
                  <h1>
                    <strong>End-User License Agreement(EULA)</strong>
                  </h1>
                </div>
                <Box className="white_box">
                  {loading ? (
                    <ContentLoader />
                  ) : (
                    <div
                  
                      dangerouslySetInnerHTML={{
                        __html: data?.eula?.replaceAll('rgb(255,255,255)','none') || "",
                      }}
                    />
                  )}
                </Box>
              </div>
          </div>
        </section>
      </main>
    </LayoutComponent>
  );
};

export default Eula;
