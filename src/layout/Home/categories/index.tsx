import { Button, TextField } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  return (
    <section className="home_category_sc u_spc">
      <div className="conta_iner">
        <div className="s_head text_center">
          <h2>
            At <strong className="c_primary">TutorHail</strong> Get a Wide Range
            of <mark className="high_light">Categories</mark>
          </h2>
          <p>
            At TutorHail, discover a wide range of categories tailored to your
            learning needs. Whether you're looking for help in mathematics,
            science, languages, or the arts, we have expert tutors ready to
            guide you.
          </p>
          <form className="form">
            <div className="control_group">
              <TextField
                hiddenLabel
                placeholder="Search for categories or Subject"
              ></TextField>
              <Button onClick={() => navigate("/parent/popular-tutor")}>
                <SearchRoundedIcon /> Search Tutor
              </Button>
            </div>
          </form>
        </div>
        <ul className="category_box gap_m">
          <li
            onClick={() =>
              navigate("/parent/popular-tutor?subject=Mathematics")
            }
          >
            <figure>
              <img src={`/static/images/1.png`} alt="img" />
            </figure>
            <p>Mathematics</p>
          </li>
          <li onClick={() => navigate("/parent/popular-tutor?subject=English")}>
            <figure>
              <img src={`/static/images/2.png`} alt="img" />
            </figure>
            <p>English</p>
          </li>
          <li onClick={() => navigate("/parent/popular-tutor?subject=Science")}>
            <figure>
              <img src={`/static/images/3.png`} alt="img" />
            </figure>
            <p>Science</p>
          </li>
          <li onClick={() => navigate("/parent/popular-tutor?subject=Arts")}>
            <figure>
              <img src={`/static/images/4.png`} alt="img" />
            </figure>
            <p>Arts</p>
          </li>
          <li
            onClick={() =>
              navigate(
                `/parent/popular-tutor?subject=${encodeURIComponent("IT & Computers")}`
              )
            }
          >
            <figure>
              <img src={`/static/images/5.png`} alt="img" />
            </figure>
            <p>IT & Computers</p>
          </li>
          <li
            onClick={() =>
              navigate(
                `/parent/popular-tutor?subject=${encodeURIComponent("Physical Education")}`
              )
            }
          >
            <figure>
              <img src={`/static/images/6.png`} alt="img" />
            </figure>
            <p>Physical Education</p>
          </li>
          <li
            onClick={() =>
              navigate(
                `/parent/popular-tutor?subject=${encodeURIComponent("Social Studies")}`
              )
            }
          >
            <figure>
              <img src={`/static/images/7.png`} alt="img" />
            </figure>
            <p>Social Studies</p>
          </li>
          <li
            onClick={() =>
              navigate(
                `/parent/popular-tutor?subject=${encodeURIComponent("Physical Skills")}`
              )
            }
          >
            <figure>
              <img src={`/static/images/8.png`} alt="img" />
            </figure>
            <p>Physical Skills</p>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Categories;
