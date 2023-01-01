import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// create api for mutation and query

const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (user) => ({
        url: "/users/signup",
        method: "POST",
        body: user,
      }),
    }),
    login: builder.mutation({
      query: (user) => ({
        url: "/users/login",
        method: "POST",
        body: user,
      }),
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
    }),
    deleteProduct: builder.mutation({
      query: ({ productId, userId }) => ({
        url: `/products/${productId}`,
        body: {
          userId,
        },
        method: "DELETE",
      }),
    }),
    updateProduct: builder.mutation({
      query: (product) => ({
        url: `/products/${product.id}`,
        body: product,
        method: "PATCH",
      }),
    }),
    addToCart: builder.mutation({
      query: (cartInfo) => ({
        url: "/products/add-to-cart",
        body: cartInfo,
        method: "POST",
      }),
    }),
    removeFromCart: builder.mutation({
      query: (body) => ({
        url: "/products/remove-from-cart",
        body,
        method: "POST",
      }),
    }),
    increaseCartProduct: builder.mutation({
      query: (body) => ({
        url: "/products/increase-cart",
        body,
        method: "POST",
      }),
    }),
    decreaseCartProduct: builder.mutation({
      query: (body) => ({
        url: "/products/decrease-cart",
        body,
        method: "POST",
      }),
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useCreateProductMutation,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useIncreaseCartProductMutation,
  useDecreaseCartProductMutation,
  useCreateOrderMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = appApi;

export default appApi;
