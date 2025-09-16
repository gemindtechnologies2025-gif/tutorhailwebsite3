/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Paper,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddressDrawer from "../common/addressDrawer";
import {
  useDeleteAddressMutation,
  useGetAddressByIdQuery,
  useGetAddressQuery,
} from "../../../service/address";
import { showToast } from "../../../constants/toast";
import Loader from "../../../constants/Loader";

export default function ParentAddress() {
  const navigate = useNavigate(); // hook for the navigation

  // states
  const [open, setOpen] = React.useState(false); // state for the handling of the address drawer
  const [selectedId, setSelectedId] = useState<string>("");
  // api hooks
  const { data, isLoading, isSuccess, isError } = useGetAddressQuery({name:""});
  const {
    data: dataById,
    isError: error,
    isSuccess: success,
    isLoading: load,
  } = useGetAddressByIdQuery({ id: selectedId }, { skip: !selectedId });
  const [deleteAddress] = useDeleteAddressMutation();

  // function to delete address

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteAddress({ id }).unwrap();
      if (res?.statusCode === 200) {
        showToast("Address deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  // useEffect(() => {
  //   if (success && dataById) {
  //     // setOpen(true);
  //   }
  // }, [dataById, success]);

  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">
          <section className="uhb_spc pAddress_sc">
            <div className="conta_iner v2">
              <div className="role_head">
                <button
                  className="back_arrow"
                  onClick={() => navigate("/parent/search-result")}
                >
                  <img src={`/static/images/back.png`} alt="Back" />
                </button>
                <h1 className="hd_3">My Address</h1>
                <div className="rt_s">
                  <Button
                    onClick={() => {
                      setOpen(true);
                      setSelectedId("");
                    }}
                  >
                    <AddIcon /> Add New Address
                  </Button>
                </div>
              </div>
              <div className="role_body address_body">
                <h2>Saved Address</h2>
                <ul>
                  {isLoading &&
                    Array.from(new Array(3)).map((item, index) => (
                      <AddressSkeleton />
                    ))}
                  {isSuccess && data?.data?.address?.length
                    ? data?.data?.address?.map((item, index) => (
                      <li key={item?.id}>
                        <figure
                          onClick={() => {
                            toggleDrawer(true);
                          }}
                        >
                          <img
                            src={`/static/images/address_icon.svg`}
                            alt="Icon"
                          />
                        </figure>
                        <div className="cnt">
                          <h3>
                            {item?.addressType === 1
                              ? "Home address"
                              : item?.addressType === 2
                                ? "Office address"
                                : "Other address"}
                          </h3>
                          <p>
                            {item?.houseNumber || ""} ,{item?.city || ""},{" "}
                            {item?.country || ""}
                          </p>
                          <p>{item?.landMark || ""}</p>
                          {item?.parentId?.phoneNo && (
                            <p>
                              {item?.parentId?.phoneNo
                                ? `${item?.parentId?.countryISOCode}-${item?.parentId?.phoneNo}`
                                : null}
                            </p>
                          )}
                        </div>
                        <div className="rt_s">
                          <IconButton
                            className="roundIcon_btn"
                            onClick={() => {
                              setOpen(true)
                              setSelectedId(item?.id);
                            }}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            className="roundIcon_btn"
                            onClick={() => {
                              handleDelete(item?.id);
                            }}
                          >
                            <img
                              src={`/static/images/trash_icon.svg`}
                              alt="Icon"
                            />
                          </IconButton>
                        </div>
                      </li>
                    ))
                    : (
                      <div className="no_data">
                        <figure>
                          <img src="/static/images/noData.png" alt="no data found" />
                        </figure>
                        <p>No Address found</p>
                      </div>
                    )}
                </ul>
              </div>
            </div>
          </section>
        </main>
      </ParentLayout>

      <Drawer
        className="address_aside"
        anchor="right"
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedId("");
        }}
      >
        <AddressDrawer
          toggleDrawer={toggleDrawer}
          open={open}
          data={selectedId ? dataById?.data : null}
          setOpen={setOpen}
        />
      </Drawer>
    </>
  );
}
const AddressSkeleton = () => {
  return (
    <Paper
      elevation={1}
      sx={{
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "10px",
      }}
    >
      <Box display="flex" alignItems="center">
        <Skeleton variant="circular" width={24} height={24} />
        <Box ml={2}>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={200} height={20} />
          <Skeleton variant="text" width={150} height={20} />
        </Box>
      </Box>
      <Box>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} sx={{ ml: 1 }} />
      </Box>
    </Paper>
  );
};
