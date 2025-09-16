import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getFromStorage } from "../constants/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";


type props = {
    image: string,
    name: string,
    price: number,
    classCount: number,
    rating: number,
    subjects: string[],
    id?: string
}

const TutorCard = ({ image, name, price, classCount, rating, subjects, id }: props) => {
    const navigate = useNavigate();
    const token = getFromStorage(STORAGE_KEYS.token)
    return (
        <div className="tutor_single">
            <figure onClick={() => navigate(`/parent/tutor-detail/${id}`)}>
                <img src={image} alt="img" />
            </figure>
            <div className="info">
                <p>{classCount}+ Classes</p>
                <p className="rating"><img src={`/static/images/frame1.png`} alt="img" /> {rating?.toFixed(1)}</p>
            </div>
            <div className="body">
                <h3>{name}</h3>
                <p>
                    {subjects?.length ? (
                        subjects
                            .slice(0, 5)
                            .map(item => item)
                            .join(', ')

                    ) : ""}...
                </p>
                <ins>${price}/hour</ins>
                <Button onClick={() => navigate(`/parent/tutor-detail/${id}`)}>Book a Class</Button>
            </div>
        </div>
    )
}

export default TutorCard;