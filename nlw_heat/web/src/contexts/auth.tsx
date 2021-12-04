import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
};

type AuthContextData = {
  user: User | null;
  singInUrl: string;
  singOut: () => void;
};

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: ReactNode;
};

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  }
}

export function AuthProvider(props: AuthProvider) {

  const [user, setUser] = useState<User | null>(null)

  async function singIn(githubCode: string) {
    const response = await api.post<AuthResponse>("authenticate", {
      code: githubCode,
    });

    const { token, user } = response.data;

    localStorage.setItem("@dowhile:token", token);

    api.defaults.headers.common.authorization =  `Bearer ${token}`

    setUser(user)
  }

  const singInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=ac1da3b26b76b0963ecb`;

  function singOut() {
    setUser(null)
    localStorage.removeItem('@dowhile:token')
  }

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token')

    if( token ) {
      api.defaults.headers.common.authorization =  `Bearer ${token}`

      api.get<User>('profile').then(response => {
        setUser(response.data);
        
      })
    }
  }, [])

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes("?code=");

    if (hasGithubCode) {
      const [urlWithhoutCode, githubCode] = url.split("?code=");

      window.history.pushState({}, "", urlWithhoutCode);

      singIn(githubCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={{singInUrl, user, singOut}}>{props.children}</AuthContext.Provider>
  );
}
