import NewSideBarTutor from "../../../../components/NewSideBarTutor";
import Loader from "../../../../constants/Loader";
import { TutorLayout } from "../../../../layout/tutorLayout";
import { useLazyGetReviewsQuery } from "../../../../service/tutorApi";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  useDeletePromoByIdMutation,
  useGetPromoCodesQuery,
} from "../../../../service/promoCode";
import { useState } from "react";
import { showError, showToast } from "../../../../constants/toast";
import { DISCOUNT_TYPE } from "../../../../constants/enums";
import moment from "moment";
import { AddPromoCodeModal } from "../../../../Modals/AddPromoModal";

export default function Drafts() {
  const { data, isLoading } = useGetPromoCodesQuery({
    page: 1,
    limit: 50,
    setting: 2,
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
        showToast("Draft deleted Succesfully");
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
                  <h1 className="sub_title">Drafts</h1>
                  {data?.data?.data?.length
                    ? data?.data?.data?.map((item: any, index: number) => {
                        return (
                          <div className="promotions_listing">
                            <h2>
                              {item?.name || ""}
                              <span>Draft</span>{" "}
                            </h2>
                            <h3>
                              {item?.codeName || ""}
                              <span>
                                {" "}
                                {item?.discount || 0}
                                {item?.discountType == DISCOUNT_TYPE.PERCENTAGE
                                  ? "%"
                                  : ""}{" "}
                                off
                              </span>
                            </h3>
                            <ul className="promo_inner">
                              <li>
                                <CalendarTodayIcon />
                                Last modified:{" "}
                                {item?.updatedAt
                                  ? moment(item?.updatedAt).format("LLL")
                                  : ""}
                              </li>
                            </ul>

                            <div className="btn_flx2">
                              <button
                                onClick={() => deletePromoCode(item?._id)}
                                className="btn transparent"
                              >
                                <DeleteOutlineIcon />
                                Delete
                              </button>
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
                            </div>
                          </div>
                        );
                      })
                    : "No draft available"}
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
              draft={true}
            />
    </TutorLayout>
  );
}
