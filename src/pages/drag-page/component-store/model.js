export default {
    initialState: {
        stores: [],
        store: null,
        categories: [],
        category: null,

        components: [],
    },
    setStores: stores => ({stores}),
    setStore: store => ({store}),

    setCategories: categories => ({categories}),
    setCategory: category => {
        return {category};
    },

    setComponents: components => ({components}),
};
