import React, { useState } from 'react'
import { useGetAllBooksQuery } from '../../redux/features/books/booksApi'
import BookCard from '../../components/BookCard'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

const Books = () => {
    const { data: books = [], isLoading } = useGetAllBooksQuery()
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState('all')

    // Filter categories (mock data - adjust based on your actual data)
    const categories = [
        { id: 'all', name: 'Tất cả' },
        { id: 'fiction', name: 'Tiểu thuyết' },
        { id: 'non-fiction', name: 'Phi hư cấu' },
        { id: 'biography', name: 'Tiểu sử' },
        { id: 'science', name: 'Khoa học' }
    ]

    // Filter books based on search term and category
    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            book.author?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filter === 'all' || book.category === filter;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-xl">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90"></div>
                    <div className="relative px-8 py-16 sm:px-12 lg:px-16">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
                                Khám phá thế giới qua từng trang sách
                            </h1>
                            <p className="text-indigo-100 text-xl mb-8 max-w-2xl">
                                Bộ sưu tập sách đa dạng với nhiều thể loại, từ tiểu thuyết đến sách khoa học, 
                                mang đến trải nghiệm đọc sách tuyệt vời.
                            </p>
                            <div className="relative max-w-xl">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm text-white placeholder-indigo-200"
                                    placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 transform translate-y-1/3 -translate-x-1/4 lg:-translate-x-1/6 opacity-10">
                        <svg width="400" height="400" viewBox="0 0 56 64" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M45.1334 0H9.06672C4.07599 0 0 4.07599 0 9.06672V54.9333C0 59.924 4.07599 64 9.06672 64H45.1334C50.124 64 54.2 59.924 54.2 54.9333V9.06672C54.2 4.07599 50.124 0 45.1334 0Z" />
                            <path d="M14.9333 14.9333H39.2667V37.3333H14.9333V14.9333Z" fillOpacity="0.6"/>
                            <path d="M14.9333 42.6667H28.8V49.0667H14.9333V42.6667Z" fillOpacity="0.6"/>
                        </svg>
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap items-center mb-10 bg-white rounded-xl p-4 shadow-md">
                    <div className="flex items-center mr-4 text-gray-600">
                        <FunnelIcon className="h-5 w-5 mr-2" />
                        <span className="font-medium">Thể loại:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setFilter(category.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                    filter === category.id
                                        ? 'bg-indigo-100 text-indigo-800 ring-2 ring-indigo-600 ring-opacity-50'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {filteredBooks.length > 0 ? (
                            <>Hiển thị <span className="text-indigo-600">{filteredBooks.length}</span> sách</>
                        ) : 'Không tìm thấy sách nào'}
                    </h2>
                    
                    {/* Sort options would go here */}
                    <div className="hidden sm:block">
                        <select 
                            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            defaultValue="newest"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="price-asc">Giá tăng dần</option>
                            <option value="price-desc">Giá giảm dần</option>
                            <option value="bestseller">Bán chạy nhất</option>
                        </select>
                    </div>
                </div>
                
                {/* Books Grid */}
                {filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredBooks.map((book) => (
                            <div 
                                key={book._id} 
                                className="transform transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                <BookCard book={book} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Không tìm thấy sách nào</h3>
                        <p className="text-gray-500 mb-6">Hãy thử tìm kiếm với từ khóa khác hoặc xem tất cả sách</p>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setFilter('all');
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Xem tất cả sách
                        </button>
                    </div>
                )}

                {/* Pagination - would integrate with your actual pagination logic */}
                {filteredBooks.length > 0 && (
                    <div className="mt-12 flex justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" aria-current="page" className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">1</a>
                            <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">2</a>
                            <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">3</a>
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
                            <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">8</a>
                            <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">9</a>
                            <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">10</a>
                            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Books 