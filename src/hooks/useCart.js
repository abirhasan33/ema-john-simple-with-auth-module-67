import { useEffect, useState } from "react"
import { getStoredCart } from "../utilities/fakedb";

const useCart = (products) => {
    const [cart, setCart] = useState([]);

    useEffect( () =>{
        const storedCart = getStoredCart();
        const savedCart = [];
        const keys = Object.keys(storedCart);
        console.log(keys);
        fetch('http://localhost:5000/productByKeys',{ 
        meathod: 'POST',
        headers: {
            'conten-type': 'applicication/json'
        },
        body: JSON.stringify(keys)
    })
        .then(res => res.json())
        .then(products => {
                for(const id in storedCart){
                    const addedProduct = products.find(product => product._id === id);
                    if(addedProduct){
                        const quantity = storedCart[id];
                        addedProduct.quantity = quantity;
                        savedCart.push(addedProduct);
                    }
                }
            setCart(savedCart);
        })
}, []);
    
    return [cart, setCart];
}

export default useCart;