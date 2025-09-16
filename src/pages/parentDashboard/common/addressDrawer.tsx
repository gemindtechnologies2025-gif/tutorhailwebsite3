/* eslint-disable jsx-a11y/img-redundant-alt */
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GoogleMap, Autocomplete, MarkerF } from "@react-google-maps/api";
import {
  useAddAddressMutation,
  useUpdateAddressMutation,
} from "../../../service/address";
import { showError, showToast } from "../../../constants/toast";
import { Address } from "../../../types/General";
import { getFromStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import LoginAlertModal from "../../../Modals/LoginAlertModal";
import { log } from "console";
import { isString } from "../../../utils/validations";
import Loader from "../../../constants/Loader";

export default function AddressDrawer({
  toggleDrawer,
  open,
  data,
  setOpen,
}: {
  toggleDrawer: any;
  open?: boolean;
  data?: Address | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [autocomplete, setAutocomplete] = useState(null); // state to store the autocomplete for the google places api

  //API Hook
  const [addAddress] = useAddAddressMutation(); // hook to add address
  const [updateAddress] = useUpdateAddressMutation();
  const token: any = getFromStorage(STORAGE_KEYS.token);
  const [open1, setOpen1] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const handleClose = () => {
    setOpen1(false);
  };

  // loading fucntion for the google places api
  const onLoad = (autocompleteObj: any) => {
    setAutocomplete(autocompleteObj);
  };

  // Function to listen the google places api changes

  const onPlaceChanged = async () => {
    if (autocomplete) {
      let place = await (autocomplete as any).getPlace();

      if (place && place.address_components) {
        let address = place.address_components;

        let state,
          city,
          country,
          zip = "";

        address.forEach(function (component: any) {
          let types = component.types;

          if (
            types.indexOf("locality") > -1 ||
            types.indexOf("administrative_area_level_3") > -1
          ) {
            city = component.long_name;
          }
          if (types.indexOf("postal_code") > -1) {
            zip = component.long_name;
          }
          if (types.indexOf("administrative_area_level_1") > -1) {
            state = component?.long_name || "";
          }
          if (types.indexOf("country") > -1) {
            country = component?.long_name || "";
          }
        });
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();
        // captureSatelliteView(lat, lng);
        formik.setFieldValue("country", `${country}`);
        formik.setFieldValue("city", city);
        formik.setFieldValue("latitude", lat || "");
        formik.setFieldValue("longitude", lng || "");
      }
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      houseNo: data?.houseNumber || "",
      city: data?.city || "",
      country: data?.country || "",
      landMark: data?.landMark || "",
      latitude: data?.latitude || 30.0444,
      longitude: data?.longitude || 31.2357,
      type: data?.addressType || "",
    },
    validationSchema: Yup.object({
      houseNo: Yup.string().required("House No is required"),
      city: Yup.string().required("City Name is required"),
      country: Yup.string().required("Country Name is required"),
      landMark: Yup.string().required("Landmark is required"),
      type: Yup.string().required("Please select address type"),
    }),
    onSubmit: async (values) => {
      let body = {
        houseNumber: values.houseNo,
        city: values.city,
        country: values.country,
        addressType: values.type,
        landMark: values?.landMark,
        latitude: values?.latitude,
        longitude: values?.longitude,
      };

      if (!token) {
        // setOpen(false);
        setOpen1(true);
        return;
      }

      setIsLoading(true)
      if (data?.id) {
        try {
          const res = await updateAddress({ body, id: data?.id }).unwrap();
          if (res?.statusCode === 200) {
            // toggleDrawer(false);
            setIsLoading(false)
            setOpen(false);
            formik.resetForm();
            showToast("Address updated successfully");
          }
        } catch (error: any) {
          setIsLoading(false)
          showError(error?.data?.message || "Something went wrong")
        }
      } else {
        try {
          const res = await addAddress({ body }).unwrap();
          setIsLoading(false)
          if (res?.statusCode === 200) {
            setOpen(false);
            formik.resetForm();
            showToast("Address added successfully");
          }
        } catch (error: any) { setIsLoading(false) }
      }
    },
  });

  return (
    <>
      <Box className="address_inner" role="presentation">
        <Loader isLoad={isLoading} />
        <div className="map">
          <GoogleMap
            mapContainerClassName="map_container"
            center={{
              lat: formik.values.latitude,
              lng: formik.values.longitude,
            }}
            zoom={10}
          >
            <MarkerF
              position={{
                lat: formik.values.latitude,
                lng: formik.values.longitude,
              }}
            />
          </GoogleMap>
        </div>
        <form onSubmit={formik.handleSubmit} className="form">
          <div className="gap_p">
            <div className="control_group w_100">
              <label>House/ Flat No.</label>
              <TextField
                className="text_field"
                name="houseNo"
                value={formik.values.houseNo}
                fullWidth
                hiddenLabel
                placeholder="Enter House/ Flat No."
                onChange={(val) => {
                  if (
                    val.target.value === " " ||
                    val.target.value === "."
                  ) {
                  } else {
                    formik.handleChange(val);
                  }
                }}
                helperText={formik.touched.houseNo && formik.errors.houseNo}
              ></TextField>
            </div>
            <Autocomplete
              onLoad={onLoad}
              onPlaceChanged={() => onPlaceChanged()}
            >
              <div className="control_group w_100">
                <label>City</label>
                <TextField
                  className="text_field"
                  name="city"
                  value={formik.values.city}
                  fullWidth
                  hiddenLabel
                  placeholder="Enter City Name"
                  onBlur={formik.handleBlur}
                  helperText={formik.touched.city && formik.errors.city}
                  onChange={formik.handleChange}
                ></TextField>
              </div>
            </Autocomplete>
            <div className="control_group w_100">
              <label>Country</label>
              <TextField
                className="text_field"
                name="country"
                value={formik.values.country}
                fullWidth
                hiddenLabel
                onChange={(val) => {
                  if (
                    val.target.value === " " ||
                    val.target.value === "."
                  ) {
                  } else {
                    formik.handleChange(val);
                  }
                }}
                placeholder="Enter Country Name"
                helperText={formik.touched.country && formik.errors.country}
              ></TextField>
            </div>
            <div className="control_group w_100">
              <label>Landmark</label>
              <TextField
                className="text_field"
                name="landMark"
                value={formik.values.landMark}
                fullWidth
                hiddenLabel
                onChange={(val) => {
                  if (
                    val.target.value === " " ||
                    val.target.value === "."
                  ) {
                  } else {
                    formik.handleChange(val);
                  }
                }}
                helperText={formik.touched.landMark && formik.errors.landMark}
                placeholder="Enter Landmark"
              ></TextField>
            </div>
            <div className="control_group w_100">
              <label>Select Subject </label>
              <RadioGroup
                className="checkbox_label"
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="address"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
              >
                <FormControlLabel value={1} control={<Radio />} label="Home" />
                <FormControlLabel value={2} control={<Radio />} label="Work" />
                <FormControlLabel value={3} control={<Radio />} label="Other" />
              </RadioGroup>
              {formik.touched.type && formik.errors.type && (
                <span className="error">Address type is required</span>
              )}
            </div>
          </div>
          <div className="form_btn">
            <Button
              variant="outlined"
              color="primary"
              onClick={toggleDrawer(false)}
            >
              Cancel
            </Button>
            <Button
              // onClick={() => {
              //   if (!token) {
              //     setOpen(false);
              //     setOpen1(true);
              //     return;
              //   }
              // }}
              type="submit"
            >
              Save Address
            </Button>
          </div>
        </form>
      </Box>
      <LoginAlertModal
        open={open1}
        setOpen={setOpen1}
        onClose={handleClose}
        msg="Please login before adding a address"
      />
    </>
  );
}
