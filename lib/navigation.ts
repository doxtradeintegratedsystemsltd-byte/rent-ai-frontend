"use client";

import { useRouter } from "next/navigation";

export const useNavigation = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const goForward = () => {
    router.forward();
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const replaceTo = (path: string) => {
    router.replace(path);
  };

  const refresh = () => {
    router.refresh();
  };

  return {
    goBack,
    goForward,
    navigateTo,
    replaceTo,
    refresh,
    router,
  };
};
