// useNavigateTo.ts use for define page navigate path
import { useNavigate, NavigateOptions } from "react-router-dom";
import { AdminPageEnum, PageEnum, TechnicianPageEnum } from "../defination/enums/page.enum";

type PageType = PageEnum | AdminPageEnum | TechnicianPageEnum;

const useNavigateTo = () => {
  const navigate = useNavigate();

  const navigateTo = (path: PageType, options: NavigateOptions = {}) => {
    navigate(path, options);
  };

//---------- USER ------------
  const navigateToSignUp = () => {
    navigateTo(PageEnum.SIGN_UP, { replace: true });
  };
  const navigateToLogin = () => {
    navigateTo(PageEnum.LOGIN, { replace: true });
  };
  const navigateForgotPassword = () => {
    navigateTo(PageEnum.FORGOT_PASSWORD, { replace: true });
  };
  const navigateHome = () => {
    navigateTo(PageEnum.HOME, { replace: true });
  };

  const navigateProfile = () => {
    navigateTo(PageEnum.PROFILE, { replace: true });
  };
  const navigateVerify = () => {
    navigateTo(PageEnum.VERIFY, { replace: true });
  };
  
//---------- ADMIN ------------
  const navigateToDashboard = () => {
    navigateTo(AdminPageEnum.DASHBOARD, { replace: true });
  }
  const navigateToUser = () => {
    navigateTo(AdminPageEnum.USER_MANAGEMENT, { replace: true });
  }
  const navigateToTechnician = () => {
    navigateTo(AdminPageEnum.TECHNICIAN_MANAGEMENT, { replace: true });
  }
//---------- TECHNICIAN ------------
const navigateToDashboardTechnician = () => {
  navigateTo(TechnicianPageEnum.DASHBOARD, { replace: true });
}
const navigateToTaskManagement = () => {
  navigateTo(TechnicianPageEnum.TASK_MANAGEMENT, { replace: true });
}

  return {
    navigateTo,
    navigateToSignUp,
    navigateToLogin,
    navigateForgotPassword,
    navigateHome,
    navigateProfile,
    navigateVerify,
    navigateToDashboard,
    navigateToUser,
    navigateToTechnician,
    navigateToDashboardTechnician,
    navigateToTaskManagement
  };
};

export default useNavigateTo;
