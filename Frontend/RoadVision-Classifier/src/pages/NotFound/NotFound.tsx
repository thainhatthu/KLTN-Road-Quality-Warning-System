import { Button, Result } from "antd";
import { Link } from "react-router-dom";
import { PageEnum } from "../../defination/enums/page.enum";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to={PageEnum.HOME}>
            <Button type="primary" className="bg-blue-500 hover:bg-blue-700">
              Back Home
            </Button>
          </Link>
        }
      />
    </div>
  );
};

export default NotFound;
