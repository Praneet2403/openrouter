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
import { AuthProvider, RequireAuth } from "./providers/Clerk";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ElysiaClientContextProvider value={client}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path={"/"} element={<Landing />} />
              <Route path={"/signup"} element={<Signup />} />
              <Route path={"/signin"} element={<Signin />} />
              <Route path={"/dashboard"} element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path={"/credits"} element={<RequireAuth><Credits /></RequireAuth>} />
              <Route path={"/api-keys"} element={<RequireAuth><ApiKeys /></RequireAuth>} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ElysiaClientContextProvider>
    </QueryClientProvider>
  );
}

export default App;
