"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import imgVisible from "@/images/olho.png";
import imgNotVisible from "@/images/visivel.png";

interface EyeProp {
  saleProfit?: string;
  isLogin: boolean;
  isVisible?: boolean;
  setIsVisible?: Dispatch<SetStateAction<boolean>>;
}

export function Eye({
  isVisible,
  setIsVisible,
  saleProfit,
  isLogin,
}: EyeProp) {
  const [isVisibleNotLogin, setIsVisibleNotLogin] = useState<boolean>(false);

  const updateEyeStateNotLogin = () => {
    if (isVisibleNotLogin) {
      setIsVisibleNotLogin(false);
    } else {
      setIsVisibleNotLogin(true);
    }
  };

  const updateEyeState = () => {
    if (setIsVisible) {
      if (isVisible) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    }
  };

  if (isLogin) {
    return isVisible ? (
      <>
        <div className="div-olho" onClick={updateEyeState}>
          <Image src={imgVisible} width={25} height={25} alt="" />
        </div>
        <div className="div-resultado">{saleProfit}</div>
      </>
    ) : (
      <>
        <div className="div-olho" onClick={updateEyeState}>
          <Image src={imgNotVisible} width={25} height={25} alt="" />
        </div>
      </>
    );
  } else {
    return isVisibleNotLogin ? (
      <div className="container-lucro">
        <div className="div-resultado">{saleProfit}</div>
        <div className="div-olho" onClick={updateEyeStateNotLogin}>
          <Image src={imgVisible} width={25} height={25} alt="" />
        </div>
      </div>
    ) : (
      <div className="container-lucro">
        <div>• • • • • • • •</div>
        <div className="div-olho" onClick={updateEyeStateNotLogin}>
          <Image src={imgNotVisible} width={25} height={25} alt="" />
        </div>
      </div>
    );
  }
}
