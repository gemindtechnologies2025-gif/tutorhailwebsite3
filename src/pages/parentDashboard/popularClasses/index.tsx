import React, { useCallback, useEffect, useRef, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import NewSideBarParent from "../../../components/NewSideBarParent";
import { RecommendedClasses } from "../../../components/RecommendedClasses";
import Chatbar from "../../../components/Chatbar";
import {
  Button,
  FormControlLabel,
  styled,
  Switch,
  SwitchProps,
  TextField,
} from "@mui/material";
import { TabCard } from "../../../components/TabCard";
import {
  CLASS_LIST_TYPE,
  CLASS_TYPE,
  ClassMode,
  TeachingLanguage,
  TYPE_SUBJECT_LISTING,
} from "../../../constants/enums";
import { useGetClassesForParentQuery } from "../../../service/class";
import { Dropdown } from "../../../components/DropDownFilter";
import { useLazyGetSubjectsAndCategoryQuery } from "../../../service/auth";
import { useDebounce } from "../../../constants/useDebounce";
import { isValidInput } from "../../../utils/validations";
import TutorListing from "../../../components/TutorListing";
import Loader from "../../../constants/Loader";

function PopularClasses() {
  const [query, setQuery] = useState<string>("");
  const debounceValue = useDebounce(query, 750);
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: string;
  }>({});
  const [page, setPage] = useState<number>(1);

  const observerRef = useRef<any | null>(null)
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [data1, setData1] = useState<any>([])

  const { data: classData, isLoading, isFetching, isSuccess } = useGetClassesForParentQuery({
    type: CLASS_LIST_TYPE.RECOMMENDED,
    page: page,
    limit: 10,
    ...(selectedValues?.Subjects
      ? { subjectId: selectedValues?.Subjects }
      : {}),
    ...(selectedValues?.Language ? { language: selectedValues?.Language } : {}),
    ...(selectedValues?.Price ? { sortBy: selectedValues?.Price } : {}),
    ...(selectedValues?.Mode ? { classMode: selectedValues?.Mode } : {}),
    ...(selectedValues?.Type
      ? { canBePrivate: selectedValues?.Type == "1" ? false : true }
      : {}),
    ...(debounceValue ? { search: debounceValue } : {}),
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



  const [getSubjects] = useLazyGetSubjectsAndCategoryQuery();
  const [subjects, setSubjects] = useState<any[]>([]);
  const fetchSubjects = async () => {
    try {
      const res = await getSubjects({
        type: TYPE_SUBJECT_LISTING.SUBJECT,
      }).unwrap();
      if (res?.statusCode == 200) {
        setSubjects(res?.data);
      }
    } catch (error: any) { }
  };

  const dropdownData = [
    {
      name: "Type",
      options: [
        { name: "Public", value: 1 },
        { name: "Private", value: 2 },
      ],
    },
    {
      name: "Subjects",
      options:
        subjects?.map((item) => ({ name: item?.name, value: item?._id })) || [],
    },
    {
      name: "Price",
      options: [
        { name: "Low to High", value: 1 },
        { name: "High to Low", value: 1 },
      ],
    },
    {
      name: "Mode",
      options: [
        { name: "Online", value: ClassMode.ONLINE },
        { name: "Offline", value: ClassMode.OFFLINE },
        { name: "Online", value: ClassMode.HYBRID },
      ],
    },
    {
      name: "Language",
      options: [
        { name: "English", value: TeachingLanguage.ENGLISH },
        { name: "Arabic", value: TeachingLanguage.ARABIC },
      ],
    },
  ];
  const handleChange = (name: string, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setPage(1);
    setData1([]);
    setHasNextPage(true);
  }, [selectedValues, debounceValue]);


  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (isSuccess && classData?.data?.data) {

      setData1((prev: any) => {
        const newData = page === 1
          ? [...classData.data.data]  // fresh load
          : [...prev, ...classData.data.data]; // append for infinite scroll

        const unique = Array.from(
          new Map(newData.map(item => [item._id, item])).values()
        );

        return unique;
      });
    }

    if (classData?.data?.data?.length === 0) {
      setHasNextPage(false);
    }
  }, [isSuccess, classData, page]);


  return (
    <>
      <ParentLayout className="role-layout">
        <Loader isLoad={isLoading} />
        <main className="content">
          <section className="uh_spc pSearchResult_sc home_wrp">
            <div className="conta_iner v2">
              <div className="mn_fdx">
                <NewSideBarParent />
                <div className="mdl_cntnt slide_fliter">
                  <div className=" control_group d_flex">

                    <TextField
                      className="search-field"
                      placeholder="search.."
                      value={query}
                      onChange={(e) => {
                        if (isValidInput(e.target.value)) {
                          setQuery(e.target.value);
                        }
                      }}
                    />
                    {(query || Object.keys(selectedValues).length > 0) && (
                      <Button
                        onClick={() => {
                          setQuery("");
                          setSelectedValues({});
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <ul className="cstmm_tabs">
                    {dropdownData.map((dropdown) => (
                      <Dropdown
                        key={dropdown.name}
                        name={dropdown.name}
                        options={dropdown.options}
                        selected={selectedValues[dropdown.name] || ""}
                        onChange={(value) => handleChange(dropdown.name, value)}
                      />
                    ))}
                  </ul>
                  <div className="gap_m rec_clsss">
                    {data1?.length
                      ? data1?.map((item: any, index: number) => {
                        return <RecommendedClasses data={item} ref={index === data1?.length - 1 ? lastElementRef : null} />;
                      })
                      : (
                        <div className=" mdl_cntnt video_content no_data">
                          <figure>
                            <img src="/static/images/noData.png" alt="no data found" />
                          </figure>
                          <p>No Class found</p>
                        </div>
                      )}
                  </div>
                </div>
                <div className="sidebar_rt">
                  <TutorListing />

                </div>
              </div>
            </div>
          </section>
        </main>
      </ParentLayout>
    </>
  );
}

export default PopularClasses;
