import React, { useCallback, useEffect, useRef, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import NewSideBarParent from "../../../components/NewSideBarParent";
import Upvote from "../../../components/Upvote";
import { MenuItem, Select, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AddFormAndDisscussion } from "../../../Modals/AddFormAndDisscussion";
import { useGetContentQuery } from "../../../service/content";
import {
  CONTENT_TYPE,
  ForumType,
  TYPE_SUBJECT_LISTING,
} from "../../../constants/enums";
import { ForumTypeInterface } from "../../../types/General";
import Loader from "../../../constants/Loader";
import { TutorLayout } from "../../../layout/tutorLayout";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import { AddPromoCodeModal } from "../../../Modals/AddPromoModal";
import useAuth from "../../../hooks/useAuth";
import { useLazyGetSubjectsAndCategoryQuery } from "../../../service/auth";
import { useDebounce } from "../../../constants/useDebounce";

type Filter = {
  subject: string;
  category: string;
  search: string;
};

export const TutorFormdiscussion = () => {
  const user = useAuth();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [page, setPage] = useState<number>(1);
  const [getSubjects] = useLazyGetSubjectsAndCategoryQuery();
  const [category, setCategory] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filter>({
    subject: "",
    category: "",
    search: "",
  });
  const [debounce, setDebounce] = useState<string>("");
  const observerRef = useRef<any | null>(null)
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [data1, setData1] = useState<any>([])

  const fetchCategory = async () => {
    try {
      const res = await getSubjects({
        type: TYPE_SUBJECT_LISTING.CATEGORY,
      }).unwrap();
      if (res?.statusCode == 200) {
        setCategory(res?.data);
      }
    } catch (error: any) { }
  };

  const { data: ForumData, isLoading, isFetching, isSuccess } = useGetContentQuery({
    type: ForumType.OTHERS,
    contentType: CONTENT_TYPE.FORUM,
    page: page,
    limit: 10,
    ...(filters.subject ? { subjectId: filters.subject } : {}),
    ...(filters.category ? { categoryId: filters.category } : {}),
    ...(debounce ? { search: debounce } : {}),
  });
  const fetchSubjects = async () => {
    try {
      const res = await getSubjects({
        type: TYPE_SUBJECT_LISTING.SUBJECT,
        categoryId: filters.category,
      }).unwrap();
      if (res?.statusCode == 200) {
        setSubjects(res?.data);
      }
    } catch (error: any) { }
  };

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
          threshold: 0.5,      // fire when 50% visible
          rootMargin: "100px", // preload earlier
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetching, isFetching, hasNextPage]
  );

    useEffect(() => {
    setPage(1);
    setData1([]);
    setHasNextPage(true);
  }, [filters, debounce]);


  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    if (filters.category) {
      fetchSubjects();
    }
  }, [filters.category]);
  useEffect(() => {
    const delay = 1500; // Debounce delay in milliseconds
    const timerId = setTimeout(() => {
      setDebounce(filters.search);
    }, delay);
    return () => {
      clearTimeout(timerId); // Clear the timeout on cleanup
    };
  }, [filters.search]);


  useEffect(() => {
    if (isSuccess && ForumData?.data?.data) {

      setData1((prev: any) => {
        const newData = page === 1
          ? [...ForumData?.data?.data]
          : [...prev, ...ForumData?.data?.data];

        const unique = Array.from(
          new Map(newData.map(item => [item._id, item])).values()
        );

        return unique;
      });
    }

    if (ForumData?.data?.data?.length === 0) {
      setHasNextPage(false);
    }
  }, [isSuccess, ForumData, page]);


  return (
    <TutorLayout className="role-layout">
      <Loader isLoad={isLoading} />
      <main className="content">
        <section className="uh_spc pSearchResult_sc home_wrp">
          <div className="conta_iner v2">
            <div className="mn_fdx">
              <NewSideBarTutor />
              <div className="mdl_cntnt">
                <div className="thoughts">
                  <div className="th_row">
                    <figure>
                      <img
                        src={user?.image || `/static/images/user.png`}
                        alt="amelia"
                      />
                    </figure>
                    <div className="input_group">
                      <TextField
                        hiddenLabel
                        placeholder="Got a question or something to share ?"
                        variant="filled"
                        value={filters.search}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            search: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <img
                      onClick={handleOpen}
                      width={30}
                      src="/static/images/plus.png"
                      alt="error"
                    />
                    <AddFormAndDisscussion
                      handleClose={handleClose}
                      handleOpen={handleOpen}
                      open={open}
                    />
                  </div>
                </div>

                <ul className="cstmm_tabs cstmmm_tabs_1">
                  <li>
                    <Select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select category
                      </MenuItem>
                      {category?.map((item) => {
                        return (
                          <MenuItem value={item?._id}>
                            {item?.name || "-"}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </li>
                  <li>
                    <Select
                      name="subject"
                      value={filters.subject}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      fullWidth
                      disabled={!filters.category}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select Subject
                      </MenuItem>
                      {subjects?.map((item) => {
                        return (
                          <MenuItem value={item?._id}>
                            {item?.name || "-"}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </li>
                  {filters?.category || filters?.subject || filters?.search ? (
                    <button
                      className="btn primary"
                      style={{ backgroundColor: "red" }}
                      onClick={() => {
                        setFilters({
                          category: "",
                          subject: "",
                          search: "",
                        });
                        setDebounce("");
                      }}
                    >
                      Reset Filters
                    </button>
                  ) : null}
                </ul>

                {data1?.length ? data1?.map(
                  (item: ForumTypeInterface, i: number) => (
                    <Upvote key={i} data={item} ref={i===data1?.length-1 ? lastElementRef:null} />
                  )
                ) : (
                  <div className=" mdl_cntnt video_content no_data">
                    <figure>
                      <img src="/static/images/noData.png" alt="no data found" />
                    </figure>
                    <p>No Forum found</p>
                  </div>
                )}
              </div>
              <div className="sidebar_rt">
                <section className="side_menu_wrap unlock_bg ">
                  <div className="group">
                    <h4>Unlock Learning, Book Your Perfect Tutor Today!</h4>
                    <button>Book Now</button>
                  </div>
                  <figure>
                    <img
                      src={`/static/images/unlock_men.png`}
                      alt="unlock_men"
                    />
                  </figure>
                </section>
                <section className="side_menu_wrap  page_link">
                  <ul>
                    <li>
                      <a>About Us</a>
                    </li>
                    <li>
                      <a>Contact Us</a>
                    </li>
                    <li>
                      <a>Help Center</a>
                    </li>
                    <li>
                      <a>Terms & conditions</a>
                    </li>
                    <li>
                      <a>Privacy Policy</a>
                    </li>
                    <li>
                      <a>FAQ’s</a>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
    </TutorLayout>
  );
};
