import Api from "../util/Api";

const DeliveryRegionService = {
    newDeliveryRegion: async (regionData) => {
        try {
            const response = await Api.post('/Region/NewDeliveryRegion', regionData);
            return response.data;
        } catch (error) {
            console.error("Error creating delivery region:", error);
            throw error;
        }
    },

    viewDeliveryRegionList: async () => {
        try {
            const response = await Api.get('/Region/ViewDeliveryRegions');
            return response.data;
        } catch (error) {
            console.error("Error fetching delivery region list:", error);
            throw error;
        }
    }
};

export default DeliveryRegionService;