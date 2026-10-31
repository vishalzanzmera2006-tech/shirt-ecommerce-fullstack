import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: "wishlist",

    initialState: {
        items: [],
    },

    reducers: {
        setWishlist: (state, action) => {
            state.items = Array.isArray(action.payload) ? action.payload : [];
        },

        addWishlist: (state, action) => {
            state.items.push(action.payload);
        },

        removeWishlist: (state, action) => {
            const targetId = String(action.payload);
            state.items = state.items.filter((item) => {
                const prodId = String(item?.product?._id || item?.product || "");
                const wishDocId = String(item?._id || "");

                return prodId !== targetId && wishDocId !== targetId;
            });
        },

        clearWishlist: (state) => {
            state.items = [];
        },
    },
});

export const {
    setWishlist,
    addWishlist,
    removeWishlist,
    clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;