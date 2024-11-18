import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/NavbarComp";
import Header from "./components/Header/HeaderComp";
import Footer from "./components/Footer/FooterComp";
import "./styles/Reset.css";
import "./styles/App.css";

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: "/graphql",
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  console.log("Token in header:", token); 
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <ApolloProvider client={client}>
        {location.pathname === "/" && <Header />}
        {location.pathname !== "/" && <Navbar />}
        <main className="content">
          <Outlet />
        </main>
        <Footer />
      </ApolloProvider>
    </div>
  );
}

export default App;
