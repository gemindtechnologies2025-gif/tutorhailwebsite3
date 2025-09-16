import React, { useCallback, useEffect, useRef, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import NewSideBarParent from "../../../components/NewSideBarParent";
import Upvote from "../../../components/Upvote";
import {
  MenuItem,
  Select,
  TextField,
  Tabs,
  Tab,
  Box,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useGetContentQuery } from "../../../service/content";
import {
  CONTENT_TYPE,
  TYPE_SUBJECT_LISTING,
} from "../../../constants/enums";
import { ForumTypeInterface } from "../../../types/General";
import Loader from "../../../constants/Loader";
import { useLocation, useNavigate } from "react-router-dom";



export const PostListing = () => {

  const [search, setSearch] = useState<string>(
    ""
  );
    const location=useLocation();
    const {state}=location;
  const navigate = useNavigate(); // navigation hook
  const [debounce, setDebounce] = useState<string>("");
  const observerRef = useRef<any | null>(null)
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [data1, setData1] = useState<any>([])
  const [page, setPage] = useState<number>(1);


  const { data: ForumData, isLoading, isFetching, isSuccess } = useGetContentQuery({
    contentType: CONTENT_TYPE.POST,
    page: page,
    limit: 10,
    search: debounce,
    ...(state?.tutorId ? { tutorId: state?.tutorId } : {})
  });

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
    [isLoading, isFetching, hasNextPage]
  );

  useEffect(() => {
    setPage(1);
    setData1([]);
    setHasNextPage(true);
  }, [debounce]);

  useEffect(() => {
    if (isSuccess && ForumData?.data?.data) {

      setData1((prev: any) => {
        const newData = page === 1
          ? [...ForumData.data.data]  // fresh load
          : [...prev, ...ForumData.data.data]; // append for infinite scroll

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


  useEffect(() => {
    const delay = 1500;
    const timerId = setTimeout(() => {
      setDebounce(search);
    }, delay);
    return () => clearTimeout(timerId);
  }, [search]);

  // tab state
  const [tabValue, setTabValue] = useState(0);

  // search state
  const [showSearch, setShowSearch] = useState(false);

  return (
    <ParentLayout className="role-layout">
      <Loader isLoad={isLoading} />
      <main className="content">
        <section className="uh_spc pSearchResult_sc home_wrp">
          <div className="conta_iner v2">
            <div className="mn_fdx">
              <NewSideBarParent />
              <div className="mdl_cntnt">
                {/* Tabs with search icon */}
                {state?.tutorId ? null : (

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: 1,
                    borderColor: "divider",
                    mb: 2,
                  }}
                >
                  <Tabs
                    value={tabValue}
                    // onChange={(_, newValue) => setTabValue(newValue)}
                  >
                    <Tab label="Posts" />
                    <Tab onClick={()=>navigate('/parent/videos')} label="Short Videos" />
                    <Tab  onClick={()=>navigate('/parent/videos',{state:{following:true}})} label="Following" />
                  </Tabs>

                  <IconButton className="tap_srch" onClick={() => setShowSearch((prev) => !prev)}>
                    <SearchIcon />
                  </IconButton>
                </Box>
                )}

                {/* Search Bar (only visible when toggled) */}
                {showSearch && tabValue === 0 && (
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      hiddenLabel
                      placeholder="Search here.."
                      variant="outlined"
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />
                  </Box>
                )}

                {/* Tab Panels */}
                {tabValue === 0 && (
                  <>
                    {data1?.length ? data1?.map(
                      (item: ForumTypeInterface, i: number) => (
                        <Upvote key={i} data={item} ref={i === data1?.length - 1 ? lastElementRef : null} />
                      )
                    ) :
                      <div className=" mdl_cntnt video_content no_data">
                        <figure>
                          <img src="/static/images/noData.png" alt="no data found" />
                        </figure>
                        <p>No Post found</p>
                      </div>
                    }
                  </>
                )}

                
              </div>

              {/* Right Sidebar */}
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
    </ParentLayout>
  );
};
