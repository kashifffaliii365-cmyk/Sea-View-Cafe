import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Image } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariant, ProductExtra } from '../../types';

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, categories, addProduct, updateProduct } = useStore();

  const isEditing = Boolean(id);
  const existing = isEditing ? products.find((p) => p.id === id) : null;

  // Form State
  const [name, setName] = useState(existing?.name || '');
  const [slug, setSlug] = useState(existing?.slug || '');
  const [category, setCategory] = useState(existing?.category || categories[0]?.id || '');
  const [price, setPrice] = useState(existing ? existing.price.toString() : '');
  const [description, setDescription] = useState(existing?.description || '');
  const [image, setImage] = useState(existing?.image || '');
  const [isAvailable, setIsAvailable] = useState(existing?.isAvailable ?? true);
  const [isPopular, setIsPopular] = useState(existing?.isPopular ?? false);
  const [prepMinutes, setPrepMinutes] = useState(existing?.preparationMinutes?.toString() || '15');
  const [dietaryInput, setDietaryInput] = useState(existing?.dietaryTags?.join(', ') || '');
  const [allergensInput, setAllergensInput] = useState(existing?.allergens?.join(', ') || '');

  // Variants & Extras
  const [variants, setVariants] = useState<ProductVariant[]>(existing?.variants || []);
  const [extras, setExtras] = useState<ProductExtra[]>(existing?.extras || []);

  const [newVarName, setNewVarName] = useState('');
  const [newVarDelta, setNewVarDelta] = useState('0');

  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState('1.00');

  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug when name changes if not manually set
  useEffect(() => {
    if (!isEditing && name && !slug) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  }, [name, isEditing, slug]);

  const handleAddVariant = () => {
    if (!newVarName.trim()) return;
    setVariants([
      ...variants,
      {
        id: `var-${Date.now()}`,
        name: newVarName.trim(),
        priceDelta: parseFloat(newVarDelta) || 0,
      },
    ]);
    setNewVarName('');
    setNewVarDelta('0');
  };

  const handleRemoveVariant = (varId: string) => {
    setVariants(variants.filter((v) => v.id !== varId));
  };

  const handleAddExtra = () => {
    if (!newExtraName.trim()) return;
    setExtras([
      ...extras,
      {
        id: `ext-${Date.now()}`,
        name: newExtraName.trim(),
        price: parseFloat(newExtraPrice) || 0,
      },
    ]);
    setNewExtraName('');
    setNewExtraPrice('1.00');
  };

  const handleRemoveExtra = (extId: string) => {
    setExtras(extras.filter((e) => e.id !== extId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please provide a valid item price in EUR.');
      return;
    }

    if (!name.trim() || !category) {
      setError('Please provide an item name and assign a category.');
      return;
    }

    const cleanSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cleanDiet = dietaryInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const cleanAllergens = allergensInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      slug: cleanSlug,
      category,
      price: Number(parsedPrice.toFixed(2)),
      description: description.trim(),
      image: image.trim() || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      isAvailable,
      isPopular,
      preparationMinutes: parseInt(prepMinutes, 10) || 15,
      dietaryTags: cleanDiet,
      allergens: cleanAllergens,
      variants,
      extras,
    };

    if (isEditing && id) {
      updateProduct(id, payload);
    } else {
      addProduct(payload);
    }

    navigate('/admin/menu');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/menu"
            className="p-2 text-gray-500 hover:text-gray-900 border border-gray-200 rounded-md"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-serif text-2xl font-bold text-[#123B52]">
            {isEditing ? `Edit: ${name}` : 'Create New Menu Item'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-xs">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Item Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Traditional Maltese Ravioli"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">URL Slug</label>
            <input
              type="text"
              placeholder="maltese-ravioli"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white focus:outline-none focus:border-[#123B52]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Price (EUR €) *</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="12.50"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">Factual Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Accurate description of ingredients, style and presentation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Dietary Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="Vegetarian, Gluten-Free, Vegan"
              value={dietaryInput}
              onChange={(e) => setDietaryInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Verified Allergens (comma-separated)
            </label>
            <input
              type="text"
              placeholder="Gluten, Dairy, Eggs, Nuts"
              value={allergensInput}
              onChange={(e) => setAllergensInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Estimated Prep Time (Minutes)
            </label>
            <input
              type="number"
              value={prepMinutes}
              onChange={(e) => setPrepMinutes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
            />
          </div>

          <div className="flex items-center gap-6 pt-5">
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="rounded text-[#123B52]"
              />
              <span>Available for Order</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="rounded text-[#123B52]"
              />
              <span>Feature on Popular List</span>
            </label>
          </div>
        </div>

        {/* Variants Section */}
        <div className="pt-6 border-t border-gray-100 space-y-3">
          <h3 className="font-serif text-sm font-bold text-[#123B52]">
            Product Variants / Sizes (e.g. Pint, 330ml, Double)
          </h3>
          <div className="space-y-2">
            {variants.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border text-xs">
                <span>{v.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold">+{v.priceDelta.toFixed(2)} EUR</span>
                  <button type="button" onClick={() => handleRemoveVariant(v.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Variant name (e.g. Draught Pint)"
              value={newVarName}
              onChange={(e) => setNewVarName(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs"
            />
            <input
              type="number"
              step="0.10"
              placeholder="+EUR"
              value={newVarDelta}
              onChange={(e) => setNewVarDelta(e.target.value)}
              className="w-24 px-3 py-1.5 border border-gray-200 rounded text-xs"
            />
            <button
              type="button"
              onClick={handleAddVariant}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 font-semibold rounded text-xs"
            >
              Add Variant
            </button>
          </div>
        </div>

        {/* Extras Section */}
        <div className="pt-6 border-t border-gray-100 space-y-3">
          <h3 className="font-serif text-sm font-bold text-[#123B52]">
            Add-ons & Extras (e.g. Extra Bacon, Mushroom sauce)
          </h3>
          <div className="space-y-2">
            {extras.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border text-xs">
                <span>{e.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold">+{e.price.toFixed(2)} EUR</span>
                  <button type="button" onClick={() => handleRemoveExtra(e.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Extra name (e.g. Melted Cheddar)"
              value={newExtraName}
              onChange={(e) => setNewExtraName(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-xs"
            />
            <input
              type="number"
              step="0.10"
              placeholder="Price EUR"
              value={newExtraPrice}
              onChange={(e) => setNewExtraPrice(e.target.value)}
              className="w-24 px-3 py-1.5 border border-gray-200 rounded text-xs"
            />
            <button
              type="button"
              onClick={handleAddExtra}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 font-semibold rounded text-xs"
            >
              Add Extra
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
          <Link
            to="/admin/menu"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-[#123B52] hover:bg-[#287D91] text-white font-semibold rounded-md flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Save Changes' : 'Create Item'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
