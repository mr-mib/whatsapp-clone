export default {
  base: "./", // important pour éviter les erreurs de chargemen
  server: {
    proxy: {
      // "/api": "http://localhost:3001",
      // "/api": "https://render-json-server-oz0p.onrender.com",
      "/api": {
        target: "https://render-json-server-oz0p.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
};
