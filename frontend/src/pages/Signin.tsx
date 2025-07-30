import Quote from "../components/Quote";
import { Auth } from "../components/Auth";

const Signin = () => {
  return (
    <div>
      <div className="grid grid-cols-2">
        <div>
          <Auth type="signin" />
        </div>
        <div className="invisible lg:visible">
          <Quote />
        </div>
      </div>
    </div>
  );
};

export default Signin;
