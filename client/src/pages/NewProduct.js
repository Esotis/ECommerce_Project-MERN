import React, { useState } from "react";
import "./NewProduct.css";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../services/appApi";
import { Alert, Col, Container, Form, Row, Button } from "react-bootstrap";
import { FaTimesCircle } from "react-icons/fa";
import axios from "../axios.js";

function NewProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imgToRemove, setImgToRemove] = useState(null);
  const navigate = useNavigate();
  const [createProduct, { error, isError, isLoading, isSuccess }] =
    useCreateProductMutation();

  function handleRemoveImage(removedImage) {
    setImgToRemove(removedImage.public_id);
    axios
      .delete(`/images/${removedImage.imageId}`, { data: removedImage })
      .then((res) => {
        setImgToRemove(null);
        setImages((images) =>
          images.filter((image) => image.public_id !== removedImage.public_id)
        );
      })
      .catch((error) => console.log(error));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !description || !price || !category || !images.length) {
      return alert("Please fil out all the fields");
    }
    createProduct({ name, description, price, category, images }).then(
      ({ data }) => {
        if (data.length > 0) {
          console.log("Success creating product");
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      }
    );
  }

  function showWidget(e) {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "coffins",
        uploadPreset: "muexhl73",
        folder: "MERN-E-Commerce",
      },
      (error, result) => {
        if (!error && result.event === "success") {
          // console.log(result.info);
          const id = result.info.public_id.replace("MERN-E-Commerce/", "");
          setImages((prevState) => [
            ...prevState,
            {
              url: result.info.url,
              public_id: result.info.public_id,
              imageId: id,
            },
          ]);
        }
      }
    );
    widget.open();
  }

  return (
    <>
      <Container>
        <Row>
          <Col md={6} className="new-product__form--container">
            <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
              <h1 className="mt-4">Create a product</h1>
              {isSuccess && (
                <Alert variant="success">Product created with succcess</Alert>
              )}
              {isError && <Alert variant="danger">{error.data}</Alert>}
              <Form.Group className="mb-3">
                <Form.Label>Product name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Product description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Product description"
                  style={{ height: "100px" }}
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price($)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Price ($)"
                  value={price}
                  required
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                onChange={(e) => setCategory(e.target.value)}
              >
                <Form.Label>Category</Form.Label>
                <Form.Select>
                  <option selected disabled>
                    -- Select One --
                  </option>
                  <option value="technology">technology</option>
                  <option value="phones">phones</option>
                  <option value="laptops">laptops</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Button type="button" onClick={showWidget}>
                  Upload Images
                </Button>
                <div className="images-preview-container">
                  {images.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={image.url} alt="product-review" />
                      {imgToRemove !== image.public_id && (
                        <FaTimesCircle
                          className="image-preview-icon"
                          onClick={() => handleRemoveImage(image)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Form.Group>

              <Form.Group>
                <Button type="submit" disabled={isLoading || isSuccess}>
                  Create Product
                </Button>
              </Form.Group>
            </Form>
          </Col>
          <Col md={6} className="new-product__image--container"></Col>
        </Row>
      </Container>
    </>
  );
}

export default NewProduct;
