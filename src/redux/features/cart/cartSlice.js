import { createSlice } from "@reduxjs/toolkit";
import Swal  from "sweetalert2";

const initialState = {
    cartItems: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers:{
        addToCart: (state, action) => {
            const existingItem = state.cartItems.find(item => item.id === action.payload.id);
            if(!existingItem) {
                state.cartItems.push(action.payload)
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Product Added to the Cart",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                // Instead of warning, increment quantity
                existingItem.quantity += 1;
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Quantity increased in cart",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item.id !== action.payload.id)
        },
        clearCart: (state) => {
            state.cartItems = []
        }
    }
})

// export the actions   
export const {addToCart, removeFromCart, clearCart} = cartSlice.actions;
export default cartSlice.reducer;