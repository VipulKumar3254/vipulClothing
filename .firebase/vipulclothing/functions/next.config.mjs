// next.config.mjs
var nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"]
  },
  serverComponentsExternalPackages: ["firebase-admin"]
};
var next_config_default = nextConfig;
export {
  next_config_default as default
};
