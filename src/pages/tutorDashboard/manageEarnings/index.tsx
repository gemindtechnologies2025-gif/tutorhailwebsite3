/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import { useNavigate } from "react-router-dom";
import { Select, MenuItem, SelectChangeEvent, Button } from "@mui/material";
import WithdrawModal from "../../../Modals/withdraw";
import { useLazyGetTutorDashboardQuery } from "../../../service/tutorApi";
import { showError } from "../../../constants/toast";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import Loader from "../../../constants/Loader";
import moment from "moment";
import NewSideBarTutor from "../../../components/NewSideBarTutor";

export default function TutorEarnings() {
  const navigate = useNavigate();

  const [open1, setOpen1] = useState(false);
  const handleCloseModal1 = () => {
    setOpen1(false);
  };
  const currentDate = new Date();
  const [dashboardApi] = useLazyGetTutorDashboardQuery();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dashData, setDashData] = useState<any>();

  const [yearType, setYearType] = React.useState<string>("daily");
  const handleChange = (event: SelectChangeEvent) => {
    setYearType(event.target.value as string);
  };
  const [graphData, setGraphData] = useState<any>([]);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await dashboardApi({ type: yearType }).unwrap();
      setIsLoading(false);
      if (res?.statusCode === 200) {
        setDashData(res?.data);
        setGraphData(res?.data?.revenuesGraph);
      }
    } catch (error: any) {
      setIsLoading(false);
      showError(error?.data?.message);
    }
  };

  function convertToInternationalCurrencySystem(labelValue: number) {
    return Math.abs(Number(labelValue)) >= 1.0e9
      ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + " B"
      : // Ssix Zeroes for Millions
      Math.abs(Number(labelValue)) >= 1.0e6
        ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + " M"
        : // Three Zeroes for Thousands
        Math.abs(Number(labelValue)) >= 1.0e3
          ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + " K"
          : Math.abs(Number(labelValue));
  }

  const weekdays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const processedGraphData = graphData?.map((item: any) => ({
    ...item,
    name: weekdays.includes(item.name) ? item.name.slice(0, 3) : item.name,
  }));

  const chartSetting = {
    yAxis: [
      {
        label: "Earnings($)",
        tickLabelVisible: false,
        tickVisible: false,
      },
    ],
    series: [
      {
        dataKey: "value",
        color: "url(#gradientColor)", // Apply the gradient here
        radius: 40, // Apply radius to the bars
        convertToInternationalCurrencySystem,
      },
    ],
    height: 300,
    sx: {
      // [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      //     transform: 'translateX(-10px)',
      // },
      [`& .${axisClasses.directionY} .${axisClasses.tickLabel}`]: {
        display: "none",
      },
      [`& .${axisClasses.directionY} .${axisClasses.tick}`]: {
        display: "none",
      },
    },
  };

  useEffect(() => {
    fetchDashboard();
  }, [yearType]);

  return (
    <>
      <TutorLayout className="role-layout">
        <Loader isLoad={isLoading} />
        <main className="content">
          <section className="uhb_spc home_wrp tEarnings_sc">
            <div className="conta_iner v2">
              {/* <div className="role_head">
                                <button className="back_arrow" onClick={() => navigate('/tutor/dashboard')}>
                                    <img src={`/static/images/back.png`} alt="Back" />
                                </button>
                                <h1 className="hd_3">Manage Earnings</h1>
                            </div> */}
              <div className="mn_fdx ut_spc">
                <NewSideBarTutor />

                <div className="dashboard_flex mdl_cntnt ">
                  <h2 className="sub_title">Manage Earnings</h2>
                  <div className="lt_s">
                    <div className="white_box">
                      <div className="withdraw_row">
                        <figure>
                          <img src={`/static/images/coin_icon.svg`} alt="" />
                        </figure>
                        <p>
                          <span>Total Earn</span>
                          <strong>
                            {" "}
                            {dashData?.totalEarnings !== undefined
                              ? dashData?.totalEarnings >= 1000000
                                ? `$ ${(
                                  dashData?.totalEarnings / 1000000
                                ).toFixed(1)} m`
                                : "$" +
                                convertToInternationalCurrencySystem(
                                  dashData?.totalEarnings
                                ).toLocaleString()
                              : "0"}
                          </strong>
                        </p>
                        <button
                          className="btn primary "
                          onClick={() => setOpen1(true)}
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                    <div className="white_box">
                      <div className="head">
                        <div className="lt">
                          <h2>
                            {moment(currentDate).format("ddd, Do MMM, YY")}
                          </h2>
                        </div>
                        <div className="rt">
                          <div className="control_group">
                            <Select
                              labelId="yearType-label"
                              id="yearType"
                              value={yearType}
                              onChange={handleChange}
                            >
                              <MenuItem value="daily">Daily</MenuItem>
                              <MenuItem value="weekly">Weekly</MenuItem>
                              <MenuItem value="monthly">Monthly</MenuItem>
                              <MenuItem value="yearly">Yearly</MenuItem>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div style={{ width: "100%", display: "flex" }}>
                        <svg width="0" height="0">
                          <defs>
                            <linearGradient
                              id="gradientColor"
                              x1="0%"
                              y1="100%"
                              x2="0%"
                              y2="0%"
                            >
                              <stop
                                offset="0%"
                                style={{ stopColor: "#076221", stopOpacity: 1 }}
                              />
                              <stop
                                offset="100%"
                                style={{ stopColor: "#05A633", stopOpacity: 1 }}
                              />
                            </linearGradient>
                          </defs>
                        </svg>
                        <BarChart
                          dataset={processedGraphData ? processedGraphData : []}
                          xAxis={[
                            {
                              scaleType: "band",
                              dataKey: "name",
                              tickPlacement: "middle",
                              tickLabelPlacement: "tick",
                            },
                          ]}
                          {...chartSetting}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sidebar_rt">
                  {dashData?.booking?.data?.length ? (
                    <div className=" list_wrapper rt_s">
                      <div className="white_box">

                        <ul className="pay_box">
                          {dashData?.booking?.data?.length
                            ? dashData?.booking?.data?.map((item: any) => {
                              return (
                                <li>
                                  <div className="lt">
                                    <figure>
                                      <img
                                        src={
                                          item?.parents?.image ||
                                          "/static/images/user.png"
                                        }
                                        alt="amelia"
                                      />
                                    </figure>
                                    <p>
                                      {item?.parents?.name || ""}{" "}
                                      {/* <span>#{item?.promocodeId || ""}</span> */}
                                    </p>
                                  </div>
                                  <div className="rt">
                                    <p>
                                      Received{" "}
                                      <strong>
                                        ${item?.grandTotal?.toFixed(2) || "0"}
                                      </strong>
                                    </p>
                                  </div>
                                </li>
                              );
                            })
                            : null}


                        </ul>
                      </div>
                    </div>
                  ) : null}

                </div>
              </div>
            </div>
          </section>
        </main>
      </TutorLayout>

      <WithdrawModal
        open={open1}
        onClose={handleCloseModal1}
        setOpen={setOpen1}
        earnings={dashData?.earn?.earning}
      />
    </>
  );
}
