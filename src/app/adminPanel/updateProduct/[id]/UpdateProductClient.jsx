"use client";
import { deleteObject, ref as storageRef } from "firebase/storage";

import { useEffect, useRef, useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, storage } from "@/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

export default function UpdateProductClient({ product }) {

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tempColor, setTempColor] = useState("");
  const [tempSize, setTempSize] = useState("");
  const [dragIndex, setDragIndex] = useState(null);
const [tempTag, setTempTag] = useState("");
const [descDragIndex, setDescDragIndex] = useState(null);


  const [form, setForm] = useState({
    ...product,
    price: product.price || "",
    category: product.category || [],
    desc: product.desc || [{ title: "", desc: "" }],
    color: product.color || [],
    sizes: product.sizes || [],
    tags: product.tags || [],
    photo: product.photo || [],
    isDeal: product.isDeal || false,
    isNewArrival: product.isNewArrival || false,
    stock: product.stock || {}

  });
  
  const originalRef = useRef(JSON.stringify(product));
const isChanged =
  JSON.stringify(form) !== originalRef.current;


  /* 🔹 Fetch categories */
  useEffect(() => {
    const fetchCategories = async () => {
      const snap = await getDoc(doc(db, "admin", "categories"));
      if (snap.exists()) setCategories(snap.data().list || []);
    };
    fetchCategories();
  }, []);

  /* 🔹 Basic handlers */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCategoryChange = (e) =>
    setForm({
      ...form,
      category: Array.from(e.target.selectedOptions).map(o => o.value),
    });

  /* 🔹 Desc handlers */
  const addDesc = () =>
    setForm({ ...form, desc: [...form.desc, { title: "", desc: "" }] });

  const removeDesc = (i) =>
    setForm({ ...form, desc: form.desc.filter((_, idx) => idx !== i) });

  const handleDescChange = (i, key, val) => {
    const d = [...form.desc];
    d[i][key] = val;
    setForm({ ...form, desc: d });
  };
  const handleStockChange = (color, size, value) => {
  setForm(prev => ({
    ...prev,
    stock: {
      ...prev.stock,
      [color]: {
        ...prev.stock?.[color],
        [size]: Number(value),
      },
    },
  }));
};

