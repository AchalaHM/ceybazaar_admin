import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, notification } from "antd";

const CheckSession = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionExpiration = () => {
      const expirationTime = sessionStorage.getItem("expirationTime");
      const currentTime = new Date().getTime();

      if (expirationTime && currentTime > expirationTime) {
        sessionStorage.clear();
        navigate("/");
        message.warning("Your session is expired.Please login again")
      }
    };

    checkSessionExpiration();
  }, [navigate]);
};

export default CheckSession;