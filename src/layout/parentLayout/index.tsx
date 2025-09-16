import { Dispatch, SetStateAction } from "react";
import ParentHeader from "./header";

export const ParentLayout = ({ className = '', children,search,setSearch }: { className?: string, children: React.ReactNode ,search?:string,setSearch?:SetStateAction<Dispatch<string>>}) => {
    return (
        <>
            <div className={`${className}`}>
                <ParentHeader search={search} setSearch={setSearch} zoom={false}/>
                {children}
            </div>
        </>
    );
};
