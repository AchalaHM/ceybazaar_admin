import Api from "../util/Api";

const ProductService = {
    newProductCategory : async (categoryData) => {
        try{
            const response = await Api.post('/Products/NewProductCat', categoryData);
            return response.data;
        } catch (error) {
            console.error("Error creating product category:", error);
            throw error;
        }
        
    },

    viewProductCategoryList : async () =>{
        
        try {
            const response = await Api.get('/Products/ViewProductCatList');
            return response.data;
        } catch (error) {
            console.error("Error fetching product category list:", error);
            throw error;
        }
    },

    addNewProduct : async (payload) => {

        try {
            const response = await Api.post('/Products/NewProduct', payload);
            return response.data;
        } catch (error) {
            console.error("Error adding new product:", error);
            throw error;
        }
    },

    viewProductList : async () => {
        
        try {
            const response = await Api.get('/Products/ViewProductList');
            return response.data;
        } catch (error) {
            console.error("Error fetching product list:", error);
            throw error;
        }
    }


}

export default ProductService