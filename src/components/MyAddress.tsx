import { Box } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { useDeleteAddressMutation, useGetAddressQuery } from '../service/address';
import { showToast } from '../constants/toast';

type props = {
    id: string;
    setId: Dispatch<SetStateAction<string>>;
}

export const MyAddress = ({ id, setId }: props) => {

    const {
        data: address,
        isLoading: load,
        isSuccess: success,
        isError: error,
    } = useGetAddressQuery({ name: "" });
    const [deleteAddress] = useDeleteAddressMutation();

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

    console.log(address?.data?.address, "address");

    return (
        <>
            <Box>
                <ul className='cmn_crd_wp gap_m '>
                    {address?.data?.address?.length ? (
                        address?.data?.address?.map((item: any, index) => {
                            return (
                                <li className='home_ad' key={index}>
                                    <div >
                                        <figure><img src={'/static/images/location.svg'} alt="location" /></figure>
                                        <div className='adress_cntnt'>
                                            <h4>  {item?.addressType === 1
                                                ? "Home Address"
                                                : item?.addressType === 2
                                                    ? "Office Address"
                                                    : "Other Address"}</h4>
                                            <p className='ad_txt'>{item?.houseNumber || ""}&nbsp;
                                                {item?.city || ""}{" "}
                                                {item?.country || ""} </p>
                                            <p>{item?.parentId?.phoneNo
                                                ? `${item?.parentId?.dialCode}-${item?.parentId?.phoneNo}`
                                                : null}</p>
                                        </div>

                                        <div className='icon_btm_flx'>
                                            <button className='btn primary' onClick={() => id == item?._id ? setId("") : setId(item?._id)}>{id == item?._id ? "Cancel" : "Edit"}</button>
                                            <img onClick={() => {
                                                handleDelete(item?.id);
                                            }} src={`/static/images/trash.svg`} alt="trash" />
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    ) : ("No Address Found")}


                </ul>
            </Box>
        </>
    )
}


