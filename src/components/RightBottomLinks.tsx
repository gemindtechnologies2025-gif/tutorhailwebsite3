import React from 'react'

export const RightBottomLinks = () => {
    return (
        <>
            <section className="side_menu_wrap unlock_bg ">
                <div className="group">
                    <h4>Unlock Learning, Book Your Perfect Tutor Today!</h4>
                    <button>Book Now</button>
                </div>
                <figure>
                    <img src={`/static/images/unlock_men.png`} alt="unlock_men" />
                </figure>
            </section>
            <section className="side_menu_wrap  page_link">
                <ul>
                    <li>
                        <a>About Us</a>
                    </li>
                    <li>
                        <a>Contact Us</a>
                    </li>
                    <li>
                        <a>Help Center</a>
                    </li>
                    <li>
                        <a>Terms & conditions</a>
                    </li>
                    <li>
                        <a>Privacy Policy</a>
                    </li>
                    <li>
                        <a>FAQ’s</a>
                    </li>
                </ul>
            </section>
        </>
    )
}
export default RightBottomLinks;
