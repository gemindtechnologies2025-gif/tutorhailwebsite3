import React, { useEffect, useState, useRef } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import NewSideBarParent from "../../../components/NewSideBarParent";
import { Box, Tab, Tabs } from "@mui/material";
import Upvote from "../../../components/Upvote";
import { RecommendedClasses } from "../../../components/RecommendedClasses";
import { CONTENT_TYPE } from "../../../constants/enums";
import {
  useGetSavedClassQuery,
  useGetSavedContentQuery,
} from "../../../service/content";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function SavedItems() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { data, isLoading,isSuccess,isFetching } = useGetSavedContentQuery(
    {
      page: 1,
      limit: 100,
      contentType: value === 0 ? CONTENT_TYPE.POST : CONTENT_TYPE.FORUM,
    },
    { skip: value === 2 }
  );
  const { data: classData } = useGetSavedClassQuery(
    { page: 1, limit: 100 },
    { skip: value == 0 || value == 1 }
  );


  return (
    <ParentLayout className="role-layout">
      <main className="content">
        <section className="uh_spc home_wrp">
          <div className="conta_iner v2">
            <div className="gap_m grid_2">
              <NewSideBarParent />
              <div className="rt_v2 saved_items1">
                <Tabs
                  className="custom_tabs"
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Post" {...a11yProps(0)} />
                  <Tab label="Forum" {...a11yProps(1)} />
                  <Tab label="Class" {...a11yProps(2)} />
                </Tabs>
                <CustomTabPanel value={value} index={0}>
                  {data?.data?.data?.length
                    ? data?.data?.data?.map((item: any) => {
                      return (
                        <div className="saved_fdx">
                          <Upvote saved={true} data={item} />
                        </div>
                      );
                    })
                    : <div className=" mdl_cntnt video_content no_data">
                      <figure>
                        <img src="/static/images/noData.png" alt="no data found" />
                      </figure>
                      <p>No saved post found</p>
                    </div>}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  {data?.data?.data?.length
                    ? data?.data?.data?.map((item: any) => {
                      return (
                        <div className="saved_fdx">
                          <Upvote saved={true} data={item} />
                        </div>
                      );
                    })
                    : <div className=" mdl_cntnt video_content no_data">
                      <figure>
                        <img src="/static/images/noData.png" alt="no data found" />
                      </figure>
                      <p>No saved forum found</p>
                    </div>}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                  {classData?.data?.data?.length ? (
                    classData?.data?.data?.map((item: any) => {
                      return (
                        <RecommendedClasses data={item} saved={true} />
                      )
                    })

                  ) : (
                    <div className=" mdl_cntnt video_content no_data">
                      <figure>
                        <img src="/static/images/noData.png" alt="no data found" />
                      </figure>
                      <p>No saved class found</p>
                    </div>
                  )}
                </CustomTabPanel>
              </div>
            </div>
          </div>
        </section>
      </main>
    </ParentLayout>
  );
}

export default SavedItems;
