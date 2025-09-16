import { showToast } from "../constants/toast";
import useAuth from "../hooks/useAuth";
import { wishListApi } from "../service/wishListApi";
import { TutorDetails } from "../types/General";

const useManageWishList = () => {
  const [addWishlist] = wishListApi.useAddWishListMutation();
  const user = useAuth();

  const handleWishList = async (item: TutorDetails) => {
    try {
      let body = {
        tutorId: item?._id,
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
    }
  };
  return { handleWishList };
};

export default useManageWishList;
