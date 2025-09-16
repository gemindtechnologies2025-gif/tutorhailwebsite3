import { Layout } from "../../layout";
import { useLocation, useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import React from "react";
import { ParentLayout } from "../../layout/parentLayout";
import { TutorLayout } from "../../layout/tutorLayout";
import useGetCms from "../../apiHooks/getcms";
import { Skeleton } from "@mui/material";

const Faq = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, loading } = useGetCms();
  const getLayout = () => {
    switch (location.pathname) {
      case "/parent/faq":
        return {
          LayoutComponent: ParentLayout,
          link: "/parent/search-result",
          className: "role-layout",
        };
      case "/tutor/faq":
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
      case "/parent/faq":
        return (
          <div className="role_head">
            <button className="back_arrow" onClick={() => navigate(link)}>
              <img src={`/static/images/back.png`} alt="Back" />
            </button>
            <p>FAQ</p>
          </div>
        );
      case "/tutor/faq":
        return (
          <div className="role_head">
            <button className="back_arrow" onClick={() => navigate(link)}>
              <img src={`/static/images/back.png`} alt="Back" />
            </button>
            <p>FAQ</p>
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

  const [expanded, setExpanded] = React.useState<string | false>(
    data?.faq[0]?._id || ""
  );
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <LayoutComponent className={className}>
      <main className="content">
        <section className="cms_sc faq_sc uh_spc">
          <div className="conta_iner">
            {renderBackButton()}
            <div className="gap_p">
              <figure className="figure_s">
                <img src={`/static/images/faqGirl.png`} alt="img" />
              </figure>
              <div className="rt_s">
                <div className="hd_5">
                  <h1>
                    <strong>FAQ</strong>
                  </h1>
                </div>
                <div className="accordion gap_m">
                  {loading
                    ? Array.from(new Array(8)).map((item, index) => (
                        <Skeleton
                          variant="rounded"
                          width={300}
                          height={100}
                          animation="wave"
                        />
                      ))
                    : data?.faq?.map((item, index) => (
                        <Accordion
                          key={item?._id}
                          defaultExpanded
                          expanded={expanded === item?._id}
                          onChange={handleChange(item?._id)}
                        >
                          <AccordionSummary
                            expandIcon={
                              expanded === item?._id ? (
                                <RemoveIcon />
                              ) : (
                                <AddIcon />
                              )
                            }
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            {item?.question || ""}
                          </AccordionSummary>
                          <AccordionDetails>
                            {item?.answer || ""}
                          </AccordionDetails>
                        </Accordion>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </LayoutComponent>
  );
};

export default Faq;
