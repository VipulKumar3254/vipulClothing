import React, { useEffect, useState } from "react";
import { db } from "../../../../../firebaseConfig"; // Adjust the import path as necessary
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
// import "../../css/links.css"; // optional custom CSS

const Links = () => {
  const [links, setLinks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({ name: "", path: "" });

  const fetchLinks = async () => {
    try {
      const linksRef = collection(db, "admin", "links", "links");
      const snapshot = await getDocs(linksRef);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLinks(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching links:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "admin", "links", "links", id);
      await deleteDoc(docRef);
      setLinks(prev => prev.filter(link => link.id !== id));
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const handleEdit = (link) => {
    setEditingId(link.id);
    setEditedData({ name: link.name, path: link.path });
  };

  const handleUpdate = async () => {
    try {
      console.log("Editing ID:", editingId);
      console.log("Editing data:", editedData);
      const docRef = doc(db, "admin", "links", "links", editingId);
      await updateDoc(docRef, editedData);
      setLinks(prev =>
        prev.map(link =>
          link.id === editingId ? { ...link, ...editedData } : link
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end me-3">
        <Link to="/admin/addlink" className="btn btn-primary mb-3">
          Add Navbar Link
        </Link>
      </div>
      <h2 className="text-center"> Manage Navbar Links</h2>
      <div className="row">
        {links.map((link) => (
          <div key={link.id} className="col-md-4 mb-3">
            <Card>
              <Card.Body>
                {/* <p className="text-primary">Name:  {link.name}</p>
                  <p className="text-primary">Path:  {link.path}</p> */}

                {editingId === link.id ? (
                  <>
                    <Form.Control
                      className="mb-2"
                      type="text"
                      value={editedData.name}
                      onChange={(e) =>
                        setEditedData({ ...editedData, name: e.target.value })
                      }
                    />
                    <Form.Control
                      className="mb-2"
                      type="text"
                      value={editedData.path}
                      onChange={(e) =>
                        setEditedData({ ...editedData, path: e.target.value })
                      }
                    />
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleUpdate}
                      className="me-2"
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Card.Title>{link.name}</Card.Title>
                    <Card.Text>
                      <a href={link.path} target="_blank" rel="noopener noreferrer">
                        {link.path}
                      </a>
                    </Card.Text>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(link)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(link.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Links;
