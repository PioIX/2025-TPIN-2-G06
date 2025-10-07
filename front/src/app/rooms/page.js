"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import Button from "@/components/Button";

export default function Chat() {
    const { socket, isConnected } = useSocket();
    const [ id,setId ]= useState()

    useEffect(() => {
        if (!socket) return;
    }, [socket]);

    function entrarRoom(event){
        socket.emit("entrarPartida",{room: event.target.value, id:id})
    }

    return (
        <>
            <Button text={"1"} value={1} onClick={entrarRoom}></Button>
            <Button text={"ID 5"} value={5} onClick={(event)=>setId(event.target.value)}></Button>
            <Button text={"ID 6"} value={6} onClick={(event)=>setId(event.target.value)}></Button>
            <Button text={"ID 7"} value={7} onClick={(event)=>setId(event.target.value)}></Button>
        </>
    )
};