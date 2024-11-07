import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
});

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", description: "" });
  const [editItem, setEditItem] = useState({
    id: null,
    name: "",
    description: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get("/items");
      console.log("Fetched items raw data:", response.data); // Debug log
      // Ensure each item has a name and description
      const processedItems = response.data.map((item) => ({
        ...item,
        description: item.description ?? "", // Ensure description is never null/undefined
      }));
      console.log("Processed items:", processedItems); // Debug log
      setItems(processedItems);
      setError(null);
    } catch (error) {
      console.error("Error fetching items:", error);
      setError(`Error fetching items: ${error.message}`);
    }
  };

  const createItem = async (e) => {
    e.preventDefault();
    try {
      // Ensure we're sending both fields
      const itemToCreate = {
        name: newItem.name.trim(),
        description: newItem.description.trim(),
      };
      console.log("Creating item with data:", itemToCreate); // Debug log

      const response = await api.post("/items", itemToCreate);
      console.log("Create response:", response.data); // Debug log

      // Only reset form if the creation was successful
      setNewItem({ name: "", description: "" });
      await fetchItems();
    } catch (error) {
      console.error("Error creating item:", error);
      setError(`Error creating item: ${error.message}`);
    }
  };

  const updateItem = async (e) => {
    e.preventDefault();
    try {
      const itemToUpdate = {
        name: editItem.name.trim(),
        description: editItem.description.trim(),
      };
      console.log("Updating item with data:", itemToUpdate); // Debug log

      const response = await api.put(`/items/${editItem.id}`, itemToUpdate);
      console.log("Update response:", response.data); // Debug log

      setEditItem({ id: null, name: "", description: "" });
      await fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
      setError(`Error updating item: ${error.message}`);
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      await fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      setError(`Error deleting item: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Item Manager</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={createItem} className="mb-4">
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          placeholder="New item name"
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })}
          placeholder="New item description"
          className="border p-2 mr-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded disabled:bg-blue-300"
          disabled={!newItem.name.trim() || !newItem.description.trim()}
        >
          Add Item
        </button>
      </form>

      <ul>
        {items.map((item) => (
          <li key={item.id} className="mb-4 p-2 border">
            {editItem.id === item.id
              ? (
                <form onSubmit={updateItem} className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={editItem.name}
                    onChange={(e) =>
                      setEditItem({ ...editItem, name: e.target.value })}
                    className="border p-1"
                    required
                  />
                  <input
                    type="text"
                    value={editItem.description}
                    onChange={(e) =>
                      setEditItem({ ...editItem, description: e.target.value })}
                    className="border p-1"
                    required
                  />
                  <div>
                    <button
                      type="submit"
                      className="bg-green-500 text-white p-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditItem({ id: null, name: "", description: "" })}
                      className="bg-gray-500 text-white p-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )
              : (
                <>
                  <h3 className="font-bold">{item.name}</h3>
                  <p>
                    {item.description
                      ? item.description
                      : "No description provided"}
                  </p>
                  <div className="mt-2">
                    <button
                      onClick={() =>
                        setEditItem({
                          id: item.id,
                          name: item.name,
                          description: item.description || "",
                        })}
                      className="bg-yellow-500 text-white p-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
