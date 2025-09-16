import * as React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const ContentLoader = () => {
  return (
    <Box sx={{ width: "100%" }}>
      {Array.from(new Array(4)).map((item, index) => (
        <>
          <Skeleton animation="pulse" height={50} />
          <Skeleton animation="pulse" height={30} />
          <Skeleton animation="pulse" height={50} />
        </>
      ))}
    </Box>
  );
};

export default ContentLoader;
