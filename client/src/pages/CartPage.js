import React from "react";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./CartPage.css";
import { Alert, Col, Container, Row, Table } from "react-bootstrap";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import {
  useIncreaseCartProductMutation,
  useDecreaseCartProductMutation,
  useRemoveFromCartMutation,
} from "../services/appApi";
import "./CartPage.css";
import CheckoutForm from "../components/CheckoutForm";

// load the Stripe Element and others asynchronusly (put outside the component function to avoid recreating)
const stripePromise = loadStripe(
  "pk_test_51M7GUQLCh25cTyCvjx1Pec5POFd8m6enJDhaHbztO3EtGBy9c2bxeQNxBAsLKDkYVDJYwHTSq7tRNrijnzTN98Bx003O7AJw1f"
);

function CartPage() {
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  const userCartObj = user.cart;
  let cart = products.filter((product) => userCartObj[product._id] != null);
  const [increaseCart] = useIncreaseCartProductMutation();
  const [decreaseCart] = useDecreaseCartProductMutation();
  const [removeCart, { isLoading }] = useRemoveFromCartMutation();

  function handleDecrease(product) {
    const quantity = user.cart.count;
    if (quantity == 0) return alert("Can't Proceed");
    decreaseCart(product);
  }

  return (
    <Container style={{ minHeight: "95vh" }} className="cart-container">
      <Row>
        <Col>
          <h1 className="pt-2 h3">Shopping cart</h1>
          {cart.length === 0 ? (
            <Alert variant="info">
              Shopping cart is empty. Add products to your cart
            </Alert>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
        </Col>
        {cart.length > 0 && (
          <Col md={5}>
            <>
              <Table responsive="sm" className="cart-table">
                <thead>
                  <tr>
                    <th>&nbsp;</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {/* loop through cart products */}
                  {cart.map((item) => (
                    <tr key={item._id}>
                      <td>&nbsp;</td>
                      <td>
                        {!isLoading && (
                          <FaTimes
                            style={{ marginRight: 10, cursor: "pointer" }}
                            onClick={() =>
                              removeCart({
                                productId: item._id,
                                price: item.price,
                                userId: user._id,
                              })
                            }
                          />
                        )}
                        <img
                          src={item.pictures[0].url}
                          alt="user-cart-product"
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>${item.price}</td>
                      <td>
                        <span className="quantity-indicator">
                          <FaPlus
                            style={{
                              cursor: "pointer",
                              display: "inline-block",
                              marginRight: "5px",
                            }}
                            onClick={() =>
                              increaseCart({
                                productId: item._id,
                                price: item.price,
                                userId: user._id,
                              })
                            }
                          />
                          <span>{user.cart[item._id]}</span>
                          <FaMinus
                            style={{
                              cursor: "pointer",
                              display: "inline-block",
                              marginLeft: "5px",
                            }}
                            onClick={() =>
                              handleDecrease({
                                productId: item._id,
                                price: item.price,
                                userId: user._id,
                              })
                            }
                          />
                        </span>
                      </td>
                      <td>${item.price * user.cart[item._id]}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div>
                <h3 className="h4 pt-4">Total: ${user.cart.total}</h3>
              </div>
            </>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default CartPage;
