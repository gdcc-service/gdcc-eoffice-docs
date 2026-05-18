import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: "gdcc-service",
  repo: "gdcc-eoffice-docs",
  branch: "main",
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image src="/logo.png" alt="Logo" width={50} height={32} />
          e-Office Documentation
        </>
      ),
      url: "/docs",
    },

    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
