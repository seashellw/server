import { Avatar, Button, Typography } from "@mui/joy";
import { IconBrandGithub, IconLogin, IconLogout } from "@tabler/icons";
import { useAsyncEffect, useRequest } from "ahooks";
import LogInCard from "components/LogInCard";
import { AsyncReturnType, fetchUser, TOKEN_KEY } from "interface";
import { NextPage } from "next";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo } from "react";

type Props = {
  providers: AsyncReturnType<typeof getProviders>;
};

const setQuery = (query: { from?: string; action?: string }) => {
  if (
    query.from &&
    typeof query.from === "string" &&
    query.action &&
    typeof query.action === "string"
  ) {
    localStorage.setItem("from", query.from);
    localStorage.setItem("action", query.action);
  }
};

const readQuery = () => {
  const from = localStorage.getItem("from");
  const action = localStorage.getItem("action");
  return { from, action };
};

const clearQuery = () => {
  localStorage.removeItem("from");
  localStorage.removeItem("action");
};

const SignIn: NextPage<Props> = ({ providers }) => {
  const { data: session } = useSession();

  const handleLogIn = useCallback(async () => {
    await signIn(providers?.github.id, { redirect: false });
  }, [providers?.github.id]);

  const router = useRouter();

  const logOut = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    await signOut({ redirect: false });
  }, []);

  /**
   * 存储源页面的地址,
   * 存储请求操作（是登录还是退出登录）
   */
  useEffect(() => {
    let query = router.query;
    setQuery(query);
  }, [router.query]);

  const { data: user } = useRequest(
    async () => {
      if (!session?.user.id || !session?.user.name) {
        return;
      }
      const res = await fetchUser();
      if (!res.jwt || !res.user?.id) {
        return;
      }
      return {
        token: res.jwt,
        ...res.user,
      };
    },
    { refreshDeps: [session?.user.id] }
  );

  /**
   * 若已登录，则检查已存储的请求操作。
   * 若为登录请求，则跳转回源地址。
   * 若为退出登录请求，则退出登录。
   */
  useAsyncEffect(async () => {
    let { from, action } = readQuery();
    if (!user?.token || !from || !action) {
      return;
    }
    const url = new URL(from);
    if (action === "logIn") {
      clearQuery();
      url.searchParams.set("token", user.token);
      window.location.replace(url);
      return;
    }
    if (action === "logOut") {
      clearQuery();
      await logOut();
      window.location.replace(url);
      return;
    }
  }, [logOut, router, user?.token]);

  const Name = useMemo(() => {
    if (user?.name) {
      return (
        <Typography level="h6" component="h1">
          {user?.name}
        </Typography>
      );
    } else {
      return null;
    }
  }, [user?.name]);

  const LogInButton = useMemo(() => {
    if (!user?.id) {
      return (
        <Button
          onClick={handleLogIn}
          startDecorator={<IconLogin />}
          color="success"
        >
          登录
        </Button>
      );
    }
    return null;
  }, [handleLogIn, user?.id]);

  const LogOutButton = useMemo(() => {
    if (user?.id) {
      return (
        <Button
          onClick={logOut}
          startDecorator={<IconLogout />}
          color={"danger"}
        >
          退出登录
        </Button>
      );
    }
    return null;
  }, [logOut, user?.id]);

  return (
    <LogInCard>
      <Avatar size="lg">
        <IconBrandGithub />
      </Avatar>
      {Name}
      {LogInButton}
      {LogOutButton}
      <Head>
        <title>登录</title>
      </Head>
    </LogInCard>
  );
};

export default React.memo(SignIn);

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
