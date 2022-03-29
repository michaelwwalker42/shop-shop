import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';

import ProductItem from '../ProductItem';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../utils/actions';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';

// Again, we immediately execute the useStoreContext() function to retrieve the current global state object and the dipatch() method to update state. We then destructure the currentCategory data out of the state object so we can use it in the filterProducts() function.

// We then implement the useEffect() Hook in order to wait for our useQuery() response to come in. Once the data object returned from useQuery() goes from undefined to having an actual value, we execute our dispatch() function, instructing our reducer function that it's the UPDATE_PRODUCTS action and it should save the array of product data to our global store. When that's done, useStoreContext() executes again, giving us the product data needed display products to the page.

// Lastly, we need to update the code in the return statement to use state.products.length instead of products.length, since we are now retrieving products from the state object.

function ProductList() {
  const [state, dispatch] = useStoreContext();

  const { currentCategory } = state;

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });
    }
  }, [data, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
