import { Navigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";

const OnlyAdmin = ({ children }) => {
    const { user, loading } = useAuth();
  
    if (loading) return null;

    const roleCheck = "Admin";
  
    // Chỉ cần kiểm tra role trực tiếp
    if (user?.roleName !== roleCheck) {
      return <Navigate to="/unauthorized" replace />;
    }
  
    return children;
  };
  
  export default OnlyAdmin;
  
