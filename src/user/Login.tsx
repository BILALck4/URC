import React, { useState, useEffect } from "react";
import { useColorScheme } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import CssBaseline from "@mui/joy/CssBaseline";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { loginUser } from "./loginApi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure } from "../features/authSlice";
import { RootState } from "../store"; // Import RootState for type checking

// ModeToggle component
function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="soft">Change mode</Button>;
  }

  return (
    <Select
      variant="soft"
      value={mode}
      onChange={(event, newMode) => {
        setMode(newMode);
      }}
      sx={{ width: "max-content" }}
    >
      <Option value="system">System</Option>
      <Option value="light">Light</Option>
      <Option value="dark">Dark</Option>
    </Select>
  );
}

export default function Login() {
  const [error, setError] = useState<string | null>(null); // Manage errors as a string
  const navigate = useNavigate(); // Hook pour la navigation
  const dispatch = useDispatch(); // Hook pour dispatcher les actions Redux

  // Récupération de l'état global d'authentification
  const { isAuthenticated, username } = useSelector(
    (state: RootState) => state.auth
  );

  // Redirection si l'utilisateur est déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/messaging");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const username = data.get("username") as string | null;
    const password = data.get("password") as string | null;

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Login logic
    loginUser(
      {
        username,
        password,
        user_id: 0,
      },
      (result) => {
        // Vérifie que result.username est défini, sinon met une valeur par défaut
        const validUsername = result.username || "Unknown User"; // Option de secours
        dispatch(
          loginSuccess({
            token: result.token,
            username: validUsername, // S'assure que c'est une chaîne
            user_id: result.user_id,
          })
        );
        setError(null); // Clear error message on success
        navigate("/messaging");
      },
      (loginError) => {
        dispatch(
          loginFailure({
            message: loginError.message,
          })
        );
        setError(loginError.message);
      }
    );
    
  };

  return (
    <main>
      <ModeToggle />
      <CssBaseline />
      <Sheet
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 300,
          mx: "auto",
          my: 4,
          py: 3,
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md",
        }}
        variant="outlined"
      >
        <div>
          <Typography level="h4" component="h1">
            <b>Welcome!</b>
          </Typography>
          <Typography level="body-sm">Sign in to continue.</Typography>
        </div>

        {/* Username field */}
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            type="text"
            placeholder="Enter your username"
            required
          />
        </FormControl>

        {/* Password field */}
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </FormControl>

        <Button type="submit" sx={{ mt: 1 }}>
          Log in
        </Button>

        {/* Display success info if logged in */}
        {isAuthenticated && (
          <Typography level="body-sm">
            Welcome back, {username}!
          </Typography>
        )}

        {/* Display error message if login fails */}
        {error && (
          <Typography color="danger" level="body-sm">
            {error}
          </Typography>
        )}

        {/* Link to sign up if the user doesn't have an account */}
        <Typography
          endDecorator={<Link href="/signUp">Sign up</Link>}
          sx={{ fontSize: "sm", alignSelf: "center" }}
        >
          Don&apos;t have an account?
        </Typography>
      </Sheet>
    </main>
  );
}
