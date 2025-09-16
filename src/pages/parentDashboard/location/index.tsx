import React, { useEffect, useState } from 'react'
import { ParentLayout } from '../../../layout/parentLayout'
import NewSideBarParent from '../../../components/NewSideBarParent'
import { MyAddress } from '../../../components/MyAddress'
import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material'
import { useAddAddressMutation, useGetAddressByIdQuery, useUpdateAddressMutation } from '../../../service/address'
import { getFromStorage } from '../../../constants/storage'
import { STORAGE_KEYS } from '../../../constants/storageKeys'
import { useFormik } from "formik";
import * as Yup from "yup";
import { showError, showToast } from '../../../constants/toast'
import { Autocomplete, GoogleMap, MarkerF } from '@react-google-maps/api'

export const Location = () => {

    const [autocomplete, setAutocomplete] = useState(null);
    // const [data, setData] = useState<any>({});
    const [id, setId] = useState<string>("");

    //API Hook
    const [addAddress] = useAddAddressMutation(); // hook to add address
    const [updateAddress] = useUpdateAddressMutation();
    const token: any = getFromStorage(STORAGE_KEYS.token);
    const [open1, setOpen1] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const handleClose = () => {
        setOpen1(false);
    };
    const [data, setData] = useState<any>({});

    const {
        data: byIdData,
        isError: error,
        isSuccess: success,
        isLoading: load,
    } = useGetAddressByIdQuery({ id: id }, { skip: !id });

    // loading fucntion for the google places api
    const onLoad = (autocompleteObj: any) => {
        setAutocomplete(autocompleteObj);
    };
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
            console.log(body, "body");
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
                        formik.resetForm();
                        // toggleDrawer(false);
                        setData({});
                        setIsLoading(false)
                        setId("");
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
                        formik.resetForm();
                        showToast("Address added successfully");
                    }
                } catch (error: any) { setIsLoading(false) }
            }
        },
    });

    useEffect(() => {
        if (success) {
            setData(byIdData?.data)
        }
    }, [success])

    return (
        <ParentLayout className="role-layout loc_wrap">
            <main className="content">
                <section className="uh_spc pfd_wrp home_wrp ">
                    <div className="conta_iner v2">
                        <div className="gap_m grid_2">
                            <NewSideBarParent />
                            <div className=' address_crd '>
                                <MyAddress id={id} setId={setId} />
                            </div>
                            <div className='loc_maps sidebar_rt'>
                                <GoogleMap
                                    mapContainerClassName="map_container"
                                    center={{
                                        lat: formik.values.latitude,
                                        lng: formik.values.longitude,
                                    }}
                                    zoom={10}>
                                    <MarkerF
                                        position={{
                                            lat: formik.values.latitude,
                                            lng: formik.values.longitude,
                                        }}
                                    />
                                </GoogleMap>

                                <div className='loc_maps_inner'>
                                    <div className='adress_fdx'>
                                        <figure><img src={'/static/images/location.svg'} alt="location" /></figure>
                                        <div >
                                            <h2>Address</h2>
                                            <p>
                                                {[formik.values.houseNo, formik.values.city, formik.values.country]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </p>
                                        </div>
                                    </div>

                                    <form onSubmit={formik.handleSubmit}>
                                        <div className='form_control'>
                                            <label htmlFor="">House / Flat / Block No.</label>
                                            <TextField
                                                name="houseNo"
                                                id="standard-basic"
                                                variant="standard"
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
                                                helperText={formik.touched.houseNo && formik.errors.houseNo as string}
                                            ></TextField>
                                        </div>
                                        <div className="form_control ">
                                            <label>Country</label>
                                            <TextField
                                                id="standard-basic"
                                                name="country"
                                                variant="standard"
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
                                                helperText={formik.touched.country && formik.errors.country as string}
                                            ></TextField>
                                        </div>
                                        <Autocomplete
                                            onLoad={onLoad}
                                            onPlaceChanged={() => onPlaceChanged()}
                                        >
                                            <div className="form_control">
                                                <label>City</label>
                                                <TextField
                                                    id="standard-basic"
                                                    variant="standard"
                                                    name="city"
                                                    value={formik.values.city}
                                                    fullWidth
                                                    hiddenLabel
                                                    placeholder="Enter City Name"
                                                    onBlur={formik.handleBlur}
                                                    helperText={formik.touched.city && formik.errors.city as string}
                                                    onChange={formik.handleChange}
                                                ></TextField>
                                            </div>
                                        </Autocomplete>
                                        <div className='form_control'>
                                            <label htmlFor="">Landmark</label>
                                            <TextField
                                                id="standard-basic"
                                                variant="standard"
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
                                                helperText={formik.touched.landMark && formik.errors.landMark as string}
                                                placeholder="Enter Landmark"
                                            ></TextField>
                                        </div>
                                        <div className="control_group btm_radio_fdx">
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

                                        <div className='map_btn'>
                                            <button className='btn primary' type='submit'>Add New Address</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </ParentLayout>
    )
}
