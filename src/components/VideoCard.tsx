import React from 'react'
import { useNavigate } from 'react-router-dom';

export const VideoCard = ({ data }: any) => {
    const navigate = useNavigate();
    return (
        <div className='tsr_wp'>
            <div
                className="video-card"
                   onClick={()=>navigate(`/parent/teaserVideos/`+ data?._id)} 
            >
                <video
                    src={data?.images?.[0] || "/static/videos/sample.mp4"} // replace with actual video url
                    muted
                    preload="metadata"
                    playsInline
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />


                <div className="play-button">
                    <span>
                        <img src={`/static/images/play_icn.svg`} alt="Play" />
                    </span>
                </div>


                <div className="video-details">
                    <h4>{data?.title || ""}</h4>

                    <div className="video-views">
                        <span>
                            <img
                                src={`/static/images/play_icn.svg`}
                                alt="Views"
                            />
                        </span>
                        <span>{data?.views || 0}</span>
                    </div>
                </div>
            </div>
        </div>

    )
}
