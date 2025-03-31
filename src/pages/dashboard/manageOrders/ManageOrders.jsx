import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import Swal from 'sweetalert2';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Không tìm thấy token xác thực');
            }

            const response = await axios.get(`${API_URL}/api/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            if (error.response?.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi xác thực',
                    text: 'Vui lòng đăng nhập lại để tiếp tục',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.removeItem('token');
                        window.location.href = '/admin/login';
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể lấy danh sách đơn hàng'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Không tìm thấy token xác thực');
            }

            await axios.put(`${API_URL}/api/orders/${orderId}`, 
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Cập nhật trạng thái đơn hàng thành công'
            });
            fetchOrders();
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            if (error.response?.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi xác thực',
                    text: 'Vui lòng đăng nhập lại để tiếp tục',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.removeItem('token');
                        window.location.href = '/admin/login';
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể cập nhật trạng thái đơn hàng'
                });
            }
        }
    };

    const handleDelete = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Không tìm thấy token xác thực');
            }

            const result = await Swal.fire({
                title: 'Bạn có chắc chắn?',
                text: "Hành động này không thể hoàn tác!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Có, xóa nó!',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                await axios.delete(`${API_URL}/api/orders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                Swal.fire(
                    'Đã xóa!',
                    'Đơn hàng đã được xóa.',
                    'success'
                );
                fetchOrders();
            }
        } catch (error) {
            console.error('Lỗi khi xóa đơn hàng:', error);
            if (error.response?.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi xác thực',
                    text: 'Vui lòng đăng nhập lại để tiếp tục',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.removeItem('token');
                        window.location.href = '/admin/login';
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể xóa đơn hàng'
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{order._id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{order.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(order.totalPrice)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={order.status || 'pending'}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className="border rounded px-2 py-1"
                                    >
                                        <option value="pending">Chờ xử lý</option>
                                        <option value="processing">Đang xử lý</option>
                                        <option value="shipped">Đã gửi hàng</option>
                                        <option value="delivered">Đã giao hàng</option>
                                        <option value="cancelled">Đã hủy</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleDelete(order._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <HiOutlineTrash className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageOrders; 