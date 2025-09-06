// src/App.jsx
import { useState } from "react";
import AppRouter from "@/router";
import Loader from "@components/ui/Loader";

const App = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  if (isPageLoading) {
    return <Loader setIsLoading={setIsPageLoading} />;
  }

  return (
    <div className="bg-black">
      <AppRouter />
    </div>
  );
};

export default App;