import * as React from "react";
import Box from "@mui/material/Box";
import { Input } from "@mui/material";
import WestIcon from '@mui/icons-material/West';

const Feed = () => {
    return (
        <Box sx={{ width: "100%" }}>
            <div className="card_mn">
                <div className="title_sb">
                    <h2>Add to your feed</h2>
                </div>
                <div className="mn_lyout">
                    <div className="input_group">
                        <Input className="form_control" placeholder="Search" />
                    </div>
                    <ul className="chat_list feed_list">
                        <li>
                            <div>
                                <figure>
                                    <img src={`/static/images/emili.png`} alt="emili" />
                                </figure>
                                <div>
                                    <p>Amelia Bell <span>Lorem Ipsum is simply dummy text</span></p>
                                    <button className="btn transparent">Follow</button>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div>
                                <figure>
                                    <img src={`/static/images/emili.png`} alt="emili" />
                                </figure>
                                <div>
                                    <p>Amelia Bell <span>Lorem Ipsum is simply dummy text</span></p>
                                    <button className="btn transparent">Follow</button>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div>
                                <figure>
                                    <img src={`/static/images/emili.png`} alt="emili" />
                                </figure>
                                <div>
                                    <p>Amelia Bell <span>Lorem Ipsum is simply dummy text</span></p>
                                    <button className="btn transparent">Follow</button>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div>
                                <figure>
                                    <img src={`/static/images/emili.png`} alt="emili" />
                                </figure>
                                <div>
                                    <p>Amelia Bell <span>Lorem Ipsum is simply dummy text</span></p>
                                    <button className="btn transparent">Follow</button>
                                </div>
                            </div>
                        </li>
                        <a className="view_link">View all recommendations <span><WestIcon /></span> </a>
                    </ul>


                </div>
            </div>


        </Box>
    );
};

export default Feed;
