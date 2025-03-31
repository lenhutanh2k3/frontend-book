import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { IoAddCircleOutline } from 'react-icons/io5';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const AccountManagement = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'admin'
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Không tìm thấy token xác thực');
            }

            const response = await axios.get(`${API_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Fetched user data:', response.data);
            setUser(response.data);
            setFormData({
                username: response.data.username || '',
                role: response.data.role || 'admin'
            });
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
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
                    text: 'Không thể lấy thông tin người dùng'
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Không tìm thấy token xác thực');
            }

            const dataToUpdate = { ...formData };
            if (!dataToUpdate.password) {
                delete dataToUpdate.password;
            }

            await axios.put(`${API_URL}/api/auth/profile`, dataToUpdate, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Cập nhật thông tin tài khoản thành công'
            });
            fetchUserData();
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
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
            } else if (error.response?.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: error.response.data.message || 'Không thể cập nhật thông tin tài khoản'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể cập nhật thông tin tài khoản'
                });
            }
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!user) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Cài đặt tài khoản</h1>
            <form onSubmit={handleSubmit} className="max-w-md">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        ID
                    </label>
                    <input
                        type="text"
                        value={user._id}
                        readOnly
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Tên người dùng
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Mật khẩu mới
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Để trống nếu không muốn thay đổi"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Vai trò
                    </label>
                    <input
                        type="text"
                        value={formData.role}
                        readOnly
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Trạng thái
                    </label>
                    <input
                        type="text"
                        value={user.isActive ? 'Hoạt động' : 'Đã khóa'}
                        readOnly
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AccountManagement; 