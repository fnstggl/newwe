
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewJoin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the original join page
    navigate('/join');
  }, [navigate]);

  return null;
};

export default NewJoin;
