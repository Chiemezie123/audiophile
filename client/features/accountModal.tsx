import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from "react";
import { accountModalData } from "@/constants/data";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AccountModal = ({onClose}: {onClose: () => void}) => {
  const modalRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !(modalRef.current as HTMLElement).contains(event.target as Node)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  return (
    <div ref={modalRef} className="w-[206px] h-[240px] bg-white ">
      <div className="w-full h-[78px] p-4">
        <Button className="w-full" onClick={() => router.push("/signup")}>
          signup
        </Button>
      </div>
      <div className="w-full flex flex-col ">
        {accountModalData.map((item, index) => (
          <div
            key={index}
            className="w-full flex items-center gap-2 p-4 cursor-pointer"
            onClick={() => router.push(item.href)}
          >
            <Image src={item.imgSrc} alt={item.alt} width={20} height={20} />
            <p className=" capitalize text-black text-[16px] font-semibold ">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountModal;
