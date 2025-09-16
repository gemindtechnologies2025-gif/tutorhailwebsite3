import { Box, Input, ToggleButton, ToggleButtonGroup } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AddIcon from '@mui/icons-material/Add';




export const BookingDateTime = () => {
    const [alignment, setAlignment] = React.useState('left');

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setAlignment(newAlignment);
    };
    const children = [
        <ToggleButton value="left" key="left">
            Online
        </ToggleButton>,

        <ToggleButton value="right" key="right">
            Offline
        </ToggleButton>,

    ];
    const control = {
        value: alignment,
        onChange: handleChange,
        exclusive: true,
    };

    return (
        <>
            <Box sx={{ width: "100%" }}>
                <div className='bkng_mn_bg'>
                    <div className='booking_scs'>
                        <div className='title_fdx'>
                            <h2>Booking Date & Time</h2>
                            <div className='btn_groups'>
                                <ToggleButtonGroup size="small" {...control} aria-label="Small sizes">
                                    {children}
                                </ToggleButtonGroup>
                            </div>
                        </div>
                        <ul className='cal_fdx'>
                            <li>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoItem >
                                        <DatePicker defaultValue={dayjs('2022-04-17')} />
                                    </DemoItem>
                                </LocalizationProvider>
                            </li>
                            <li>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoItem   >
                                        <MobileTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
                                    </DemoItem>
                                </LocalizationProvider>
                            </li>
                            <li>
                                <button className='btn primary'> <span><ControlPointIcon /></span> Add More</button>
                            </li>
                        </ul>
                    </div>

                    <div className=' sub_list ut_spc home_wrp ' >
                        <div className="title_fdx">
                            <h2>Select Subject</h2>
                        </div>

                        <ul className="cstmm_tabs ">
                            <li className="green">English</li>
                            <li className="simple">Math</li>
                            <li className="simple">Science</li>
                            <li className="simple">Biology</li>
                            <li className="simple">Physics</li>
                        </ul>
                    </div>

                    <div className=' sub_list ut_spc home_wrp ' >
                        <div className="title_fdx">
                            <h2>Select Level</h2>
                        </div>

                        <ul className="cstmm_tabs ">
                            <li className="green">Primary</li>
                            <li className="simple">Middle School (O-Level) </li>
                            <li className="simple">High School (O-Level) </li>
                        </ul>
                    </div>
                    <div className=' sub_list ut_spc'>
                        <div className="title_fdx">
                            <h2>What would you want to learn today?</h2>
                        </div>
                        <div className='input_group'>
                            <Input className="form_control" />
                        </div>
                    </div>
                    <div className=' sub_list ut_spc'>
                        <div className="title_fdx">
                            <h2>Additional Information</h2>
                        </div>
                        <div className='input_group'>
                            <Input className="form_control" />
                        </div>
                    </div>

                    <div className=' sub_list ut_spc'>
                        <div className="title_fdx">
                            <h2>Select Address</h2>
                        </div>
                        <ul className='address_mn ut_spc'>
                            <li>
                                <h4>Home Address 1</h4>
                                <p>3711 Spring Downtown New York, United States
                                    (555) 123-4567</p>
                            </li>
                            <li>
                                <h4>Home Address 1</h4>
                                <p>3711 Spring Downtown New York, United States
                                    (555) 123-4567</p>
                            </li>
                            <li>
                                <AddIcon />
                                <p>Add New Address</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </Box>
        </>

    )
}

export default BookingDateTime;
