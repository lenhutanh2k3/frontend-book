import React, { useEffect, useState } from 'react';
import InputField from '../addBook/InputField';
import SelectField from '../addBook/SelectField';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useUpdateBookMutation, useGetSingleBookQuery } from '../../../redux/features/books/booksApi';
import { useFetchAllCategoriesQuery } from '../../../redux/features/categories/categoriesApi';
import Loading from '../../../components/Loading';
import { toast } from 'react-toastify';

const UpdateBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: bookData, isLoading: isBookLoading, error: isBookError, refetch } = useGetSingleBookQuery(id);
    const { data: categories = [], isLoading: isCategoriesLoading } = useFetchAllCategoriesQuery();
    const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const [imageFile, setImageFile] = useState(null);
    const [imageFileName, setImageFileName] = useState('');
    const [base64Image, setBase64Image] = useState('');

    useEffect(() => {
        if (bookData) {
            console.log('Book data loaded:', bookData);
            setValue('title', bookData.title);
            setValue('description', bookData.description);
            setValue('category', bookData?.category?._id || '');
            setValue('trending', bookData.trending);
            setValue('oldPrice', bookData.oldPrice);
            setValue('newPrice', bookData.newPrice);
            setValue('coverImage', bookData.coverImage);
            setBase64Image(bookData.coverImage);
        }
    }, [bookData, setValue]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileName(file.name);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64Image(reader.result);
                setValue('coverImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            console.log('Form data:', data);
            
            const updateBookData = {
                title: data.title.trim(),
                description: data.description.trim(),
                category: data.category,
                trending: data.trending || false,
                oldPrice: Number(data.oldPrice) || 0,
                newPrice: Number(data.newPrice) || 0,
                coverImage: base64Image || data.coverImage,
            };

            console.log('Update book data:', updateBookData);

            // Validate dữ liệu
            if (!updateBookData.title || !updateBookData.description || !updateBookData.category || 
                !updateBookData.oldPrice || !updateBookData.newPrice || !updateBookData.coverImage) {
                toast.error('Vui lòng điền đầy đủ thông tin sách');
                return;
            }

            // Validate Base64 image
            if (!updateBookData.coverImage.startsWith('data:image/')) {
                toast.error('Ảnh bìa sách không hợp lệ. Vui lòng chọn ảnh khác.');
                return;
            }

            // Validate prices
            if (updateBookData.oldPrice < 0 || updateBookData.newPrice < 0) {
                toast.error('Giá sách không hợp lệ. Vui lòng kiểm tra lại.');
                return;
            }

            // Validate category
            if (!updateBookData.category) {
                toast.error('Vui lòng chọn danh mục sách');
                return;
            }

            const result = await updateBook({ id, book: updateBookData }).unwrap();
            console.log('Update response:', result);
            
            if (result && result.success) {
                console.log('Updated book data:', result.book);
                toast.success(result.message || 'Cập nhật sách thành công!');
                
                // Refetch book data to ensure we have the latest version
                await refetch();
                
                // Navigate back to manage books page
                navigate('/dashboard/manage-books');
            } else {
                toast.error(result?.message || 'Có lỗi xảy ra khi cập nhật sách');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật sách:', error);
            if (error.status === 404) {
                toast.error('Không tìm thấy sách hoặc danh mục');
            } else if (error.status === 400) {
                toast.error(error.data?.message || 'Dữ liệu không hợp lệ');
            } else {
                toast.error('Không thể cập nhật sách. Vui lòng thử lại sau.');
            }
        }
    };

    if (isBookLoading || isCategoriesLoading) return <Loading />;
    if (isBookError) return <div>Error fetching book data</div>;

    // Tạo options cho SelectField từ danh sách categories
    const categoryOptions = [
        { value: '', label: 'Choose A Category' },
        ...categories.map(category => ({
            value: category._id,
            label: category.name
        }))
    ];

    return (
        <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Book</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <InputField
                    label="Title"
                    name="title"
                    placeholder="Enter book title"
                    register={register}
                    error={errors.title?.message}
                />

                <InputField
                    label="Description"
                    name="description"
                    placeholder="Enter book description"
                    type="textarea"
                    register={register}
                    error={errors.description?.message}
                />

                <SelectField
                    label="Category"
                    name="category"
                    options={categoryOptions}
                    register={register}
                    error={errors.category?.message}
                />
                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            {...register('trending')}
                            className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
                    </label>
                </div>

                <InputField
                    label="Old Price"
                    name="oldPrice"
                    type="number"
                    placeholder="Old Price"
                    register={register}
                    error={errors.oldPrice?.message}
                />

                <InputField
                    label="New Price"
                    name="newPrice"
                    type="number"
                    placeholder="New Price"
                    register={register}
                    error={errors.newPrice?.message}
                />

                {/* Cover Image Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="mb-2 w-full"
                    />
                    {imageFileName && <p className="text-sm text-gray-500">Selected: {imageFileName}</p>}
                    {base64Image && (
                        <div className="mt-2">
                            <img 
                                src={base64Image} 
                                alt="Preview" 
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                        </div>
                    )}
                </div>

                <button 
                    type="submit" 
                    className="w-full py-2 bg-blue-500 text-white font-bold rounded-md"
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Update Book'}
                </button>
            </form>
        </div>
    );
};

export default UpdateBook;