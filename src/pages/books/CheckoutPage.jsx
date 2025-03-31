import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';

const CheckoutPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const totalPrice = parseFloat(
        cartItems.reduce((acc, item) => {
            // Use newPrice if available, otherwise use price
            const itemPrice = item.newPrice || item.price || 0;
            return acc + itemPrice * (item.quantity || 1);
        }, 0).toFixed(2)
    );
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();
    const [isChecked, setIsChecked] = useState(false);
    const sanitizeInput = (input) => {
        return input.trim();  // Loại bỏ khoảng trắng ở đầu và cuối chuỗi
    };
    
    const onSubmit = async (data) => {
        console.log("Dữ liệu gửi đi:", data); // Kiểm tra xem dữ liệu có hợp lệ không
        
        // Lấy danh sách ID sản phẩm và kiểm tra nếu có _id
        const productIds = cartItems.map(item => {
            // Use _id if available, otherwise fall back to id
            const productId = item._id || item.id;
            
            if (!productId) {
                console.error("Sản phẩm thiếu id:", item);
            }
            return productId; // Return whichever ID is available
        }).filter(id => id);  // Lọc những ID hợp lệ
    
        // Kiểm tra xem có sản phẩm nào trong giỏ hàng không
        if (productIds.length === 0) {
            Swal.fire({
                title: "Error",
                text: "No products in cart or missing product IDs!",
                icon: "error",
                confirmButtonColor: "#d33",
            });
            return;
        }
    
        // In ra thông tin giỏ hàng và ID sản phẩm
        console.log("Thông tin giỏ hàng:", cartItems);
        cartItems.forEach((item, index) => {
            // Use newPrice if available, otherwise use price
            const itemPrice = item.newPrice || item.price || 0;
            console.log(`Sản phẩm ${index + 1}: ${item.title} - Giá: $${itemPrice}`);
            console.log("ID sản phẩm:", item._id || item.id);
        });
    
        // Tiếp tục tạo đơn hàng
        const newOrder = {
            name: data.name,
            email: currentUser?.email,
            address: {
                city: data.city,
                country: data.country,
                state: data.state,
                zipcode: data.zipcode,
            },
            phone: Number(data.phone),  // Chuyển đổi thành số
            productIds: productIds,
            totalPrice: totalPrice
        };
    
        console.log("Dữ liệu gửi lên API:", newOrder); // Kiểm tra lại dữ liệu gửi lên API
    
        // Tạo đơn hàng
        try {
            const response = await createOrder(newOrder).unwrap();
            console.log("✅ Đơn hàng đã tạo:", response);
            Swal.fire({
                title: "Confirmed Order",
                text: "Your order placed successfully!",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
            navigate("/orders");
        } catch (error) {
            console.error("❌ Lỗi đặt hàng:", error);
            Swal.fire({
                title: "Order Failed",
                text: error?.data?.message || "Something went wrong!",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    };
    

    if (isLoading) return <div>Loading....</div>;

    return (
        <section>
            <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
                <div className="container max-w-screen-lg mx-auto">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-600 mb-2">Cash On Delivery</h2>
                        <p className="text-gray-500 mb-2">Total Price: ${totalPrice}</p>
                        <p className="text-gray-500 mb-6">Items: {cartItems.length}</p>

                        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 text-sm grid-cols-1 lg:grid-cols-3 my-8">
                                <div className="text-gray-600">
                                    <p className="font-medium text-lg">Personal Details</p>
                                    <p>Please fill out all the fields.</p>
                                </div>

                                <div className="lg:col-span-2">
                                    <div className="grid gap-4 text-sm grid-cols-1 md:grid-cols-5">
                                        <div className="md:col-span-5">
                                            <label htmlFor="name">Full Name</label>
                                            <input
                                                {...register("name", { required: true })}
                                                type="text" name="name" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                            />
                                        </div>

                                        <div className="md:col-span-5">
                                            <label htmlFor="email">Email Address</label>
                                            <input
                                                type="text" name="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                disabled defaultValue={currentUser?.email}
                                            />
                                        </div>

                                        <div className="md:col-span-5">
                                            <label htmlFor="phone">Phone Number</label>
                                            <input
                                                {...register("phone", { required: true })}
                                                type="number" name="phone" id="phone" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                placeholder="+123 456 7890"
                                            />
                                        </div>

                                        <div className="md:col-span-3">
                                            <label htmlFor="city">City</label>
                                            <input
                                                {...register("city", { required: true })}
                                                type="text" name="city" id="city" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="country">Country</label>
                                            <input
                                                {...register("country", { required: true })}
                                                type="text" name="country" id="country" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="state">State</label>
                                            <input
                                                {...register("state", { required: true })}
                                                type="text" name="state" id="state" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                            />
                                        </div>

                                        <div className="md:col-span-1">
                                            <label htmlFor="zipcode">Zipcode</label>
                                            <input
                                                {...register("zipcode", { required: true })}
                                                type="text" name="zipcode" id="zipcode" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                            />
                                        </div>

                                        <div className="md:col-span-5 mt-3">
                                            <input
                                                onChange={(e) => setIsChecked(e.target.checked)}
                                                type="checkbox" name="terms" id="terms" className="form-checkbox"
                                            />
                                            <label htmlFor="terms" className="ml-2">
                                                I agree to the <Link className='underline text-blue-600'>Terms & Conditions</Link>.
                                            </label>
                                        </div>

                                        <div className="md:col-span-5 text-right">
                                            <button
                                                disabled={!isChecked}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Place Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CheckoutPage;
