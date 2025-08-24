import Api from "../util/Api";

const AuthService = {
    loginUser : async (loginDTO) => {
        try {
          const response = await Api.post(`User/Login`, loginDTO);
          return response.data;
        } catch (error) {
          throw error.response ? error.response.data : { message: "Server error" };
        }
      }
}

export default AuthService