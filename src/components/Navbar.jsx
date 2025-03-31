import { Link } from "react-router-dom";
import { HiMiniBars3CenterLeft, HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi";
import avatarImg from "../assets/avatar.png";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useSearchBooks } from "../hooks/useSearchBooks";

const navigation = [
    { name: "Dashboard", href: "/user-dashboard" },
    { name: "Orders", href: "/orders" },
    { name: "Cart Page", href: "/cart" },
    { name: "Check Out", href: "/checkout" },
    { name: "Categories", href: "/categories" },
];

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const cartItems = useSelector((state) => state.cart.cartItems);
    const { currentUser, logout } = useAuth();
    const { books, loading, error, suggestions } = useSearchBooks(searchQuery);

    const token = localStorage.getItem("token");

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-bold text-primary">
                                BookStore
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl mx-4 relative">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Tìm kiếm sách..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>

                        {/* Search Suggestions */}
                        {searchQuery && suggestions.length > 0 && (
                            <div className="absolute w-full bg-white shadow-lg mt-1 z-10 max-h-60 overflow-y-auto rounded-lg">
                                <ul className="py-1">
                                    {suggestions.map((suggestion) => (
                                        <li key={suggestion.id}>
                                            <Link
                                                to={`/books/${suggestion.id}`}
                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                onClick={() => setSearchQuery("")}
                                            >
                                                <div className="font-medium">{suggestion.title}</div>
                                                <div className="text-gray-500 text-xs">{suggestion.author}</div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {searchQuery && suggestions.length === 0 && !loading && (
                            <div className="absolute w-full bg-white shadow-lg mt-1 z-10 rounded-lg">
                                <div className="px-4 py-2 text-sm text-gray-500">
                                    Không tìm thấy kết quả
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className="absolute w-full bg-white shadow-lg mt-1 z-10 rounded-lg">
                                <div className="px-4 py-2 text-sm text-gray-500">
                                    Đang tìm kiếm...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center">
                        <Link to="/cart" className="relative p-2">
                            <HiOutlineShoppingCart className="h-6 w-6" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {currentUser ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 focus:outline-none"
                                >
                                    <img
                                        src={avatarImg}
                                        alt="User avatar"
                                        className="h-8 w-8 rounded-full"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {currentUser.name}
                                    </span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                            >
                                <HiOutlineUser className="h-6 w-6" />
                                <span className="text-sm font-medium">Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
