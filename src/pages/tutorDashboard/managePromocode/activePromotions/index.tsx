import React, { useEffect, useState } from "react";
import NewSideBarTutor from "../../../../components/NewSideBarTutor";
import Loader from "../../../../constants/Loader";
import { TutorLayout } from "../../../../layout/tutorLayout";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ProgressBar from "../../../../components/ProgressBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  useDeletePromoByIdMutation,
  useGetPromoCodesQuery,
} from "../../../../service/promoCode";
import {
  DISCOUNT_TYPE,
  STATUS_NAME,
  TEASER_VIDEO_STATUS,
} from "../../../../constants/enums";
import moment from "moment";
import { showError, showToast } from "../../../../constants/toast";
import { AddPromoCodeModal } from "../../../../Modals/AddPromoModal";

export default function ActivePromotions() {
  const { data, isLoading } = useGetPromoCodesQuery({
    page: 1,
    limit: 50,
    setting: 1,
  });
  const [deletePromo] = useDeletePromoByIdMutation();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editData, setEditData] = useState<any>();
  const deletePromoCode = async (id: string) => {
    try {
      const res = await deletePromo({ id }).unwrap();
      if (res?.statusCode === 200) {
        showToast("Promo code deleted Succesfully");
      }
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };
  return (
    <TutorLayout className="role-layout">
      <Loader isLoad={isLoading} />
      <main className="content">
        <section className="uh_spc active_promotions home_wrp">
          <div className="conta_iner v2">
            <div className="gap_m grid_2">
              <NewSideBarTutor />
              <div className="rt_v2">
                <div className="card_box">
                  <h1 className="sub_title">Active Promotions</h1>
                  {data?.data?.data?.length
                    ? data?.data?.data?.map((item: any, index: number) => {
                        return (
                          <div className="promotions_listing">
                            <h2>
                              {item?.name || ""}{" "}
                              <span>
                                {item?.codeStatus
                                  ? STATUS_NAME[item?.codeStatus]
                                  : ""}
                              </span>{" "}
                            </h2>
                            <h3>
                              {item?.codeName || ""}
                              {item?.discount ? (
                                <span>
                                  {" "}
                                  {item?.discount || 0}
                                  {item?.discountType ==
                                  DISCOUNT_TYPE.PERCENTAGE
                                    ? "%"
                                    : ""}{" "}
                                  off
                                </span>
                              ) : null}
                            </h3>
                            <ul className="promo_inner">
                              <li>
                                <PeopleIcon />
                                {item?.usedCount || "0"}/{item?.maxUser} uses
                              </li>
                              <li>
                                <CalendarTodayIcon />
                                Expires:{" "}
                                {item?.expiryDate
                                  ? moment(item?.expiryDate).format("LL")
                                  : ""}
                              </li>
                              <li>
                                {(() => {
                                  const usedCount = item?.usedCount ?? 0;
                                  const maxUser = item?.maxUser ?? 1;
                                  const usagePercent =
                                    maxUser > 0
                                      ? (usedCount * 100) / maxUser
                                      : 0;
                                  return (
                                    <>
                                      <ProgressBar progress={usagePercent} />
                                      <p>{usagePercent.toFixed(1)}% used</p>
                                    </>
                                  );
                                })()}
                              </li>
                            </ul>
                            <h4>Applicable Classes</h4>
                            <ul className="app_clas">
                              {item?.allClasses ? (
                                <li>All</li>
                              ) : (
                                item?.classes?.map(
                                  (classItem: any, index: number) => (
                                    <li key={index}>
                                      {classItem?.topic || ""}
                                    </li>
                                  )
                                )
                              )}
                            </ul>
                            <div className="btn_flx2">
                              <button
                                onClick={() => deletePromoCode(item?._id)}
                                className="btn transparent"
                              >
                                <DeleteOutlineIcon />
                                Delete
                              </button>
                              {item?.codeStatus ==
                              TEASER_VIDEO_STATUS.PENDING ? (
                                <button
                                  onClick={() => {
                                    setEditData(item);
                                    setOpen(true);
                                  }}
                                  className="btn primary"
                                >
                                  <EditIcon />
                                  Continue Editing
                                </button>
                              ) : null}
                            </div>
                          </div>
                        );
                      })
                    : "No Promo code available"}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <AddPromoCodeModal
        handleClose={handleClose}
        handleOpen={handleOpen}
        open={open}
        edit={true}
        data={editData}
      />
    </TutorLayout>
  );
}
