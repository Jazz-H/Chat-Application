import { lazy, Suspense } from "react";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import SignIn from "./components/SignIn";

// Code-split the authenticated app: the chat UI (and the Firestore code it
// pulls in) only loads once a user is signed in.
const ChatLayout = lazy(() => import("./components/ChatLayout"));

const Spinner = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
  </div>
);

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <Spinner />;
  if (!user) return <SignIn />;

  return (
    <Suspense fallback={<Spinner />}>
      <ChatLayout />
    </Suspense>
  );
}

export default App;
