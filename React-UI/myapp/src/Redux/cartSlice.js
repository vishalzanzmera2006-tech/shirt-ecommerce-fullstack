import { createSlice } from "@reduxjs/toolkit";

// Helper function jo safely ID nikalta hai
const getProductId = (productObj) => {
    if (!productObj) return null;
    return typeof productObj === "object" ? (productObj._id || productObj.id) : productObj;
};

const cartSlice = createSlice({
    name: "cart",

    initialState: {
        items: [],
    },

    reducers: {
        setCart: (state, action) => {
            state.items = Array.isArray(action.payload) ? action.payload : [];
        },

        addCart: (state, action) => {
            const newItem = action.payload;
            if (!newItem) return;

            const newProdId = getProductId(newItem.product) || newItem._id;
            const newSize = newItem.size;

            const existingItem = state.items.find((item) => {
                const existingProdId = getProductId(item.product) || item._id;
                const sizeMatch = newSize ? item.size === newSize : true;
                return String(existingProdId) === String(newProdId) && sizeMatch;
            });

            if (existingItem) {
                if (newItem.quantity) {
                    existingItem.quantity = newItem.quantity;
                } else {
                    existingItem.quantity = Number(existingItem.quantity || 1) + 1;
                }
            } else {
                state.items.push(newItem);
            }
        },

        removeCart: (state, action) => {
            state.items = state.items.filter(
                (item) => String(item._id) !== String(action.payload)
            );
        },

        clearCart: (state) => {
            state.items = [];
            state.cartItems = []; 
            state.totalQuantity = 0;
            state.totalAmount = 0;

            localStorage.removeItem("cart");
            localStorage.removeItem("cartItems");
        },
    },
});

export const { setCart, addCart, removeCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;