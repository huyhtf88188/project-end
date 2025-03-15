import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import brandApi from "../../api/brandApi";
import categoryApi from "../../api/categoryApi";
import attributeApi from "../../api/attributeApi";
import valueAttributeApi from "../../api/valueAttributeApi";
import variantApi from "../../api/variantApi";
import productApi from "./../../api/productApi";

/**
 * Fetch tất cả dữ liệu sản phẩm
 */
export const fetchProductData = createAsyncThunk(
  "productData/fetchAll",
  async () => {
    const responses = await Promise.allSettled([
      brandApi.getAll(),
      categoryApi.getAll(),
      attributeApi.getAll(),
      valueAttributeApi.getAll(),
      variantApi.getAll(),
      productApi.getAll(),
    ]);
    const brands = responses[0]?.value?.data ?? [];

    const categories = responses[1]?.value?.data ?? [];
    const attributes = responses[2]?.value?.data ?? [];
    const valueAttributes = responses[3]?.value?.data ?? [];
    const variants = responses[4]?.value?.data ?? [];
    const productsApi = responses[5]?.value?.data ?? [];

    // ✅ Mix dữ liệu để thêm size và color vào từng variant
    const enrichedVariants = variants.map((variant) => {
      const enrichedAttributes = variant.attributes.map((attr) => {
        const attribute = attributes.find(
          (a) => a._id === attr.attributeId._id
        );
        const value = valueAttributes.find((v) => v._id === attr.valueId);
        return {
          attributeId: attr.attributeId,
          attributeName: attribute?.name || "Unknown",
          valueId: attr.valueId,
          valueName: value?.name || "Unknown",
        };
      });
      return {
        ...variant,
        attributes: enrichedAttributes, // Thay thế attributes bằng dữ liệu đã được làm giàu
      };
    });

    return {
      brands,
      categories,
      attributes,
      valueAttributes,
      variants123: enrichedVariants,
    };
  }
);

const productDataSlice = createSlice({
  name: "productData",
  initialState: {
    brands: [],
    categories: [],
    attributes: [],
    valueAttributes: [],
    variants345: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductData.fulfilled, (state, action) => {
        state.brands = action.payload.brands;
        state.categories = action.payload.categories;
        state.attributes = action.payload.attributes;
        state.valueAttributes = action.payload.valueAttributes;
        state.variants345 = action.payload.variants123;
        state.status = "succeeded";
      })
      .addCase(fetchProductData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default productDataSlice.reducer;
