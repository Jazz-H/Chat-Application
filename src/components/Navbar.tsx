import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import SignIn from "./SignIn";
import LogOut from "./LogOut";

const NavBar = () => {
  const [user] = useAuthState(auth);

  return <div>{user ? <LogOut /> : <SignIn />}</div>;
};

export default NavBar;
