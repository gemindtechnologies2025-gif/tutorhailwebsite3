import { Box, Modal } from "@mui/material";

const Loader = (props: any) => {
  const style = {
    outline: "none",
  };
  return (
    <Box>
      {props.isLoad ? (
        <Modal open>
          <Box className="loader_loading" sx={style}>
            <figure>
              <img src="/static/images/loader.gif" alt="loading" />
            </figure>
          </Box>
        </Modal>
      ) : (
        ""
      )}
    </Box>
  );
};

export default Loader;
