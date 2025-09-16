import { Box } from '@mui/material'
import React from 'react'
import StarIcon from '@mui/icons-material/Star';
import { useAppSelector } from '../hooks/store';
import { currencyMode, currencySymbol, selectCurrencyRates, selectCurrentCurrency } from '../reducers/currencySlice';
import { convertCurrency } from '../utils/currency';


export const ProfileCard = ({ data }: any) => {
    const currencyRates = useAppSelector(selectCurrencyRates);
    const currentCurrency = useAppSelector(selectCurrentCurrency);
    const currentCurrencyMode = useAppSelector(currencyMode);
    const currentCurrencySymbol = useAppSelector(currencySymbol);
    return (
        <>
            <Box sx={{ width: "100%" }}>
                <div className="card_mn profile_card">
                    <div className='profile_lt'>
                        <figure className={data?.isActive ?  'active_border':''   } >
                            <img src={data?.image || `/static/images/Emma2.png`} alt="" />
                            <figcaption>{data?.avgRating || 0} <StarIcon /></figcaption>
                        </figure>
                        <div>
                            <h2>{data?.name || "-"}</h2>
                            <p>{data?.userName || "-"} <span><button className='btn primary'>{data?.followers || 0} Followers</button></span></p>
                            <p className='exp'>Exp: {data?.teachingdetails?.totalTeachingExperience ? data?.teachingdetails?.totalTeachingExperience + " Years" : ''}</p>
                        </div>
                    </div>
                    <div className='profile_rt'>
                        <p>Price<span> {`${currentCurrencySymbol} ${convertCurrency({
                            price: data?.teachingdetails?.usdPrice
                                ? data?.teachingdetails?.usdPrice : 0,
                            rate: currencyRates[currentCurrency],
                        }).toLocaleString(`${currentCurrencyMode}`)}`
                        }
                            /hour</span></p>
                    </div>
                </div>
            </Box>
        </>
    )
}
