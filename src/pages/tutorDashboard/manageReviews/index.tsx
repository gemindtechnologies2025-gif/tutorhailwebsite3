import React, { useEffect, useState } from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import { useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useLazyGetReviewsQuery } from "../../../service/tutorApi";
import { showError } from "../../../constants/toast";
import Loader from "../../../constants/Loader";
import moment from "moment";
import NewSideBarTutor from "../../../components/NewSideBarTutor";


// const reviews={
//   "rating": [
//     {
//       "avgRating": 4.2
//     }
//   ],
//   "ratingUsers": 5,
//   "ratingDetail": [
//     {
//       "parents": {
//         "name": "Amit Sharma",
//         "image": "/static/images/user1.png"
//       },
//       "createdAt": "2025-07-10T12:30:00Z",
//       "rating": 4,
//       "review": "Working with Catherine has been an absolute game-changer for my academic journey. Her deep knowledge of the subject, combined with her patient and engaging teaching style, has made even the most challenging concepts easy to understand. I went from struggling with my grades to excelling beyond my expectations. Sarah's dedication and passion for teaching truly shine through, and I couldn't recommend her highly enough"
//     },
//     {
//       "parents": {
//         "name": "Neha Verma",
//         "image": "/static/images/user2.png"
//       },
//       "createdAt": "2025-07-08T09:45:00Z",
//       "rating": 5,
//       "review": "Working with Catherine has been an absolute game-changer for my academic journey. Her deep knowledge of the subject, combined with her patient and engaging teaching style, has made even the most challenging concepts easy to understand. I went from struggling with my grades to excelling beyond my expectations. Sarah's dedication and passion for teaching truly shine through, and I couldn't recommend her highly enough."
//     },
//     {
//       "parents": {
//         "name": "Rohit Singh",
//         "image": null
//       },
//       "createdAt": "2025-07-06T14:15:00Z",
//       "rating": 3,
//       "review": "Working with Catherine has been an absolute game-changer for my academic journey. Her deep knowledge of the subject, combined with her patient and engaging teaching style, has made even the most challenging concepts easy to understand. I went from struggling with my grades to excelling beyond my expectations. Sarah's dedication and passion for teaching truly shine through, and I couldn't recommend her highly enough."
//     }
//   ]
// }





export default function TutorReviews() {
  const [getReviewsApi, { isLoading }] = useLazyGetReviewsQuery();
  const [reviews, setReviews] = useState<any>();

  const fetchReviews = async () => {
    try {
      const res = await getReviewsApi({}).unwrap();
      if (res?.statusCode === 200) {
        setReviews(res?.data);
      }
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <>
      <TutorLayout className="role-layout">
        <Loader isLoad={isLoading} />
        <main className="content">
          <section className="uh_spc tReviews_sc home_wrp">
            <div className="conta_iner v2">
              <div className="gap_m grid_2">
                <NewSideBarTutor />
                <div className="role_body rt_v2">
                  <div className="card_box">
                    <div className="total_review">
                      <div className="lt_s">
                        <h2>
                          <strong>
                            {(reviews?.rating?.[0]?.avgRating || 0).toFixed(1)} <span>Ratings</span>
                          </strong>{" "}
                        </h2>
                        <Rating
                          name="read-only"
                          value={Number(reviews?.rating?.[0]?.avgRating)}
                          readOnly
                          emptyIcon={<StarIcon />}
                        />
                      </div>
                      <p>{reviews?.ratingUsers || "0"} Ratings</p>
                    </div>
                    <div className="cardBox_body">
                      <ul className="review_list v2">
                        {reviews?.ratingDetail?.length ? (
                          reviews?.ratingDetail?.map((item: any) => {
                            return (
                              <li>
                                <figure>
                                  <img
                                    src={
                                      item?.parents?.image
                                        ? item?.parents?.image
                                        : ` /static/images/user.png`
                                    }
                                    alt="icon"
                                  />

                                </figure>
                                <h3>
                                  {item?.parents?.name
                                    ? item?.parents?.name
                                    : `-`}{" "}
                                  <span>
                                    {moment(item?.createdAt).format(
                                      "DD/MM/YYYY"
                                    ) || "-"}
                                  </span>
                                </h3>
                                <Rating
                                  name="read-only"
                                  value={item?.rating}
                                  readOnly
                                  emptyIcon={<StarIcon />}
                                />
                                <p>{item?.review || ""}</p>
                              </li>
                            );
                          })
                        ) : (
                          <div className="no_data">
                            <figure>
                              <img
                                src="/static/images/noData.png"
                                alt="no data found"
                              />
                            </figure>
                            <p>No reviews found</p>
                          </div>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </TutorLayout>
    </>
  );
}
