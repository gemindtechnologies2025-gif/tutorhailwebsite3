/* eslint-disable jsx-a11y/img-redundant-alt */
import { ParentLayout } from "../../../layout/parentLayout";
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import Pagination from "../../../constants/Pagination";
import LoginAlertModal from "../../../Modals/LoginAlertModal";
import Loader from "../../../constants/Loader";
import TutorsCard from "../../../components/TutorsCard";
import Filter from "../../../components/Filter";
import NewSideBarParent from "../../../components/NewSideBarParent";
import { useGetAllTypeTutorQuery } from "../../../service/parentDashboard";
import {
  GRADE_TYPE,
  GRADE_TYPE_NAME,
  TEACHING_WRITTEN,
  TeachingLanguage,
  TUTOR_TYPE,
} from "../../../constants/enums";
import { MenuItem, Select, TextField } from "@mui/material";
import { isValidInput } from "../../../utils/validations";

type Filter = {
  exp: string;
  teching: string[];
  language: string;
  gender: string;
  rating: string;
  curriculam: string[];
  class: string[];
};

const CURRICULUM_WRITTEN: Record<string, string> = {
  "1": "National",
  "2": "Cambridge",
  "3": "IB",
  "4": "American",
};

export default function ParentRecomendedTutor() {
  const [page, setPage] = useState<number>(1);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const observerRef = useRef<any | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [data1, setData1] = useState<any>([]);
  const [search, setSearch] = useState<string>(""); // 🔍 normal search input
  const [debounce, setDebounce] = useState<string>("");
  // ✅ Initialize filters from URL
  const [filters, setFilters] = useState<Filter>({
    exp: searchParams.get("exp") || "",
    teching: searchParams.get("teching")?.split(",") || [],
    language: searchParams.get("language") || "",
    gender: searchParams.get("gender") || "",
    rating: searchParams.get("rating") || "",
    curriculam: searchParams.get("curriculam")?.split(",") || [],
    class: searchParams.get("class")?.split(",") || [],
  });

  const isAnyFilterApplied = filters
    ? Object.values(filters).some((val) => {
        if (Array.isArray(val)) return val.length > 0; // non-empty array
        if (typeof val === "string") return val.trim() !== ""; // non-empty string
        return val !== null && val !== undefined; // other values
      })
    : false;

  const Body = {
    ...(filters?.exp ? { totalTeachingExperience: Number(filters.exp) } : null),
    ...(filters?.teching?.length
      ? { teachingStyle: filters?.teching?.map((t: string) => Number(t)) }
      : null),

    ...(filters?.language
      ? { teachingLanguage: Number(filters?.language) }
      : null),
    ...(filters?.gender ? { gender: filters?.gender } : null),
    ...(filters?.rating ? { avgRating: Number(filters?.rating) } : null),
    ...(filters?.curriculam?.length
      ? {
          curriculum: filters?.curriculam.map((c: string | number) =>
            Number(c)
          ),
        }
      : null),

    ...(filters?.class?.length
      ? { classes: filters?.class?.map((data: any) => Number(data)) }
      : null),
    ...(debounce ? { search: debounce } : {}),
  };
  const { data, isSuccess, isLoading, isFetching, refetch } =
    useGetAllTypeTutorQuery({
      page: page,
      limit: 12,
      type: TUTOR_TYPE.POPULAR,
      body: Body,
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
          threshold: 0.5, // fire when 50% visible
          rootMargin: "100px", // preload earlier
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetching, hasNextPage]
  );

  const hendleCloseAlert = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    setPage(1);
    setData1([]);
    setHasNextPage(true);
  }, [filters, debounce]);

  useEffect(() => {
    const params: any = {};
    Object.keys(filters).forEach((key) => {
      const val = (filters as any)[key];
      if (Array.isArray(val) && val.length > 0) {
        params[key] = val.join(","); // ✅ save as "1,2,3"
      } else if (!Array.isArray(val) && val) {
        params[key] = val;
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // ✅ Generic change handler
  const handleChange = (field: keyof Filter, value: string | string[]) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderWithCount = (
    selected: string[],
    mapper: (val: string) => string,
    placeholder: string
  ) => {
    if (!selected.length) return placeholder;
    const first = mapper(selected[0]);
    const restCount = selected.length - 1;
    return restCount > 0 ? `${first} +${restCount}` : first;
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounce(search);
    }, 1500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (isSuccess && data?.data?.data) {
      setData1((prev: any) => {
        const newData =
          page === 1
            ? [...data.data.data] // fresh load
            : [...prev, ...data.data.data]; // append for infinite scroll

        const unique = Array.from(
          new Map(newData.map((item) => [item._id, item])).values()
        );

        return unique;
      });
    }

    if (data?.data?.data?.length === 0) {
      setHasNextPage(false);
    }
  }, [isSuccess, data, page]);

  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">
          <section className="uh_spc home_wrp">
            <div className="conta_iner v2 parent_dash tutor_fx">
              <div className="gap_m">
                <NewSideBarParent />
                <div className="rt_s">
                  <div className="fdx_title">
                    <div className="role_head">
                      <h1 className="hd_3">Popular Tutors</h1>
                    </div>
                    <div className=" control_group d_flex">
                      <TextField
                        className="search-field"
                        placeholder="search.."
                        value={search}
                        onChange={(e) => {
                          if (isValidInput(e.target.value)) {
                            setSearch(e.target.value);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <ul className="cstmm_tabs cstmmm_tabs_1">
                    <li>
                      <Select
                        value={filters.exp}
                        onChange={(e) => handleChange("exp", e.target.value)}
                        fullWidth
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Experience
                        </MenuItem>
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="4">4</MenuItem>
                        <MenuItem value="5">5+</MenuItem>
                      </Select>
                    </li>
                    <li>
                      <Select
                        multiple
                        value={filters.teching}
                        onChange={(e) =>
                          handleChange("teching", e.target.value as string[])
                        }
                        fullWidth
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected.length) return "Teaching Style";

                          const first = TEACHING_WRITTEN[+selected[0]];
                          const restCount = selected.length - 1;

                          return restCount > 0
                            ? `${first} +${restCount}`
                            : first;
                        }}
                      >
                        {Object.entries(TEACHING_WRITTEN).map(
                          ([key, value]) => (
                            <MenuItem key={key} value={key}>
                              {value}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </li>
                    <li>
                      <Select
                        value={filters.language}
                        onChange={(e) =>
                          handleChange("language", e.target.value)
                        }
                        fullWidth
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Language
                        </MenuItem>
                        <MenuItem value={TeachingLanguage.ENGLISH}>
                          English
                        </MenuItem>
                        <MenuItem value={TeachingLanguage.ARABIC}>
                          Arabic
                        </MenuItem>
                        <MenuItem value={TeachingLanguage.BOTH}>Both</MenuItem>
                      </Select>
                    </li>

                    {/* Gender */}
                    <li>
                      <Select
                        value={filters.gender}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        fullWidth
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Gender
                        </MenuItem>
                        <MenuItem value="MALE">Male</MenuItem>
                        <MenuItem value="FEMALE">Female</MenuItem>
                      </Select>
                    </li>

                    {/* Rating */}
                    <li>
                      <Select
                        value={filters.rating}
                        onChange={(e) => handleChange("rating", e.target.value)}
                        fullWidth
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Rating
                        </MenuItem>
                        <MenuItem value="1">1.0</MenuItem>
                        <MenuItem value="2">2.0</MenuItem>
                        <MenuItem value="3">3.0</MenuItem>
                        <MenuItem value="4">4.0</MenuItem>
                        <MenuItem value="5">5.0</MenuItem>
                      </Select>
                    </li>

                    {/* Curriculam */}
                    <li>
                      <Select
                        multiple
                        value={filters.curriculam}
                        onChange={(e) =>
                          handleChange("curriculam", e.target.value as string[])
                        }
                        fullWidth
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected.length) return "Curriculam";
                          const first = CURRICULUM_WRITTEN[selected[0]];
                          const restCount = selected.length - 1;
                          return restCount > 0
                            ? `${first} +${restCount}`
                            : first;
                        }}
                      >
                        <MenuItem value="1">National Curriculam</MenuItem>
                        <MenuItem value="2">Cambridge Curriculam</MenuItem>
                        <MenuItem value="3">IB Curriculam</MenuItem>
                        <MenuItem value="4">American Curriculam</MenuItem>
                      </Select>
                    </li>

                    {/* Class */}
                    <li>
                      <Select
                        multiple
                        value={filters.class}
                        onChange={(e) =>
                          handleChange("class", e.target.value as string[])
                        }
                        fullWidth
                        displayEmpty
                        renderValue={(selected) =>
                          renderWithCount(
                            selected,
                            (s) => GRADE_TYPE_NAME[+s],
                            "Class"
                          )
                        }
                      >
                        {Object.entries(GRADE_TYPE).map(([key, value]) => (
                          <MenuItem key={value} value={String(value)}>
                            {GRADE_TYPE_NAME[value]}
                          </MenuItem>
                        ))}
                      </Select>
                    </li>
                    {isAnyFilterApplied && (
                      <button
                        className="btn primary"
                        style={{ backgroundColor: "red" }}
                        onClick={() => {
                          setFilters({
                            exp: "",
                            teching: [],
                            language: "",
                            gender: "",
                            rating: "",
                            curriculam: [],
                            class: [],
                          });

                          setSearchParams({});
                        }}
                      >
                        Reset Filters
                      </button>
                    )}
                  </ul>

                  <div className="tutoer_list gap_m">
                    {isLoading && <Loader isLoad={isLoading} />}

                    {data1?.length ? (
                      data1?.map((item: any, index: number) => {
                        return (
                          <TutorsCard
                            item={item}
                            ref={
                              index === data1?.length - 1
                                ? lastElementRef
                                : null
                            }
                          />
                        );
                      })
                    ) : isLoading ? null : (
                      <h3 style={{ textAlign: "center" }}>No Tutor found</h3>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </ParentLayout>
      <LoginAlertModal
        open={openAlert}
        setOpen={setOpenAlert}
        onClose={hendleCloseAlert}
        msg="Please login before adding tutor in to your wishlist"
      />
    </>
  );
}
