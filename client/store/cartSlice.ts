import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type CartItem = {
  productSlug: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  hydrated: boolean;
};

const initialState: CartState = {
  items: [],
  hydrated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.hydrated = true;
    },
    addToCart: (
      state,
      action: PayloadAction<{ productSlug: string; quantity: number }>
    ) => {
      const existingItem = state.items.find(
        (item) => item.productSlug === action.payload.productSlug
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({
          productSlug: action.payload.productSlug,
          quantity: action.payload.quantity,
        });
      }
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ productSlug: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (entry) => entry.productSlug === action.payload.productSlug
      );

      if (!item) {
        return;
      }

      if (action.payload.quantity <= 0) {
        state.items = state.items.filter(
          (entry) => entry.productSlug !== action.payload.productSlug
        );
        return;
      }

      item.quantity = action.payload.quantity;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productSlug !== action.payload
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export type { CartItem, CartState };
export default cartSlice.reducer;
