import Api from "../util/Api";

const AdminService = {
  getAllOrders: async () => {
    try {
      const response = await Api.get("/Admin/orders/all");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPaidOrders: async () => {
    try {
      const response = await Api.get("/Admin/orders/paid");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  completeOrder: async (orderId) => {
    try {
      const response = await Api.post("/Admin/orders/complete", { orderId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDeliveryStatus: async (orderId, deliveryStatus) => {
    try {
      const response = await Api.post("/Admin/orders/delivery-status", { orderId, deliveryStatus });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDailyReport: async (date) => {
    try {
      const response = await Api.get(`/Admin/reports/daily?date=${date}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDateRangeReport: async (startDate, endDate) => {
    try {
      const response = await Api.get(`/Admin/reports/range?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default AdminService;