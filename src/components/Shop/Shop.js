import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
import { addToDb } from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";

const Shop = () => {
  const [cart, setCart] = useCart([]);
  const [pageCunt, setPageCunt] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [products, setProducts] = useState([]);

    useEffect( () =>{
        fetch(`http://localhost:5000/product?page=${page}&size=${size}`)
        .then(res => res.json())
        .then(data => setProducts(data));
    }, [page, size]);


  useEffect(()=> {
      fetch('http://localhost:5000/productCount')
      .then(res => res.json())
      .then(data => {
          const count = data.count;
          const pages = Math.ceil(count/12);
          setPageCunt(pages);
      })
  },[])


  const handleAddToCart = (selectedProduct) => {
    console.log(selectedProduct);
    let newCart = [];
    const exists = cart.find((product) => product._id === selectedProduct._id);
    if (!exists) {
      selectedProduct.quantity = 1;
      newCart = [...cart, selectedProduct];
    } else {
      const rest = cart.filter(
        (product) => product._id !== selectedProduct._id
      );
      exists.quantity = exists.quantity + 1;
      newCart = [...rest, exists];
    }

    setCart(newCart);
    addToDb(selectedProduct._id);
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
        <div className="pagenation">
            {
                [...Array(pageCunt).keys()].map(number=> <button className={page === number ? 'seletcton': ''} onClick={()=> setPage(number)}>{number + 1}</button> )
            }
            <select onChange={e => setSize(e.target.value)}>
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="9">9</option>
                <option value="12">12</option>
            </select>
        </div>
      </div>
      <div className="cart-container">
        <Cart cart={cart}>
          <Link to="/orders">
            <button>Review Order </button>
          </Link>
        </Cart>
      </div>
    </div>
  );
};

export default Shop;
