import React from 'react';

type props = {
    name: string,
    isActive: boolean
    onClick?:any;
}

export const TabCard = ({ name, isActive,onClick }: props) => {
    return (

        <li onClick={onClick} className={isActive ? 'green' : 'simple'} >{name || "Subject"}</li>


    )
}