const isSizeActive = (size) => form.sizes.includes(size);


  /* 🔹 Color / Size chip logic */
 const handleKeyAdd = (e, key, temp, setTemp) => {
  if (e.key !== "Enter" && e.key !== " ") return;

  e.preventDefault();

  const value = temp.trim().toLowerCase();
  if (!value) return;
  if (form[key].includes(value)) return;

  setForm((prev) => ({
    ...prev,
    [key]: [...prev[key], value],
  }));

  setTemp("");
};


  const removeChip = (key, val) => {
  setForm((prev) => {
    // 🟥 color remove → stock remove
    if (key === "color") {
      const newStock = { ...prev.stock };
      delete newStock[val];

      return {
        ...prev,
        color: prev.color.filter((c) => c !== val),
        stock: newStock,
      };
    }

    // 🟨 size remove → remove size from all colors
    if (key === "sizes") {
      const newStock = { ...prev.stock };
      Object.keys(newStock).forEach((color) => {
        delete newStock[color]?.[val];
      });

      return {
        ...prev,
        sizes: prev.sizes.filter((s) => s !== val),
        stock: newStock,
      };
    }

    // 🟦 tags / others
    return {
      ...prev,
      [key]: prev[key].filter((v) => v !== val),
    };
  });
};

  /* 🔹 Images */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, photo: [...form.photo, file] });
  };

  const removeImage = (img) =>
    setForm({ ...form, photo: form.photo.filter(p => p !== img) });

  const copyStockToAllColors = (sourceColor) => {
  setForm((prev) => {
    const source = prev.stock[sourceColor];
    if (!source) return prev;

    const newStock = { ...prev.stock };
    prev.color.forEach((c) => {
      newStock[c] = { ...source };
    });

    return { ...prev, stock: newStock };
  });
};
const handleDeleteImage = async (img, index) => {
  if (form.photo.length === 1) {
    toast.error("At least one product image is required");
    return;
  }

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this image?"
  );
  if (!confirmDelete) return;

  try {
    console.log('img.url is ',img?.url);

    
    if (img?.url) {
      try
      {
  const imgRef = ref(storage, img.url); // 🔥 THIS WORKS
      await deleteObject(imgRef);
      }
      catch(err)
      {
        console.error('Error in delete image:', err);
      }
    
    }

    setForm((prev) => ({
      ...prev,
      photo: prev.photo.filter((_, i) => i !== index),
    }));

    toast.success("Image deleted successfully");
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete image");
  }
};


  /* 🔹 Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoData = [];

for (const p of form.photo) {
  if (p instanceof File) {
    const path = `photos/${Date.now()}_${p.name}`;
    const r = ref(storage, path);

    await uploadBytes(r, p);
    const url = await getDownloadURL(r);

    photoData.push({
      url,
      path,
      alt: p.name || "",
    });
  } else {
    // already existing image object
    photoData.push(p);
  }
}

      Object.keys(form.stock).forEach((color) => {
  if (!form.color.includes(color)) delete form.stock[color];
});

const totalStock = Object.values(form.stock || {})
  .flatMap(color => Object.values(color || {}))
  .reduce((a, b) => a + Number(b || 0), 0);

const isOutOfStock = totalStock === 0;

 await updateDoc(doc(db, "products", form.id), {
  ...form,
  price: Number(form.price),
photo: photoData,

  isOutOfStock,
});

toast.success("Product updated successfully ✅", {
  duration: 3000,
});

    } catch (err) {
      console.error(err);
        toast.error("Update failed ❌");

    }

    setLoading(false);
  };

  return (
    <div className="container pb-5">
      <h3 className="mt-4">Update Product</h3>
     

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <h6>Title</h6>
        <input className="form-control mb-3" name="title" value={form.title} onChange={handleChange} />

        {/* Subtitle */}
        <h6>Subtitle</h6>
        <input className="form-control mb-3" name="subTitle" value={form.subTitle} onChange={handleChange} />

        {/* Price */}
        <h6>Price</h6>
        <input type="number" className="form-control mb-3" name="price" value={form.price} onChange={handleChange} />

        {/* Category */}
        <h6>Category</h6>
        <select multiple className="form-select mb-3" value={form.category} onChange={handleCategoryChange}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>

        {/* Toggles */}
        <div className="d-flex gap-4 mb-4">
          <div>
            <input type="checkbox" checked={form.isDeal} onChange={e => setForm({ ...form, isDeal: e.target.checked })} /> Deal
          </div>
          <div>
            <input type="checkbox" checked={form.isNewArrival} onChange={e => setForm({ ...form, isNewArrival: e.target.checked })} /> New Arrival
          </div>
        </div>

        {/* Colors */}
        <h6>Colors</h6>
        <input
          className="form-control mb-2"
          placeholder="Type color & press Enter"
          value={tempColor}
          onChange={e => setTempColor(e.target.value)}
          onKeyDown={e => handleKeyAdd(e, "color", tempColor, setTempColor)}
        />
        <div className="mb-3">
          {form.color.map(c => (
            <span key={c} className="badge bg-secondary me-2">
              {c} <span style={{ cursor: "pointer" }} onClick={() => removeChip("color", c)}>×</span>
            </span>
          ))}
        </div>

        {/* Sizes */}
        <h6>Sizes</h6>
        <input
          className="form-control mb-2"
          placeholder="Type size & press Enter"
          value={tempSize}
          onChange={e => setTempSize(e.target.value)}
          onKeyDown={e => handleKeyAdd(e, "sizes", tempSize, setTempSize)}
        />
        <div className="mb-3">
          {form.sizes.map(s => (
            <span key={s} className="badge bg-dark me-2">
              {s} <span style={{ cursor: "pointer" }} onClick={() => removeChip("sizes", s)}>×</span>
            </span>
          ))}
        </div>
        {form.color.length > 0 && form.sizes.length > 0 && (
  <>
    <h6 className="mt-4">Stock Per Color & Size</h6>
{form.color.map((color) => (
  <div key={color} className="border rounded p-3 mb-3">
    <strong className="text-capitalize">{color}</strong>

    {form.sizes.map((size) => (
      <div
        key={size}
        className="d-flex align-items-center gap-2 mt-2"
      >
        <span style={{ width: 60 }}>{size}</span>
<input
  type="number"
  disabled={!isSizeActive(size)}
  min="0"
  className="form-control"
  style={{ maxWidth: 120 }}
  value={form.stock?.[color]?.[size] || ""}
  onChange={(e) =>
    handleStockChange(color, size, e.target.value)
  }
/>


        {/* 🔥 Low stock warning */}
     {Number(form.stock?.[color]?.[size]) > 0 &&
 Number(form.stock?.[color]?.[size]) < 5 && (
   <small className="text-danger">Low stock ⚠</small>
 )}

      </div>
    ))}

    {/* ✅ COPY STOCK BUTTON — YAHI LAGTA HAI */}
    <button
      type="button"
      className="btn btn-sm btn-outline-secondary mt-3"
      onClick={() => copyStockToAllColors(color)}
    >
      Copy stock of {color} to all colors
    </button>
  </div>
))}

  </>
)}



      {/* Descriptions */}
