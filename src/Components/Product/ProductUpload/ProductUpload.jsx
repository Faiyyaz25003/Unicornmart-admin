import React, { useState } from "react";
import { X, Plus, Upload } from "lucide-react";
import axios from "axios";

const ProductUpload = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    scrapName: "",
    customScrapName: "",
    category: "",
    customCategory: "",
    type: "",
    customType: "",
    quantity: "",
    price: "",
    condition: "",
    pickupLocation: "",
    pickup: "free",
    customPickup: "",
    images: [],
  });

  const [showCustomScrapName, setShowCustomScrapName] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCustomType, setShowCustomType] = useState(false);

  const scrapData = {
    "Iron Scrap": { category: "Metal", type: "Iron" },
    "Copper Scrap": { category: "Metal", type: "Copper" },
    "Aluminum Scrap": { category: "Metal", type: "Aluminum" },
    "Steel Scrap": { category: "Metal", type: "Steel" },
    "Plastic Scrap": { category: "Plastic", type: "PET" },
    "Paper Scrap": { category: "Paper", type: "Cardboard" },
    "E-Waste": { category: "Electronic", type: "Mixed" },
  };

  const handleScrapNameChange = (value) => {
    if (value === "custom") {
      setShowCustomScrapName(true);
      setFormData({ ...formData, scrapName: "", category: "", type: "" });
    } else {
      const data = scrapData[value];
      setShowCustomScrapName(false);
      setFormData({
        ...formData,
        scrapName: value,
        customScrapName: "",
        category: data.category,
        type: data.type,
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFormData({ ...formData, images: [...formData.images, ...newImages] });
  };

  const removeImage = (index) => {
    const imgs = [...formData.images];
    URL.revokeObjectURL(imgs[index].preview);
    imgs.splice(index, 1);
    setFormData({ ...formData, images: imgs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      data.append("scrapName", formData.scrapName || formData.customScrapName);
      data.append("category", formData.category);
      data.append("type", formData.type);
      data.append("quantity", formData.quantity);
      data.append("price", formData.price);
      data.append("condition", formData.condition);
      data.append("pickupLocation", formData.pickupLocation);
      data.append(
        "pickup",
        formData.pickup === "custom" ? formData.customPickup : formData.pickup
      );

      formData.images.forEach((img) => {
        data.append("images", img.file);
      });

      await axios.post("http://localhost:5000/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product Added Successfully");

      setFormData({
        scrapName: "",
        customScrapName: "",
        category: "",
        customCategory: "",
        type: "",
        customType: "",
        quantity: "",
        price: "",
        condition: "",
        pickupLocation: "",
        pickup: "free",
        customPickup: "",
        images: [],
      });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Add Scrap Product</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Scrap Name */}
          <div>
            <label className="font-medium">Scrap Name</label>
            {!showCustomScrapName ? (
              <select
                className="w-full border p-3 rounded"
                value={formData.scrapName}
                onChange={(e) => handleScrapNameChange(e.target.value)}
                required
              >
                <option value="">Select Scrap</option>
                {Object.keys(scrapData).map((name) => (
                  <option key={name}>{name}</option>
                ))}
                <option value="custom">+ Custom</option>
              </select>
            ) : (
              <input
                className="w-full border p-3 rounded"
                placeholder="Custom Scrap Name"
                value={formData.customScrapName}
                onChange={(e) =>
                  setFormData({ ...formData, customScrapName: e.target.value })
                }
                required
              />
            )}
          </div>

          {/* Category & Type */}
          <div className="grid grid-cols-2 gap-4">
            <input
              className="border p-3 rounded"
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            />
            <input
              className="border p-3 rounded"
              placeholder="Type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              required
            />
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              className="border p-3 rounded"
              placeholder="Quantity (Kg)"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              required
            />
            <input
              type="number"
              className="border p-3 rounded"
              placeholder="Price / Kg"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>

          {/* Condition & Location */}
          <input
            className="border p-3 rounded w-full"
            placeholder="Condition"
            value={formData.condition}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value })
            }
            required
          />
          <input
            className="border p-3 rounded w-full"
            placeholder="Pickup Location"
            value={formData.pickupLocation}
            onChange={(e) =>
              setFormData({ ...formData, pickupLocation: e.target.value })
            }
            required
          />

          {/* Images */}
          <div>
            <label className="font-medium">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className="grid grid-cols-5 gap-3 mt-3">
              {formData.images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img.preview}
                    className="h-24 w-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold"
          >
            {loading ? "Submitting..." : "Submit Scrap Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductUpload;
