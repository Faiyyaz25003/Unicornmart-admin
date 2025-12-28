"use client";
import React, { useEffect, useState } from "react";
import { MapPin, Heart, ShoppingCart, Info } from "lucide-react";

const ProductApprove = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const API = "http://localhost:5000/api/products";
  const BACKEND_URL = "http://localhost:5000";

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProducts(data);

      const initialSelection = {};
      data.forEach((product) => {
        initialSelection[product._id] = 0;
      });
      setSelectedImages(initialSelection);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Approve product
  const handleApprove = async (id) => {
    try {
      await fetch(`${API}/${id}/approve`, { method: "POST" });
      alert("✅ Product Approved");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Approval failed");
    }
  };

  // Interested product
  const handleInterested = async (id) => {
    try {
      await fetch(`${API}/${id}/interested`, { method: "POST" });
      alert("❤️ Interest Sent");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send interest");
    }
  };

  // Buy Now
  const handleBuyNow = (product) => {
    alert(
      `🛒 Buying ${product.scrapName}\nPrice: ₹${product.price}/Kg\nQuantity: ${product.quantity} Kg`
    );
  };

  // Start editing
  const handleEditStart = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      scrapName: product.scrapName,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      type: product.type,
      location: product.location || "Mumbai, Maharashtra",
    });
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  // Update product
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        alert("✅ Product Updated Successfully");
        setEditingProduct(null);
        setEditForm({});
        fetchProducts();
      } else {
        alert("❌ Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await fetch(`${API}/${id}`, { method: "DELETE" });
        alert("🗑️ Product Deleted");
        fetchProducts();
      } catch (err) {
        console.error(err);
        alert("❌ Delete failed");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Scrap Products
        </h1>

        <div className="space-y-6">
          {products.map((product) => {
            const productImages =
              product.images && product.images.length > 0
                ? product.images
                : ["https://via.placeholder.com/400x300?text=Scrap+Material"];

            const selectedIndex = selectedImages[product._id] || 0;

            const currentImage = productImages[selectedIndex]
              ? `${BACKEND_URL}/${productImages[selectedIndex]}`
              : productImages[0];

            return (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left: Image Section */}
                  <div className="md:w-1/2 p-6">
                    {/* Main Image */}
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <img
                        src={currentImage}
                        alt={product.scrapName}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=Image+Not+Found";
                        }}
                      />
                      {product.status === "approved" && (
                        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          Approved
                        </span>
                      )}
                    </div>

                    {/* Thumbnail Images */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {productImages.slice(0, 3).map((img, i) => {
                        const thumbnailUrl = img.startsWith("http")
                          ? img
                          : `${BACKEND_URL}/${img}`;

                        return (
                          <div
                            key={i}
                            onClick={() =>
                              setSelectedImages({
                                ...selectedImages,
                                [product._id]: i,
                              })
                            }
                            className={`bg-gray-100 rounded-lg overflow-hidden h-20 cursor-pointer ${
                              selectedIndex === i
                                ? "border-2 border-blue-500"
                                : "border-2 border-transparent"
                            } hover:opacity-80 transition-all`}
                          >
                            <img
                              src={thumbnailUrl}
                              alt={`Thumbnail ${i + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/150x100?text=No+Image";
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Action Buttons Below Images */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleInterested(product._id)}
                          className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          Show Interest
                        </button>
                        <button
                          onClick={() => handleBuyNow(product)}
                          className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Buy Now
                        </button>
                      </div>

                      {/* Edit and Delete Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleEditStart(product)}
                          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit Product
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete Product
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Product Details */}
                  <div className="md:w-1/2 p-6">
                    {/* Edit Mode */}
                    {editingProduct === product._id ? (
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                          Edit Product
                        </h2>

                        {/* Edit Form */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Scrap Name
                            </label>
                            <input
                              type="text"
                              value={editForm.scrapName}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  scrapName: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price (₹/Kg)
                              </label>
                              <input
                                type="number"
                                value={editForm.price}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    price: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity (Kg)
                              </label>
                              <input
                                type="number"
                                value={editForm.quantity}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    quantity: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                              </label>
                              <input
                                type="text"
                                value={editForm.category}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    category: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                              </label>
                              <input
                                type="text"
                                value={editForm.type}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    type: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={editForm.location}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  location: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Edit Action Buttons */}
                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => handleUpdate(product._id)}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                          {product.scrapName}
                        </h2>

                        {/* Location */}
                        <div className="flex items-center text-gray-500 text-sm mb-6">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>
                            {product.location || "Mumbai, Maharashtra"}
                          </span>
                        </div>

                        {/* Price Section */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-5">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-600">
                              Unit Price
                            </span>
                            <span className="text-2xl font-bold text-green-700">
                              ₹{product.price}/Kg
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-600">
                              Quantity Available
                            </span>
                            <span className="text-base font-semibold text-gray-700">
                              {product.quantity} Kg
                            </span>
                          </div>
                          <div className="border-t border-green-200 pt-3 mt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-base font-semibold text-gray-700">
                                Total Value
                              </span>
                              <span className="text-2xl font-bold text-green-700">
                                ₹
                                {(
                                  product.price * product.quantity
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Category & Type */}
                        <div className="grid grid-cols-2 gap-4 mb-5">
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">
                              Category
                            </span>
                            <span className="text-sm font-semibold text-gray-800">
                              {product.category}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">
                              Type
                            </span>
                            <span className="text-sm font-semibold text-gray-800">
                              {product.type}
                            </span>
                          </div>
                        </div>

                        {/* Pickup Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
                          <div className="flex items-start">
                            <div className="bg-blue-100 rounded p-1.5 mr-3">
                              <svg
                                className="w-4 h-4 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-blue-800 mb-1">
                                Pickup Available
                              </p>
                              <p className="text-sm text-blue-700">
                                Seller offers pickup service at{" "}
                                {product.location || "Mumbai, Maharashtra"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          {product.status !== "approved" && (
                            <button
                              onClick={() => handleApprove(product._id)}
                              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                            >
                              Approve Product
                            </button>
                          )}
                        </div>

                        {/* Warning Message */}
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-start">
                            <Info className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-yellow-800">
                              Please verify product condition and quantity
                              before finalizing the purchase. Contact seller for
                              bulk orders or special requirements.
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductApprove;
