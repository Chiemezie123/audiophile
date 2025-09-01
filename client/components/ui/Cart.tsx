import React from "react";
import SizeInputHandler from "./sizeInputHandler";
import { Button } from "./button";

const Cart = () => {
  return (
    <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.4)] w-full h-full z-100">
      <div className="xs:max-w-[327px] md:max-w-[689px] lg:max-w-[1110px] mx-auto relative">
        <div className="absolute xs:top-26 lg:top-30.5 right-0 bg-white xs:w-full md:w-[377px]  p-6 rounded-lg shadow-lg">
          {/* <h2 className="text-xl font-semibold mb-4">Modal Title</h2>
          <p className="mb-4">This is the content of the modal.</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Close
          </button> */}
          <div className="flex items-center justify-between">
            <h2 className="h5 font-Bold">Cart (3)</h2>
            <h6 className="underline cursor-pointer">Remove all</h6>
          </div>
          <div>
            <div className="flex items-center justify-between"><p>Item 1</p>
            <SizeInputHandler /></div>
            <div className="flex items-center justify-between"><p>Item 2</p>
            <SizeInputHandler /></div>
            <div className="flex items-center justify-between"><p>Item 3</p>
            <SizeInputHandler /></div>
          </div>
          <div className="flex items-center justify-between">
            <p>Total</p>
            <p>$ 5,396</p>
          </div>
          <Button className="w-full">Checkout</Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
