import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Home: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/auth/signIn").then();
  }, [router]);

  return <div></div>;
};

export default React.memo(Home);
