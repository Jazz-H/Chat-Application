import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import SignIn from "./components/SignIn";
import ChatLayout from "./components/ChatLayout";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  return user ? <ChatLayout /> : <SignIn />;
}

export default App;
