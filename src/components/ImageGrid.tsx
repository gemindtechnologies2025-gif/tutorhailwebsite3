import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-image-lightbox/style.css";
import Lightbox from "react-image-lightbox";

const ImageGrid = ({ data }: { data: any }) => {
  const sliderRef = useRef<any>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <Slider ref={sliderRef} {...settings} className="venue_slider fb-photo-grid">
        {data?.images?.length === 1 && (
          <div className="grid grid-1">
            <figure>
              <img
                src={data.images[0]}
                alt="single"
                onClick={() => {
                  setPhotoIndex(0);
                  setLightboxOpen(true);
                }}
              />
            </figure>
          </div>
        )}

        {data?.images?.length === 2 && (
          <div className="grid grid-2">
            {data.images.map((item: any, i: number) => (
              <figure key={i}>
                <img
                  src={item}
                  alt={`img-${i}`}
                  onClick={() => {
                    setPhotoIndex(i);
                    setLightboxOpen(true);
                  }}
                />
              </figure>
            ))}
          </div>
        )}

        {data?.images?.length === 3 && (
          <div className="grid grid-3">
            <figure className="big">
              <img
                src={data.images[0]}
                alt="img-0"
                onClick={() => {
                  setPhotoIndex(0);
                  setLightboxOpen(true);
                }}
              />
            </figure>
            <div className="small-col">
              {data.images.slice(1, 3).map((item: any, i: number) => (
                <figure key={i + 1}>
                  <img
                    src={item}
                    alt={`img-${i + 1}`}
                    onClick={() => {
                      setPhotoIndex(i + 1);
                      setLightboxOpen(true);
                    }}
                  />
                </figure>
              ))}
            </div>
          </div>
        )}

        {data?.images?.length === 4 && (
          <div className="grid grid-4 ">
            {data.images.map((item: any, i: number) => (
              <div className="img-wrapper" key={i}>
                <img
                  src={item}
                  alt={`img-${i}`}
                  onClick={() => {
                    setPhotoIndex(i);
                    setLightboxOpen(true);
                  }}
                />
                  {i === 3 && (
                  <div
                    className="overlay"
                    onClick={() => {
                      setPhotoIndex(3);
                      setLightboxOpen(true);
                    }}
                  >
                    +{data.images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {data?.images?.length > 4 && (
          <div className="grid grid-4 ">
            {data.images.slice(0, 4).map((item: any, i: number) => (
              <div className="img-wrapper" key={i}>
                <img
                  src={item}
                  alt={`img-${i}`}
                  onClick={() => {
                    setPhotoIndex(i);
                    setLightboxOpen(true);
                  }}
                />
                {i === 3 && (
                  <div
                    className="overlay"
                    onClick={() => {
                      setPhotoIndex(3);
                      setLightboxOpen(true);
                    }}
                  >
                    +{data.images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Slider>

      {/* Fullscreen Lightbox */}
      {lightboxOpen && (
        <Lightbox
          mainSrc={data.images[photoIndex]}
          nextSrc={data.images[(photoIndex + 1) % data.images.length]}
          prevSrc={data.images[(photoIndex + data.images.length - 1) % data.images.length]}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + data.images.length - 1) % data.images.length)
          }
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % data.images.length)}
        />
      )}
    </>
  );
};

export default ImageGrid;
