"use client";

import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import LoadingLogo from "@/components/LoadingLogo";
import "@/styles/card.css";

export default function Logout() {
  const key = "login-token";
  const router = useRouter();

  useEffect(() => {
    Cookies.remove(key);

    setTimeout(() => {
      router.push("/");
    }, 2000);
  }, [key, router]);

  return (
    <div>
      <LoadingLogo description="Saindo" />
    </div>
  );
}
