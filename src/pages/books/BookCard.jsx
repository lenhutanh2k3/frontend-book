import React from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'

const BookCard = ({book}) => {
    const dispatch = useDispatch();

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigation when clicking the button
        dispatch(addToCart({
            id: book._id,
            title: book.title,
            price: book.newPrice,
            coverImage: book.coverImage,
            quantity: 1
        }));
    }

    return (
        <Link 
            to={`/books/${book._id}`} 
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
            <div className="relative group">
                <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-full h-[300px] object-contain bg-gray-50 p-4"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <button 
                        onClick={handleAddToCart}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 hover:bg-blue-700"
                    >
                        <FiShoppingCart />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{book.title}</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-red-600">${book.newPrice}</span>
                        <span className="text-sm text-gray-500 line-through">${book.oldPrice}</span>
                    </div>
                    <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                        {Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100)}% OFF
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default BookCard