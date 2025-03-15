module.exports = {
    apps: [
        {
            name: "backend",
            script: "node",
            args: "backend/bin/www",
            env: {
                PORT: 8000,
                NODE_ENV: "production"
            }
        },
        {
            name: "frontend",
            script: "pnpm",
            args: "start",
            cwd: "frontend",
            env: {
                PORT: 3000,
                NODE_ENV: "production"
            }
        }
    ]
};
