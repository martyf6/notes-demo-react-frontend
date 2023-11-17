import { useLocation, useNavigate, useParams } from "react-router-dom";

export const withRouter = (Component) => {
  function ComponentWithRouterProps(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }
  return ComponentWithRouterProps;
};

export const withNav = (Component) => {
  return props => <Component {...props} navigate={useNavigate()} />;
}

export const withParams = (Component) => {
  return props => <Component {...props} params={useParams()} />;
}