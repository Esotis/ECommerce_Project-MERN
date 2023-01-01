import axios from "../axios.js";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { updateProducts } from "../features/productSlice.js";
import ProductReview from "../components/ProductReview.js";

const categories = [
  {
    name: "Technology",
    img: "https://images.unsplash.com/photo-1518997554305-5eea2f04e384?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  {
    name: "Phones",
    img: "https://images.unsplash.com/photo-1464380573004-8ca85a08751a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cGhvbmV8ZW58MHx8MHx3aGl0ZXw%3D&auto=format&fit=crop&w=800&q=60",
  },

  {
    name: "Laptops",
    img: "https://images.unsplash.com/photo-1575909812264-6902b55846ad?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
];

function Home() {
  const products = useSelector((state) => state.products);
  const lastProducts = products.slice(0, 8);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get("/products").then(({ data }) => dispatch(updateProducts(data)));
  }, []);

  return (
    <div>
      <img
        src="https://res.cloudinary.com/learn-code-10/image/upload/v1653947013/yqajnhqf7usk56zkwqi5.png"
        alt=""
        className="home-banner"
      />
      {/* Featured Products */}
      <div className="featured-products-container container mt-4">
        <h2>Last Products</h2>
        <div className="d-flex justify-content-center flex-wrap">
          {lastProducts.map((product, index) => (
            <ProductReview key={index} {...product} />
          ))}
        </div>
        <div>
          <Link
            to="/category/all"
            style={{
              textAlign: "right",
              display: "block",
              textDecoration: "none",
            }}
          >
            See more {">>"}
          </Link>
        </div>
      </div>
      {/* Sale banner */}
      <div className="sale__banner--container mt-4">
        <img
          src="https://res.cloudinary.com/learn-code-10/image/upload/v1654093280/xkia6f13xxlk5xvvb5ed.png"
          alt=""
        />
      </div>
      <div className="recent-products-container container mt-4">
        <h2>Categories</h2>
        <Row>
          {categories.map((category) => (
            <LinkContainer
              to={`/category/${category.name.toLocaleLowerCase()}`}
              key={category.name}
            >
              <Col md={4}>
                <div
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.img})`,
                    gap: "10px",
                  }}
                  className="category-title"
                >
                  {category.name}
                </div>
              </Col>
            </LinkContainer>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;
