import VerifyBlock from "../../../components/Auth/Verify/VerifyBlock";
import AuthWrap from "../../../components/Auth/Common/AuthWrap";
import { useRecoilValue } from "recoil";
import { verifyEmailState } from "../../../atoms/authState";
import NotFound from "../../NotFound/NotFound";
import { checkObjectAtLeastOneField } from "../../../utils/check.util";

const AuthVerifyEmail = () => {
  const verifyEmailRecoidValue = useRecoilValue(verifyEmailState);

  if (checkObjectAtLeastOneField(verifyEmailRecoidValue)) {
    return (
      <AuthWrap>
        <VerifyBlock verifyEmailRecoidValue={verifyEmailRecoidValue} />
      </AuthWrap>
    );
  }

  return <NotFound />;
};

export default AuthVerifyEmail;
