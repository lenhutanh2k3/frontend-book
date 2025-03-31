import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import Swal from 'sweetalert2';
import getBaseUrl from '../../../utils/baseURL';

const AccountManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        name: '',
        role: 'user',
        isActive: true,
        phone: '',
        address: {
            city: '',
            country: '',
            state: '',
            zipcode: ''
        }
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Không tìm thấy token xác thực');
            }

            const response = await axios.get(`${getBaseUrl()}/api/auth/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng:', error);
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
                    text: 'Không thể lấy danh sách người dùng'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (user) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Không tìm thấy token xác thực');
            }

            const response = await axios.get(`${getBaseUrl()}/api/auth/users/${user._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setEditingUser(response.data);
            setFormData({
                username: response.data.username || '',
                password: '', // Không hiển thị mật khẩu đã mã hóa
                email: response.data.email || '',
                name: response.data.name || '',
                role: response.data.role || 'user',
                isActive: response.data.isActive,
                phone: response.data.phone || '',
                address: response.data.address || { city: '', country: '', state: '', zipcode: '' }
            });
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể lấy thông tin người dùng'
            });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Không tìm thấy token xác thực');
            }

            // Chỉ gửi mật khẩu nếu có thay đổi
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
            }

            await axios.put(`${getBaseUrl()}/api/auth/users/${editingUser._id}`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Cập nhật thông tin người dùng thành công'
            });
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            if (error.response?.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: error.response.data.message || 'Dữ liệu không hợp lệ'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể cập nhật thông tin người dùng'
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

            // Format data to match exactly what the backend expects
            const userData = {
                username: formData.username, // Ensure username is included and required
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role: formData.role,
                // Convert address object to string format that backend expects
                address: `${formData.address?.city || ''}, ${formData.address?.state || ''}, ${formData.address?.country || ''}, ${formData.address?.zipcode || ''}`,
                phone: formData.phone || ''
            };

            console.log('Sending user data:', userData);

            // Use /api/auth/register endpoint
            await axios.post(`${getBaseUrl()}/api/auth/register`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Thêm người dùng mới thành công'
            });
            
            setFormData({
                username: '',
                password: '',
                email: '',
                name: '',
                role: 'user',
                isActive: true,
                phone: '',
                address: {
                    city: '',
                    country: '',
                    state: '',
                    zipcode: ''
                }
            });
            fetchUsers();
        } catch (error) {
            console.error('Lỗi khi thêm người dùng:', error);
            if (error.response?.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: error.response.data.message || 'Dữ liệu không hợp lệ'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể thêm người dùng mới'
                });
            }
        }
    };

    const handleDelete = async (userId) => {
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
                await axios.delete(`${getBaseUrl()}/api/auth/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                Swal.fire(
                    'Đã xóa!',
                    'Người dùng đã được xóa.',
                    'success'
                );
                fetchUsers();
            }
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
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
                    text: 'Không thể xóa người dùng'
                });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Handle address fields separately
        if (name === 'city' || name === 'country' || name === 'state' || name === 'zipcode') {
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
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
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Quản lý tài khoản</h1>

            {/* Form thêm/sửa người dùng */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">
                    {editingUser ? 'Cập nhật thông tin người dùng' : 'Thêm người dùng mới'}
                </h2>
                <form onSubmit={editingUser ? handleUpdate : handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Mật khẩu {editingUser && '(để trống nếu không muốn thay đổi)'}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required={!editingUser}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <HiOutlineEyeOff className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <HiOutlineEye className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="user">Người dùng</option>
                                <option value="admin">Quản trị viên</option>
                            </select>
                        </div>
                        
                        {/* Address fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Thành phố</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.address?.city || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quốc gia</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.address?.country || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.address?.state || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mã bưu chính</label>
                            <input
                                type="text"
                                name="zipcode"
                                value={formData.address?.zipcode || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">Tài khoản hoạt động</label>
                        </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            {editingUser ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                        {editingUser && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingUser(null);
                                    setFormData({
                                        username: '',
                                        password: '',
                                        email: '',
                                        name: '',
                                        role: 'user',
                                        isActive: true,
                                        phone: '',
                                        address: { city: '', country: '', state: '', zipcode: '' }
                                    });
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Bảng danh sách người dùng */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mật khẩu (đã mã hóa)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-500 font-mono">
                                            {user.password ? user.password.substring(0, 20) + '...' : '••••••••'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                        {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                    >
                                        <HiOutlinePencilAlt className="h-5 w-5 inline" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <HiOutlineTrash className="h-5 w-5 inline" />
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

export default AccountManagement;
