import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./shared/router/Router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import UserProvider from "./store/UserContext";
import { useEffect } from "react";
import { auth } from "./firebase";
import CartProvider from "./store/CartContext";
import ModalProvider from "./store/ModalContext";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
      retry: 0,
    },
  },
});

function App() {
  const init = async () => {
    await auth.authStateReady();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <UserProvider>
        <ModalProvider>
          <CartProvider>
            <Router />
          </CartProvider>
        </ModalProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
