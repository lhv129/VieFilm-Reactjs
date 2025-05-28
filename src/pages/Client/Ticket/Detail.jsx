import { Helmet } from "react-helmet";
import { getOneByUser } from "@apis/ticketService";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import  TicketCard  from "@components/TicketCard/TicketCard";

function Detail() {

    const ticketId = useParams();
    const [ticket, setTicket] = useState([]);


    useEffect(() => {
        getOneByUser(ticketId).then((res) => {
            setTicket(res.data[0]);
        })
    },[]);

    return (
        <>
            <Helmet>
                <title>Chi tiết vé</title>
            </Helmet>
            <TicketCard ticketData={ticket} />
        </>
    )
}


export default Detail;