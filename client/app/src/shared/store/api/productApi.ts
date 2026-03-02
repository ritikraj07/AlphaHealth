import { apiSlice } from "./apiSlice";

export interface IProduct {
  _id: string;
  product_name: string;
  brand?: string;
  category?: string;
  price?: number;
  quantity: number;
  description?: string;
  image?: string;
  mrp?: number;
  ptr?: number;
  pts?: number;
  packSize?: string;
  composition?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;

  // virtuals (optional)
  retailerMargin?: number;
  stockistMargin?: number;
}

export type CreateProductPayload = Omit<
  IProduct,
  "_id" | "createdAt" | "updatedAt" | "retailerMargin" | "stockistMargin"
>;

export type UpdateProductPayload = Partial<CreateProductPayload>;



export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 GET ALL PRODUCTS
    getProducts: builder.query<IProduct[], void>({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      transformResponse: (response: {
        success: boolean;
        count: number;
        data: IProduct[];
      }) => response.data,
      providesTags: ["Products"],
    }),

    // 🔹 CREATE PRODUCT
    createProduct: builder.mutation<IProduct, CreateProductPayload>({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    // 🔹 UPDATE PRODUCT
    updateProduct: builder.mutation<
      IProduct,
      { id: string; data: UpdateProductPayload }
    >({
      query: ({ id, data }) => ({
        url: `/products/edit/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    // 🔹 DELETE PRODUCT
    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;