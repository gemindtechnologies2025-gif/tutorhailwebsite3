/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  useAddWishListMutation,
  useGetWishListQuery,
} from "../../../service/wishListApi";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useManageWishList from "../../../apiHooks/useManageWishlisht";
import { showToast } from "../../../constants/toast";
import { wishList } from "../../../types/General";
import { Box, Card, CardContent, Skeleton } from "@mui/material";
import NewSideBarParent from "../../../components/NewSideBarParent";
import SkeletonList from "../../../components/SkeltonTutor";
import TutorsCard from "../../../components/TutorsCard";
import Pagination from "../../../constants/Pagination";
import Loader from "../../../constants/Loader";
export default function ParentWishlist() {
  const navigate = useNavigate(); // hook for the navigation

  const { data, isError, isLoading, isSuccess } = useGetWishListQuery(); // api hook to fetch the wishlist listing
  const [addWishlist] = useAddWishListMutation();

  const handleWishList = async (item: wishList) => {
    //    console.log(item, "wish");
    try {
      let body = {
        tutorId: item?.tutorId,
      };

      const res = await addWishlist({ body }).unwrap();
      if (res?.statusCode === 200) {
        if (item?.isFav) {
          showToast("Tutor removed to wishlist");
        } else {
          showToast("Tutor added to wishlist");
        }
      }
    } catch (error: any) {
      //      console.log(error);
    }
  };
console.log(data?.data?.data,'data?.data?.data');


  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">
         

          <section className="ut_spc home_wrp">
            <div className="conta_iner v2 parent_dash tutor_fx">
              <div className="gap_m">
                <NewSideBarParent />
                <div className="rt_s">
                  <div className="role_head">
                    <h1 className="hd_3">Wishlist</h1>
                  </div>


                  <div className="tutoer_list gap_m">
                    {isLoading &&
                      <Loader isLoad={isLoading} />
                    }

                    {isSuccess && data?.data?.data?.length ? (
                      data?.data?.data?.map((item: any, index: number) => {
                        return (
                          <TutorsCard isWishlist={true} item={item} />
                        )
                      })

                    ) : (
                      isLoading ? null :
                        <h3 style={{ textAlign: "center" }}>No Tutor found</h3>
                    )}

                  </div>

                </div>
              </div>
            </div>
          </section>
        </main>
      </ParentLayout>
    </>
  );
}


