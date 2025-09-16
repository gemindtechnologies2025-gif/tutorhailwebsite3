import * as React from "react";
import Box from "@mui/material/Box";
import { Input } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const Chatbar = () => {
    return (
        <Box sx={{ width: "100%" }}>
            <div className="card_mn">
                <div className="title_sb">
                    <h2>Chat</h2>
                </div>
                <div className="mn_lyout">
                    <div className="input_group">
                        <Input className="form_control" placeholder="Search" />
                    </div>
                    <ul className="chat_list">
                        <li>
                            <div>
                                <figure>
                                    <img src={`/static/images/emili.png`} alt="emili" />
                                </figure>
                                <p>Amelia Bell <span>Lorem Ipsum is simply dummy text</span></p>
                            </div>
                            <KeyboardArrowRightIcon />
                            <pre>05:19 PM</pre>
                        </li>
                        <li>
                            <div>
                                <figure>
                                    <img src={`/static/images/emili.png`} alt="emili" />
                                </figure>
                                <p>Amelia Bell <span>Lorem Ipsum is simply dummy text</span></p>
                            </div>
                            <KeyboardArrowRightIcon />
                            <pre>05:19 PM</pre>

                        </li>
                        <li>
                            <div>
                                <figure>
                                    <img src={`/static/images/emili.png`} alt="emili" />
                                </figure>
                                <p>Amelia Bell <span>Lorem Ipsum is simply dummy text</span></p>
                            </div>
                            <KeyboardArrowRightIcon />
                            <pre>05:19 PM</pre>

                        </li>
                        <li>
                            <div>
                                <figure>
                                    <img src={`/static/images/emili.png`} alt="emili" />
                                </figure>
                                <p>Amelia Bell <span>Lorem Ipsum is simply dummy text</span></p>
                            </div>
                            <KeyboardArrowRightIcon />
                            <pre>05:19 PM</pre>

                        </li>
                        <li>
                            <div>
                                <figure>
                                    <img src={`/static/images/emili.png`} alt="emili" />
                                </figure>
                                <p>Amelia Bell <span>Lorem Ipsum is simply dummy text</span></p>
                            </div>
                            <KeyboardArrowRightIcon />
                            <pre>05:19 PM</pre>

                        </li>
                        <li>
                            <div>
                                <figure>
                                    <img src={`/static/images/emili.png`} alt="emili" />
                                </figure>
                                <p>Amelia Bell <span>Lorem Ipsum is simply dummy text</span></p>
                            </div>
                            <KeyboardArrowRightIcon />
                            <pre>05:19 PM</pre>

                        </li>
                        <li>
                            <div>
                                <figure>
                                    <img src={`/static/images/emili.png`} alt="emili" />
                                </figure>
                                <p>Amelia Bell <span>Lorem Ipsum is simply dummy text</span></p>
                            </div>
                            <KeyboardArrowRightIcon />
                            <pre>05:19 PM</pre>

                        </li>
                        <li>
                            <div>
                                <figure>
                                    <img src={`/static/images/emili.png`} alt="emili" />
                                </figure>
                                <p>Amelia Bell <span>Lorem Ipsum is simply dummy text</span></p>
                            </div>
                            <KeyboardArrowRightIcon />
                            <pre>05:19 PM</pre>

                        </li>
                        <li>
                            <div>
                                <figure>
                                    <img src={`/static/images/emili.png`} alt="emili" />
                                </figure>
                                <p>Amelia Bell <span>Lorem Ipsum is simply dummy text</span></p>
                            </div>
                            <KeyboardArrowRightIcon />
                            <pre>05:19 PM</pre>

                        </li>
                        <li>
                            <div>
                                <figure>
                                    <img src={`/static/images/emili.png`} alt="emili" />
                                </figure>
                                <p>Amelia Bell <span>Lorem Ipsum is simply dummy text</span></p>
                            </div>
                            <KeyboardArrowRightIcon />
                            <pre>05:19 PM</pre>

                        </li>


                    </ul>
                </div>
            </div>
        </Box>
    );
};

export default Chatbar;
