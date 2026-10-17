import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "thelnxn.ca" }],
        destination: "https://thelnxn.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.thelnxn.ca" }],
        destination: "https://thelnxn.com/:path*",
        permanent: true,
      },
      // 301s: old WordPress /shop-2/* URLs + /blog/ -> new Next.js routes
      {
        source: "/shop-2/women/lnxn-core-crew/",
        destination: "/product/lnxn-core-crew",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-core-crew",
        destination: "/product/lnxn-core-crew",
        permanent: true,
      },
      {
        source: "/shop-2/kids/lnxn-core-crew-kids/",
        destination: "/product/lnxn-core-crew-kids",
        permanent: true,
      },
      {
        source: "/shop-2/kids/lnxn-core-crew-kids",
        destination: "/product/lnxn-core-crew-kids",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-core-hoodie/",
        destination: "/product/lnxn-core-hoodie",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-core-hoodie",
        destination: "/product/lnxn-core-hoodie",
        permanent: true,
      },
      {
        source: "/shop-2/kids/lnxn-core-hoodie-kids/",
        destination: "/product/lnxn-core-hoodie-kids",
        permanent: true,
      },
      {
        source: "/shop-2/kids/lnxn-core-hoodie-kids",
        destination: "/product/lnxn-core-hoodie-kids",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/lnxn-core-identity-hoodie-mens/",
        destination: "/product/lnxn-core-identity-hoodie-mens",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/lnxn-core-identity-hoodie-mens",
        destination: "/product/lnxn-core-identity-hoodie-mens",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-core-identity-hoodie-womens-edition/",
        destination: "/product/lnxn-core-identity-hoodie-womens-edition",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-core-identity-hoodie-womens-edition",
        destination: "/product/lnxn-core-identity-hoodie-womens-edition",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-core-tee/",
        destination: "/product/lnxn-core-tee",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-core-tee",
        destination: "/product/lnxn-core-tee",
        permanent: true,
      },
      {
        source: "/shop-2/kids/lnxn-core-tee-kids/",
        destination: "/product/lnxn-core-tee-kids",
        permanent: true,
      },
      {
        source: "/shop-2/kids/lnxn-core-tee-kids",
        destination: "/product/lnxn-core-tee-kids",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/lnxn-core-tee-mens/",
        destination: "/product/lnxn-core-tee-mens",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/lnxn-core-tee-mens",
        destination: "/product/lnxn-core-tee-mens",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-heritage-crew/",
        destination: "/product/lnxn-heritage-crew",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-heritage-crew",
        destination: "/product/lnxn-heritage-crew",
        permanent: true,
      },
      {
        source: "/shop-2/kids/lnxn-heritage-crew-kids/",
        destination: "/product/lnxn-heritage-crew-kids",
        permanent: true,
      },
      {
        source: "/shop-2/kids/lnxn-heritage-crew-kids",
        destination: "/product/lnxn-heritage-crew-kids",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/lnxn-heritage-crew-mens/",
        destination: "/product/lnxn-heritage-crew-mens",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/lnxn-heritage-crew-mens",
        destination: "/product/lnxn-heritage-crew-mens",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-heritage-cropped-hoodie/",
        destination: "/product/lnxn-heritage-cropped-hoodie",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-heritage-cropped-hoodie",
        destination: "/product/lnxn-heritage-cropped-hoodie",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-heritage-hoodie/",
        destination: "/product/lnxn-heritage-hoodie",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-heritage-hoodie",
        destination: "/product/lnxn-heritage-hoodie",
        permanent: true,
      },
      {
        source: "/shop-2/kids/lnxn-heritage-kids-hoodie/",
        destination: "/product/lnxn-heritage-kids-hoodie",
        permanent: true,
      },
      {
        source: "/shop-2/kids/lnxn-heritage-kids-hoodie",
        destination: "/product/lnxn-heritage-kids-hoodie",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-heritage-tee/",
        destination: "/product/lnxn-heritage-tee",
        permanent: true,
      },
      {
        source: "/shop-2/women/lnxn-heritage-tee",
        destination: "/product/lnxn-heritage-tee",
        permanent: true,
      },
      {
        source: "/shop-2/kids/lnxn-heritage-tee-kids/",
        destination: "/product/lnxn-heritage-tee-kids",
        permanent: true,
      },
      {
        source: "/shop-2/kids/lnxn-heritage-tee-kids",
        destination: "/product/lnxn-heritage-tee-kids",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/men-lnxn-core-crew/",
        destination: "/product/men-lnxn-core-crew",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/men-lnxn-core-crew",
        destination: "/product/men-lnxn-core-crew",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/men-lnxn-core-hoodie/",
        destination: "/product/men-lnxn-core-hoodie",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/men-lnxn-core-hoodie",
        destination: "/product/men-lnxn-core-hoodie",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/men-lnxn-heritage-hoodie/",
        destination: "/product/men-lnxn-heritage-hoodie",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/men-lnxn-heritage-hoodie",
        destination: "/product/men-lnxn-heritage-hoodie",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/men-lnxn-heritage-tee/",
        destination: "/product/men-lnxn-heritage-tee",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/men-lnxn-heritage-tee",
        destination: "/product/men-lnxn-heritage-tee",
        permanent: true,
      },
      {
        source: "/shop-2/",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/shop-2",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/shop-2/men-men/",
        destination: "/shop?audience=Men",
        permanent: true,
      },
      {
        source: "/shop-2/men-men",
        destination: "/shop?audience=Men",
        permanent: true,
      },
      {
        source: "/shop-2/women/",
        destination: "/shop?audience=Women",
        permanent: true,
      },
      {
        source: "/shop-2/women",
        destination: "/shop?audience=Women",
        permanent: true,
      },
      {
        source: "/shop-2/kids/",
        destination: "/shop?audience=Kids",
        permanent: true,
      },
      {
        source: "/shop-2/kids",
        destination: "/shop?audience=Kids",
        permanent: true,
      },
      {
        source: "/blog/",
        destination: "/story",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/story",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
