import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
 import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   

//items total price




console.log(cart, "dghj");

  // total price
  const totalPrice = () => {
    try {
      let total = 0;
      // let ip=0;
    
      console.log(cart, "llll");
  
      cart?.map((item) => {
     
        total += item.price;    
        // ip+=item.price; 
     
        let taxation = item.price * (5 / 100);
        total += taxation;
  
        let discount = item.price * (10 / 100);
        total -= discount;
      });
    
      var shippingCharge = 15;
      if (total !== 0) {
        total += shippingCharge;
      } else {
        total = 0;
      }
  
      const formattedTotal = total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
  
      return formattedTotal;
    } catch (error) {
      console.log(error);
    }
  };

  
  
  
  // Call the function to calculate the total price and log it to the console along with "bhavesh"
  // console.log("bhavesh", totalPrice());

  
  
  //delete item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
     
      
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);


  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const placeorder =()=>{
    
     alert("Hurrah😍! Order placed successfully🎁");

    
    localStorage.setItem("order",JSON.stringify(cart))
    
    localStorage.removeItem("cart")
    
    window.location.reload();
  }
  const [product, setProduct] = useState({
    name: 'Product Name',
    description: 'Product Description',
    price: 10.00, // Initial price
    qty: 1,      // Initial quantity
  });

  const handleIncrement = () => {
    // Increment the quantity by 1
    const updatedQty = product.qty + 1;

    // Calculate the new total price based on the updated quantity
    const updatedPrice = product.price * updatedQty;
    

    // Update the product object with the new quantity and total price
    setProduct({
      ...product,
      qty: updatedQty,
      price: updatedPrice,
    });
  };
  
  
  return (
    <Layout>
      <div className=" cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1 ">
              {!auth?.user
                ? "Hello! Guest"
                : `Hello!  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty😔"}
              </p>
              <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/")}
                    >
                      Shop now
              </button>
            </h1>
                    
          
            
          </div>
        </div>
        <div className="container ">
          <div className="row ">
            <div className="col-md-7  p-0 m-0">
              {cart?.map((p) => (
                <div className="row card flex-row " key={p._id}>
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width="100%"
                      height={"130px"}
                    />
                  </div>
                  {/* <div className="col-md-4 border">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p>Price : {p.price}</p>
                    <button onClick={handleincrement=()=>{{}}>increment</button>
                  </div> */}

<div className="col-md-4 ">
      <p>{p.name}</p>
      <p>{p.description.substring(0, 30)}</p>
      <p>Price: {p.price}</p>
      {/* <p>Quantity: {p.qty}</p>
      <button onClick={handleIncrement}>Increment</button> */}
    </div>

                  {/* <div className="col-md-4">
                      
                      <button onclick="increment()">+</button>
                      <p id="counter">0</p>
                      <button onclick="decrement()">-</button>
                  </div> */}
                  
                  


                <div className="col-md-4 cart-remove-btn">

                


                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>


                </div>
              ))}
            </div>

           


            <div className="col-md-5 cart-summary ">
              <h2>Cart Summary</h2>
              {/* <p>Total | Checkout | Payment</p> */}
              <hr />
            
            <p>{cart ? <><h4>Total Product Price :-$ {cart.reduce((sum, product) => sum + product.price, 0)}</h4></> : <>loading</> }</p> 
              <h4>Discount :- 10% </h4>
              <h4>Taxation :- 5%</h4>
              <h4>Shipping charge :- $15</h4>
              <h4>Total :- {totalPrice()} </h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>

                  <div className="mb-3">
                    {/* <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5> */}
                    <button
                    
                      className="btn btn-outline-warning"
                      onClick={placeorder}
                      
                      //  onClick={"/"}
                      
                    >
                      Place order
                     

                    </button>
                   
                    
                   
                  </div>


                
                  

                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                    Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Please Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;

