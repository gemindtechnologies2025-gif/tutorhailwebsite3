import { Modal, Radio, RadioGroup, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import CURRENCY from "../constants/Currency";
import { useAppDispatch, useAppSelector } from "../hooks/store";
import { selectCurrentCurrency, setCurrencyMode, setCurrencySymbol, setCurrentCurrency } from "../reducers/currencySlice";
import { useGetGiftsQuery } from "../service/socialLinks";
import { Widgets } from "@mui/icons-material";

interface GradesProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id: string
}

export default function GiftsListingModal({
    open,
    onClose,
    setOpen,
    id
}: GradesProps) {
    const [page, setPage] = useState(1);
    const observerRef = useRef<any | null>(null)
    const [hasNextPage, setHasNextPage] = useState<boolean>(true)
    const { data, isLoading, isSuccess, isFetching } = useGetGiftsQuery({ id: id, page: page, limit: 10 }, { skip: !id || !open });
    const [data1, setData1] = useState<any>([])
    console.log(data?.data, 'data1');

    const lastElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isLoading || isFetching) return;

            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasNextPage) {
                        setPage((prev) => prev + 1);
                    }
                },
                {
                    threshold: 0.5,      // fire when 50% visible
                    rootMargin: "100px", // preload earlier
                }
            );

            if (node) observerRef.current.observe(node);
        },
        [isLoading, isFetching, hasNextPage]
    );


    useEffect(() => {
        if (isSuccess && data?.data?.gift?.data) {

            setData1((prev: any) => {
                const newData = page === 1
                    ? [...data.data.gift.data]  // fresh load
                    : [...prev, ...data.data.gift.data]; // append for infinite scroll

                const unique = Array.from(
                    new Map(newData.map(item => [item._id, item])).values()
                );

                return unique;
            });
        }

        if (data?.data?.gift?.data?.length === 0) {
            setHasNextPage(false);
        }
    }, [isSuccess, data, page]);


    return (
        <Modal
            className="modal setup_modal"
            id="gradesModal"
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={open}
            onClose={onClose}
        >
            <div className="modal-dialog">
                <div className="modal-body scroll">
                    <div className="btn-close">
                        <CloseIcon onClick={() => setOpen(false)} />
                    </div>
                    <h2>Gifts</h2>
                <p className="total-sum">Total: ${data?.data?.giftAmount}</p>
                    <ul className="gift_list">
                        {data1?.length ? (
                            data1?.map((item: any, index: number) => {
                                return (
                                    <li key={item?._id}>
                                            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                                    <img style={{maxWidth:"30px",borderRadius:"30px"}} src={item?.user?.image} alt='img' />
                                            <p>{item?.user?.name}</p>
                                            </div>
                                             <p>${item?.amount}</p>
                                    </li>
                                )
                            })
                        ) : "No Gift Found"}

                    </ul>
                </div>
            </div>
        </Modal>
    );
}
