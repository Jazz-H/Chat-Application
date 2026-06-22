import Navbar from "./components/Navbar";
import Chat from "./components/Chat";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const style = {
  appContainer: `max-w-[728px] bg-30 md:mt-2 mx-auto text-center text-white`,
  sectionContainer: `flex flex-col h-[90vh] mt-10 shadow-xl border`,
  loading: `flex h-screen items-center justify-center text-white`,
};

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className={style.appContainer}>
        <div className={style.loading}>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>
      </div>
    );
  }

  return (
    <div className={style.appContainer}>
      <section className={style.sectionContainer}>
        <Navbar />
        {user ? <Chat /> : null}
      </section>
    </div>
  );
}

export default App;
