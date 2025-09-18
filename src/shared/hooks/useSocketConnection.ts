"use client";

import { useEffect } from "react";
import { socket } from "../socket";

export const useSocketConnection = () => {
  useEffect(() => {
    socket.connect();
  }, []);
};
