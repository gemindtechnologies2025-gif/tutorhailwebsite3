/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useGetStudyMaterialQuery } from "../../../service/parentDashboard";
import NewSideBarParent from "../../../components/NewSideBarParent";



export default function ParentStudyMaterial() {
  const navigate = useNavigate(); // navigation hook
  const [page, setPage] = useState<number>(1);
  const observerRef = useRef<any | null>(null)
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [data1, setData1] = useState<any>([])

  //API Hooks
  const {
    data: studyMaterial,
    isLoading,
    isError,
    isSuccess,
    isFetching
  } = useGetStudyMaterialQuery({page,limit:10});


  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetching) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            setPage((prev) => prev + 1);
          }
        },
        {
          threshold: 0.5,
          rootMargin: "100px",
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetching, hasNextPage]
  );

  useEffect(() => {
    if (isSuccess && studyMaterial?.data?.material) {

      setData1((prev: any) => {
        const newData = page === 1
          ? [...studyMaterial.data.material]  // fresh load
          : [...prev, ...studyMaterial.data.material]; // append for infinite scroll

        const unique = Array.from(
          new Map(newData.map(item => [item._id, item])).values()
        );

        return unique;
      });
    }

    if (studyMaterial?.data?.material?.length === 0) {
      setHasNextPage(false);
    }
  }, [isSuccess, studyMaterial, page]);

  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">


          <section className="uh_spc pfd_wrp home_wrp">
            <div className="conta_iner v2">
              <div className="gap_m grid_2">
                <NewSideBarParent />
                <div className="pdf_inr rt_v2">
                  {data1?.length ? (
                    <Box sx={{ width: "100%" }}>
                      <ul className="cmn_crd_wp gap_m ">
                        {data1?.map((material: any, index: number) => (
                          <li key={index}>
                            <div  ref={index === data1?.length - 1 ? lastElementRef : null} className="in_row">
                              <figure>
                                <img src={`/static/images/pdf.png`} alt="pdf icon" />
                              </figure>
                              <div className="dsc">
                                <h4>{material?.title || "Untitled Material"}</h4>
                                <p>{material?.description || "Unknown Chapter"}</p>
                              </div>
                            </div>
                            <div
                              onClick={() =>
                                window.open(material?.content, "_blank", "noopener,noreferrer")
                              }
                              className="btn_full"
                            >
                              <button className="btn primary">Download</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </Box>
                  ) : (
                    <div className="no_data">
                      <figure>
                        <img src="/static/images/noData.png" alt="no data found" />
                      </figure>
                      <p>No study material available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>



        </main>
      </ParentLayout>
    </>
  );
}
