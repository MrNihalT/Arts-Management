import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyEvents() {
    const [myEvent, setMyEvent] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get("/participations/list/");

                console.log(res.data);

                setMyEvent(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div>
            {myEvent.map((event, index) => (
                <div key={index}>
                    <h1>{event.program}</h1>
                    <p>{event.arts_fest}</p>
                    <p>{event.academic_year}</p>
                    <p>{event.created_at}</p>
                    {event.team_members?.map((e, index) => {
                        return <p key={index}>{e}</p>;
                    })}
                </div>
            ))}
        </div>
    );
}