<h6>Description Sections</h6>

{form.desc.map((d, i) => (
  <div
    key={i}
    draggable
    onDragStart={() => setDescDragIndex(i)}
    onDragOver={(e) => e.preventDefault()}
    onDrop={() => {
      const items = [...form.desc];
      const draggedItem = items[descDragIndex];

      items.splice(descDragIndex, 1);
      items.splice(i, 0, draggedItem);

      setForm({ ...form, desc: items });
      setDescDragIndex(null);
    }}
    className="border p-3 mb-3"
    style={{
      cursor: "grab",
      background: "#fff",
      userSelect: "none",
    }}
  >
    {/* 👇 YAHAN ADD KARNA THA */}
    <div className="text-muted mb-2" style={{ fontSize: 14 }}>
      ☰ Drag section
    </div>

    <input
      className="form-control mb-2"
      value={d.title}
      onChange={(e) => handleDescChange(i, "title", e.target.value)}
    />

    <textarea
      className="form-control mb-2"
      rows={3}
      value={d.desc}
      onChange={(e) => handleDescChange(i, "desc", e.target.value)}
    />

    <button
      type="button"
      className="btn btn-sm btn-danger"
      onClick={() => removeDesc(i)}
    >
      Remove
    </button>
  </div>
))}

<button
  type="button"
  className="btn btn-outline-primary mb-4"
  onClick={addDesc}
>
  + Add Section
</button>

<h6 className="mt-4">Images (Drag to reorder)</h6>

<input type="file" onChange={handleFileChange} />

<div className="d-flex flex-wrap gap-2 mt-3">
  {form.photo.map((img, index) => (
    <div
      key={index}
      draggable
      onDragStart={() => setDragIndex(index)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => {
        const items = [...form.photo];
        const dragged = items[dragIndex];
        items.splice(dragIndex, 1);
        items.splice(index, 0, dragged);
        setForm({ ...form, photo: items });
      }}
      style={{
        width: 90,
        cursor: "grab",
        border: "2px dashed #ddd",
        padding: 4,
        position: "relative",
      }}
    >
      <img
        src={
          img instanceof File
            ? URL.createObjectURL(img)
            : img.url || img
        }
        width="100%"
        style={{ borderRadius: 6 }}
      />

      {/* 🔥 DELETE BUTTON */}
      <button
        type="button"
        onClick={() => handleDeleteImage(img, index)}
        style={{
          position: "absolute",
          top: 2,
          right: 4,
          background: "red",
          color: "white",
          borderRadius: "50%",
          border: "none",
          width: 22,
          height: 22,
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  ))}
</div>

<h6 className="mt-4">Tags</h6>

<input
  className="form-control mb-2"
  placeholder="Type tag & press Enter"
  value={tempTag}
  onChange={(e) => setTempTag(e.target.value)}
  onKeyDown={(e) =>
    handleKeyAdd(e, "tags", tempTag, setTempTag)
  }
/>

<div className="mb-3">
  {form.tags.map((t) => (
    <span key={t} className="badge bg-info text-dark me-2">
      {t}
      <span
        onClick={() => removeChip("tags", t)}
        style={{ cursor: "pointer", marginLeft: 6 }}
      >
        ×
      </span>
    </span>
  ))}
</div>


<button
  className="btn btn-primary mt-4"
  disabled={loading || !isChanged}
>
  {loading ? "Updating..." : "Update Product"}
</button>

      </form>
    </div>
  );
}
