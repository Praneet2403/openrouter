import type { App } from "app";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { ApiKeys } from "./pages/ApiKeys";
import { Credits } from "./pages/Credits";
import { Landing } from "./pages/Landing";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ElysiaClientContextProvider, client } from "./providers/Eden";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ElysiaClientContextProvider value={client}>
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={<Landing />} />
            <Route path={"/signup"} element={<Signup />} />
            <Route path={"/signin"} element={<Signin />} />
            <Route path={"/dashboard"} element={<Dashboard />} />
            <Route path={"/credits"} element={<Credits />} />
            <Route path={"/api-keys"} element={<ApiKeys />} />
          </Routes>
        </BrowserRouter>
      </ElysiaClientContextProvider>
    </QueryClientProvider>
  );
}

export default App;
