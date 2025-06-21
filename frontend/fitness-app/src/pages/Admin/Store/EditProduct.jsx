import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaTrash, FaUpload, FaTag, FaTags, FaBox } from 'react-icons/fa';
import AdminLayout from '../../../components/Admin/AdminLayout';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import { useNotification } from '../../../hooks/useNotification';

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form validation errors
  const [errors, setErrors] = useState({});

  // State for confirm dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'danger'
  });

  // Product form data
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discount: 0,
    originalPrice: '',
    category: '',
    description: '',
    stock: '',
    sku: '',
    brand: '',
    tags: [],
    imageFile: null,
    imagePreview: null,
    attributes: {
      sizes: [],
      colors: [],
      weight: '',
      dimensions: '',
      material: '',
      flavors: []
    }
  });

  // Available categories
  const categories = ['Supplements', 'Equipment', 'Apparel', 'Accessories', 'Nutrition', 'Wellness'];

  // Available sizes for apparel
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Available colors
  const availableColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Grey', 'Navy', 'Purple', 'Orange', 'Yellow'];

  // Available flavors for supplements
  const availableFlavors = ['Chocolate', 'Vanilla', 'Strawberry', 'Banana', 'Cookies & Cream', 'Unflavored'];

  // Mock function to fetch product data based on ID
  const fetchProductData = () => {
    setIsLoading(true);

    // Simulating API call with setTimeout
    setTimeout(() => {
      try {
        // Find product by ID in mock data (this would be an API call in a real application)
        const product = {
          id: productId,
          name: 'Whey Protein',
          price: 44.99,
          discount: 10,
          originalPrice: 49.99,
          category: 'Supplements',
          description: 'High-quality whey protein for muscle recovery and growth. 2kg pack, chocolate flavor.',
          stock: 120,
          sku: 'WP-2000-CHOC',
          brand: 'MusclePro',
          tags: ['protein', 'supplement', 'muscle'],
          imagePreview: '/src/assets/products/product1.png',
          attributes: {
            sizes: [],
            colors: [],
            weight: '2kg',
            dimensions: '',
            material: '',
            flavors: ['Chocolate', 'Vanilla']
          }
        };

        if (product) {
          // Make sure to properly merge the attributes object
          setFormData({
            ...formData,
            ...product,
            attributes: {
              ...formData.attributes,
              ...product.attributes
            }
          });
          setIsLoading(false);
        } else {
          showError('Product not found');
          navigate('/admin/store/products');
        }
      } catch (error) {
        showError('Failed to load product data');
        setIsLoading(false);
      }
    }, 700); // Simulated delay
  };

  // Load product data on component mount
  useEffect(() => {
    const loadProductData = async () => {
      try {
        setIsLoading(true);
        const product = await fetchProductData(productId);

        // Update form data with product details
        setFormData({
          name: product.name,
          price: product.price,
          discount: product.discount,
          originalPrice: product.originalPrice,
          category: product.category,
          description: product.description,
          stock: product.stock,
          sku: product.sku,
          brand: product.brand,
          tags: product.tags || [],
          imageFile: null,
          imagePreview: product.image
        });

        setIsLoading(false);
      } catch {
        showError('Failed to load product data');
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [productId, showError]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle numeric input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : parseFloat(value);

    setFormData({
      ...formData,
      [name]: numValue
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });

      if (errors.imageFile) {
        setErrors({
          ...errors,
          imageFile: null
        });
      }
    }
  };

  // Handle attribute changes
  const handleAttributeChange = (attribute, value) => {
    setFormData({
      ...formData,
      attributes: {
        ...formData.attributes,
        [attribute]: value
      }
    });

    // Clear error for this attribute when user changes it
    if (errors[attribute]) {
      setErrors({
        ...errors,
        [attribute]: null
      });
    }
  };

  // Toggle size selection
  const handleSizeToggle = (size) => {
    const currentSizes = [...formData.attributes.sizes];
    if (currentSizes.includes(size)) {
      handleAttributeChange('sizes', currentSizes.filter(s => s !== size));
    } else {
      handleAttributeChange('sizes', [...currentSizes, size]);
    }
  };

  // Toggle color selection
  const handleColorToggle = (color) => {
    const currentColors = [...formData.attributes.colors];
    if (currentColors.includes(color)) {
      handleAttributeChange('colors', currentColors.filter(c => c !== color));
    } else {
      handleAttributeChange('colors', [...currentColors, color]);
    }
  };

  // Toggle flavor selection
  const handleFlavorToggle = (flavor) => {
    const currentFlavors = [...formData.attributes.flavors];
    if (currentFlavors.includes(flavor)) {
      handleAttributeChange('flavors', currentFlavors.filter(f => f !== flavor));
    } else {
      handleAttributeChange('flavors', [...currentFlavors, flavor]);
    }
  };

  // Handle tag input
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim().toLowerCase()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than zero';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.stock && formData.stock !== 0) newErrors.stock = 'Stock quantity is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';

    // Original price validation when discount is applied
    if (formData.discount > 0 && (!formData.originalPrice || formData.originalPrice <= formData.price)) {
      newErrors.originalPrice = 'Original price must be greater than current price when discount is applied';
    }

    // Category-specific validations
    switch (formData.category) {
      case 'Apparel':
        if (formData.attributes.sizes.length === 0) {
          newErrors.sizes = 'At least one size must be selected';
        }
        if (formData.attributes.colors.length === 0) {
          newErrors.colors = 'At least one color must be selected';
        }
        break;
      case 'Supplements':
        if (formData.attributes.flavors.length === 0) {
          newErrors.flavors = 'At least one flavor must be selected';
        }
        if (!formData.attributes.weight.trim()) {
          newErrors.weight = 'Weight/Volume is required for supplements';
        }
        break;
      case 'Nutrition':
        if (!formData.attributes.weight.trim()) {
          newErrors.weight = 'Weight/Volume is required for nutrition products';
        }
        break;
      case 'Equipment':
        if (!formData.attributes.weight.trim()) {
          newErrors.weight = 'Weight information is required for equipment';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancelForm = () => {
    navigate('/admin/store/products');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Please correct the errors in the form.');
      return;
    }

    setIsSubmitting(true);

    // Prepare data for submission including all attributes
    const productData = {
      ...formData,
      // Make sure attributes are properly included
      attributes: {
        sizes: formData.attributes.sizes || [],
        colors: formData.attributes.colors || [],
        weight: formData.attributes.weight || '',
        dimensions: formData.attributes.dimensions || '',
        material: formData.attributes.material || '',
        flavors: formData.attributes.flavors || []
      }
    };

    // Simulating API call with setTimeout
    setTimeout(() => {
      try {
        // In a real application, this would be an API call to update the product
        console.log('Product data being submitted:', productData);

        showSuccess('Product updated successfully!');
        navigate('/admin/store/products');
      } catch (err) {
        showError('Failed to update product. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }, 800); // Simulated delay
  };

  const handleDeleteProduct = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      onConfirm: () => {
        // Delete logic will be implemented later
        showSuccess('Product deleted successfully');
        navigate('/admin/store/products');
      },
      type: 'danger'
    });
  };

  return (
    <AdminLayout pageTitle="Edit Product">
      <div className="bg-[#0A0A1F] rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h3 className="text-white text-lg font-medium">Edit Product #{productId}</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDeleteProduct}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              disabled={isSubmitting || isLoading}
            >
              <FaTrash /> Delete
            </button>
            <button
              onClick={handleCancelForm}
              className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
              disabled={isSubmitting}
            >
              <FaTimes /> Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#f67a45] text-white hover:bg-[#e56d3d] rounded-lg transition-colors flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Update Product
                </>
              )}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-[#f67a45]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-white">Loading product data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Basic info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-[#121225] border ${errors.name ? 'border-red-500' : 'border-white/20'
                      } rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className={`w-full bg-[#121225] border ${errors.sku ? 'border-red-500' : 'border-white/20'
                      } rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]`}
                    placeholder="Enter SKU"
                  />
                  {errors.sku && (
                    <p className="text-red-500 text-xs mt-1">{errors.sku}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className={`w-full bg-[#121225] border ${errors.brand ? 'border-red-500' : 'border-white/20'
                      } rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]`}
                    placeholder="Enter brand name"
                  />
                  {errors.brand && (
                    <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full bg-[#121225] border ${errors.category ? 'border-red-500' : 'border-white/20'
                      } rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]`}
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleNumberChange}
                    className={`w-full bg-[#121225] border ${errors.stock ? 'border-red-500' : 'border-white/20'
                      } rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]`}
                    placeholder="Enter stock quantity"
                    min="0"
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
                  )}
                </div>
              </div>

              {/* Middle column - Pricing and Image */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleNumberChange}
                      className={`w-full bg-[#121225] border ${errors.price ? 'border-red-500' : 'border-white/20'
                        } rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]`}
                      placeholder="Enter price"
                      step="0.01"
                      min="0"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleNumberChange}
                      className="w-full bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
                      placeholder="Enter discount"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Original Price ($) {formData.discount > 0 && '*'}
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleNumberChange}
                    className={`w-full bg-[#121225] border ${errors.originalPrice ? 'border-red-500' : 'border-white/20'
                      } rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]`}
                    placeholder="Enter original price"
                    step="0.01"
                    min="0"
                    disabled={formData.discount <= 0}
                  />
                  {errors.originalPrice && (
                    <p className="text-red-500 text-xs mt-1">{errors.originalPrice}</p>
                  )}
                  <p className="text-white/60 text-xs mt-1">Required when discount is applied</p>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Product Image
                  </label>
                  <div className="mt-2 flex flex-col items-center">
                    <div className="w-full h-48 bg-gray-700/30 mb-2 rounded-lg flex items-center justify-center overflow-hidden">
                      {formData.imagePreview ? (
                        <img
                          src={formData.imagePreview}
                          alt="Product preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-white/50 flex flex-col items-center">
                          <FaBox size={36} />
                          <span className="mt-2">No image selected</span>
                        </div>
                      )}
                    </div>

                    <label className="cursor-pointer bg-[#121225] hover:bg-[#1d1d3a] border border-white/20 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                      <FaUpload />
                      {formData.imageFile ? 'Change Image' : 'Upload Image'}
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>

                    {formData.imageFile && (
                      <p className="text-white/60 text-xs mt-2">
                        {formData.imageFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column - Description and Tags */}
              <div className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full bg-[#121225] border ${errors.description ? 'border-red-500' : 'border-white/20'
                      } rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]`}
                    placeholder="Enter product description"
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Tags
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="flex-1 bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
                      placeholder="Add a tag"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-[#121225] border border-white/20 text-white p-2 rounded-lg hover:bg-[#1d1d3a]"
                    >
                      <FaTag />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.length === 0 ? (
                      <p className="text-white/60 text-sm">No tags added yet</p>
                    ) : (
                      formData.tags.map((tag) => (
                        <div
                          key={tag}
                          className="inline-flex items-center bg-[#1d1d3a] text-white/90 px-3 py-1 rounded-full text-sm"
                        >
                          <span className="mr-1">{tag}</span>
                          <button
                            type="button"
                            className="text-white/70 hover:text-white"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            &times;
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-6 mt-auto">
                  <div className="bg-[#121225]/50 rounded p-4 border border-white/10">
                    <h4 className="text-white flex items-center gap-2 text-sm font-medium mb-2">
                      <FaTags /> Product Status
                    </h4>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${formData.stock > 20 ? 'bg-green-500' : formData.stock > 5 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span className="text-white/80 text-sm">
                          {formData.stock > 20 ? 'In Stock' : formData.stock > 5 ? 'Low Stock' : 'Critical Stock'}
                        </span>
                      </div>
                      <div className="text-white/80 text-sm">
                        SKU: {formData.sku}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product attributes section based on category */}
            <div className="border-t border-white/10 pt-6 mt-6">
              <h3 className="text-white text-lg font-medium mb-4">Product Attributes</h3>

              {formData.category && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Apparel-specific attributes */}
                  {formData.category === 'Apparel' && (
                    <>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Available Sizes
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableSizes.map(size => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSizeToggle(size)}
                              className={`px-3 py-1 rounded-md ${formData.attributes.sizes.includes(size)
                                  ? 'bg-[#f67a45] text-white'
                                  : 'bg-[#121225] text-white/70 hover:bg-[#1d1d3a]'
                                }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                        {errors.sizes && (
                          <p className="text-red-500 text-xs mt-1">{errors.sizes}</p>
                        )}
                        <p className="text-white/60 text-xs mt-2">
                          Select all available sizes for this product
                        </p>
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Available Colors
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableColors.map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => handleColorToggle(color)}
                              className={`px-3 py-1 rounded-md ${formData.attributes.colors.includes(color)
                                  ? 'bg-[#f67a45] text-white'
                                  : 'bg-[#121225] text-white/70 hover:bg-[#1d1d3a]'
                                }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                        {errors.colors && (
                          <p className="text-red-500 text-xs mt-1">{errors.colors}</p>
                        )}
                        <p className="text-white/60 text-xs mt-2">
                          Select all available colors for this product
                        </p>
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Material
                        </label>
                        <input
                          type="text"
                          value={formData.attributes.material}
                          onChange={(e) => handleAttributeChange('material', e.target.value)}
                          className="w-full bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
                          placeholder="E.g. Cotton, Polyester, etc."
                        />
                      </div>
                    </>
                  )}

                  {/* Supplements-specific attributes */}
                  {formData.category === 'Supplements' && (
                    <>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Available Flavors
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableFlavors.map(flavor => (
                            <button
                              key={flavor}
                              type="button"
                              onClick={() => handleFlavorToggle(flavor)}
                              className={`px-3 py-1 rounded-md ${formData.attributes.flavors.includes(flavor)
                                  ? 'bg-[#f67a45] text-white'
                                  : 'bg-[#121225] text-white/70 hover:bg-[#1d1d3a]'
                                }`}
                            >
                              {flavor}
                            </button>
                          ))}
                        </div>
                        {errors.flavors && (
                          <p className="text-red-500 text-xs mt-1">{errors.flavors}</p>
                        )}
                        <p className="text-white/60 text-xs mt-2">
                          Select all available flavors for this supplement
                        </p>
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Weight/Volume
                        </label>
                        <input
                          type="text"
                          value={formData.attributes.weight}
                          onChange={(e) => handleAttributeChange('weight', e.target.value)}
                          className={`w-full bg-[#121225] border ${errors.weight ? 'border-red-500' : 'border-white/20'
                            } rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]`}
                          placeholder="E.g. 2kg, 500g, 1L, etc."
                        />
                        {errors.weight && (
                          <p className="text-red-500 text-xs mt-1">{errors.weight}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Equipment-specific attributes */}
                  {formData.category === 'Equipment' && (
                    <>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Weight
                        </label>
                        <input
                          type="text"
                          value={formData.attributes.weight}
                          onChange={(e) => handleAttributeChange('weight', e.target.value)}
                          className={`w-full bg-[#121225] border ${errors.weight ? 'border-red-500' : 'border-white/20'
                            } rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]`}
                          placeholder="E.g. 10kg, 5lb, etc."
                        />
                        {errors.weight && (
                          <p className="text-red-500 text-xs mt-1">{errors.weight}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Dimensions
                        </label>
                        <input
                          type="text"
                          value={formData.attributes.dimensions}
                          onChange={(e) => handleAttributeChange('dimensions', e.target.value)}
                          className="w-full bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
                          placeholder="E.g. 100x50x20 cm"
                        />
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Material
                        </label>
                        <input
                          type="text"
                          value={formData.attributes.material}
                          onChange={(e) => handleAttributeChange('material', e.target.value)}
                          className="w-full bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
                          placeholder="E.g. Steel, Rubber, etc."
                        />
                      </div>
                    </>
                  )}

                  {/* Accessories-specific attributes */}
                  {formData.category === 'Accessories' && (
                    <>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Material
                        </label>
                        <input
                          type="text"
                          value={formData.attributes.material}
                          onChange={(e) => handleAttributeChange('material', e.target.value)}
                          className="w-full bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
                          placeholder="E.g. Nylon, Leather, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Dimensions
                        </label>
                        <input
                          type="text"
                          value={formData.attributes.dimensions}
                          onChange={(e) => handleAttributeChange('dimensions', e.target.value)}
                          className="w-full bg-[#121225] border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]"
                          placeholder="E.g. 20x15x5 cm"
                        />
                      </div>
                    </>
                  )}

                  {/* Nutrition-specific attributes */}
                  {formData.category === 'Nutrition' && (
                    <>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Weight/Volume
                        </label>
                        <input
                          type="text"
                          value={formData.attributes.weight}
                          onChange={(e) => handleAttributeChange('weight', e.target.value)}
                          className={`w-full bg-[#121225] border ${errors.weight ? 'border-red-500' : 'border-white/20'
                            } rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#f67a45]`}
                          placeholder="E.g. 250g, 500ml, etc."
                        />
                        {errors.weight && (
                          <p className="text-red-500 text-xs mt-1">{errors.weight}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Available Flavors
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableFlavors.map(flavor => (
                            <button
                              key={flavor}
                              type="button"
                              onClick={() => handleFlavorToggle(flavor)}
                              className={`px-3 py-1 rounded-md ${formData.attributes.flavors.includes(flavor)
                                  ? 'bg-[#f67a45] text-white'
                                  : 'bg-[#121225] text-white/70 hover:bg-[#1d1d3a]'
                                }`}
                            >
                              {flavor}
                            </button>
                          ))}
                        </div>
                        {errors.flavors && (
                          <p className="text-red-500 text-xs mt-1">{errors.flavors}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {!formData.category && (
                <p className="text-white/70 text-center py-4">
                  Select a product category to view specific attributes
                </p>
              )}
            </div>
          </form>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        type={confirmDialog.type}
      />
    </AdminLayout>
  );
};

export default EditProduct;