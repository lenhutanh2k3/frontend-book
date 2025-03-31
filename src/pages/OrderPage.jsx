import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchOrderByIdQuery } from '../redux/features/orders/ordersApi';
import { useGetUserQuery } from '../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/features/cart/cartSlice';
import { toast } from 'react-hot-toast';

const OrderPage = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const { data: order, isLoading: orderLoading, error: orderError } = useFetchOrderByIdQuery(orderId);
    const { data: user, isLoading: userLoading } = useGetUserQuery();

    useEffect(() => {
        if (order) {
            dispatch(clearCart());
            toast.success('Đơn hàng đã được xác nhận!');
        }
    }, [order, dispatch]);

    if (orderLoading || userLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (orderError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-center">
                    <h2 className="text-2xl font-bold mb-4">Có lỗi xảy ra</h2>
                    <p>Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h2>
                    <p>Đơn hàng này không tồn tại hoặc đã bị hủy.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Chi tiết đơn hàng #{order._id}</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Ngày đặt:</p>
                            <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Trạng thái:</p>
                            <p className="font-medium">{order.status}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Tổng tiền:</p>
                            <p className="font-medium">{order.totalAmount.toLocaleString('vi-VN')}đ</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Phương thức thanh toán:</p>
                            <p className="font-medium">{order.paymentMethod}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Thông tin người nhận</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Họ tên:</p>
                            <p className="font-medium">{order.shippingAddress.fullName}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Số điện thoại:</p>
                            <p className="font-medium">{order.shippingAddress.phone}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-600">Địa chỉ:</p>
                            <p className="font-medium">{order.shippingAddress.address}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Sản phẩm đã đặt</h2>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item._id} className="flex items-center border-b pb-4">
                                <img
                                    src={item.book.coverImage}
                                    alt={item.book.title}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="ml-4 flex-1">
                                    <h3 className="font-medium">{item.book.title}</h3>
                                    <p className="text-gray-600">Số lượng: {item.quantity}</p>
                                    <p className="text-gray-600">Giá: {item.price.toLocaleString('vi-VN')}đ</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage; 