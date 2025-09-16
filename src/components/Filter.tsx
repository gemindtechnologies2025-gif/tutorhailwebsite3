import * as React from "react";
import Box from "@mui/material/Box";
import TuneIcon from '@mui/icons-material/Tune';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from "dayjs";





const Filter = () => {
    const [age, setAge] = React.useState('');
    const yesterday = dayjs().subtract(1, 'day');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };

    return (
        <Box >
            {/* <div className="filter_wrp">
                <div className="filter_row">
                    <ul>
                        <li>
                            <h4><span><TuneIcon /></span>Filter</h4>
                        </li>
                        <li>
                            <FormControl fullWidth >
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={age}
                                    label="Age"
                                    onChange={handleChange}
                                    hiddenLabel
                                    displayEmpty
                                    sx={{
                                        height: 30,
                                        backgroundColor: '#EDEDED',
                                        border: 'none',
                                        borderRadius: '30px',
                                        paddingLeft: '10px', // optional for better alignment
                                        fontSize: '14px',    // optional
                                        '& .MuiSelect-select': {
                                            paddingTop: 0.5,
                                            paddingBottom: 0.5,
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>Ten</MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>

                        </li>
                        <li>
                            <FormControl fullWidth >

                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={age}
                                    label="Age"
                                    onChange={handleChange}
                                    hiddenLabel
                                    displayEmpty
                                    sx={{
                                        height: 30,
                                        backgroundColor: '#EDEDED',
                                        border: 'none',
                                        borderRadius: '30px',
                                        paddingLeft: '10px', // optional for better alignment
                                        fontSize: '14px',    // optional
                                        '& .MuiSelect-select': {
                                            paddingTop: 0.5,
                                            paddingBottom: 0.5,
                                        },
                                    }}
                                >
                                    <MenuItem value={0}>Ten</MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>

                        </li>
                        <li>
                            <FormControl fullWidth sx={{ height: 30 }}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={age}
                                    label="Age"
                                    onChange={handleChange}
                                    sx={{
                                        height: 30,
                                        backgroundColor: '#EDEDED',
                                        border: 'none',
                                        borderRadius: '30px',
                                        paddingLeft: '10px', // optional for better alignment
                                        fontSize: '14px',    // optional
                                        '& .MuiSelect-select': {
                                            paddingTop: 0.5,
                                            paddingBottom: 0.5,
                                        },
                                    }}
                                >
                                    <MenuItem value={0}>Ten</MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>

                        </li>
                        <li>
                            <FormControl fullWidth sx={{ height: 30 }}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={age}
                                    label="Age"
                                    onChange={handleChange}
                                    sx={{
                                        height: 30,
                                        backgroundColor: '#EDEDED',
                                        border: 'none',
                                        borderRadius: '30px',
                                        paddingLeft: '10px', // optional for better alignment
                                        fontSize: '14px',    // optional
                                        '& .MuiSelect-select': {
                                            paddingTop: 0.5,
                                            paddingBottom: 0.5,
                                        },
                                    }}
                                >
                                    <MenuItem value={0}>Ten</MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>

                        </li>
                        <li>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoItem label="">
                                    <DateTimePicker
                                        defaultValue={yesterday}
                                        disablePast
                                        views={['year', 'month', 'day', 'hours', 'minutes']}
                                        slotProps={{
                                            textField: {
                                                placeholder: 'Select date and time',
                                                InputProps: {
                                                    sx: {
                                                        height: 30,
                                                        backgroundColor: '#EDEDED',
                                                        borderRadius: '30px',
                                                        fontSize: '14px',
                                                        paddingLeft: '12px',
                                                        '& input': {
                                                            padding: 0,
                                                            textAlign: 'center', // Center the text
                                                        },
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </DemoItem>
                            </LocalizationProvider>
                        </li>
                        <li>
                            <FormControl fullWidth sx={{ height: 30 }}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={age}
                                    label="Age"
                                    onChange={handleChange}
                                    sx={{
                                        height: 30,
                                        backgroundColor: '#EDEDED',
                                        border: 'none',
                                        borderRadius: '30px',
                                        paddingLeft: '10px', // optional for better alignment
                                        fontSize: '14px',    // optional
                                        '& .MuiSelect-select': {
                                            paddingTop: 0.5,
                                            paddingBottom: 0.5,
                                        },
                                    }}
                                >
                                    <MenuItem value={0}>Ten</MenuItem>
                                    <MenuItem value={1}>Ten</MenuItem>
                                    <MenuItem value={2}>Twenty</MenuItem>
                                    <MenuItem value={3}>Thirty</MenuItem>
                                    <MenuItem value={4}>Thirty</MenuItem>
                                    <MenuItem value={5}>Thirty</MenuItem>
                                </Select>
                            </FormControl>

                        </li>
                    </ul>
                </div>
            </div> */}
        </Box>
    );
};

export default Filter;
