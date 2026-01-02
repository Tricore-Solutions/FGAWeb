# Production Server Setup — FGAWeb

This document describes a reproducible, secure way to deploy the FGAWeb application (frontend + backend + MySQL) on a single Ubuntu 24.04 LTS EC2 instance and expose it via Nginx with HTTPS. Adjust values (user names, passwords, domain, IPs) for your environment.

## Overview

- **Frontend**: Vite + React — build static files and serve with Nginx
- **Backend**: Node.js + Express — run with PM2 as a systemd-managed process
- **Database**: MySQL 8 (local on the same server)
- **Reverse proxy & TLS**: Nginx + Certbot (Let's Encrypt)
- **Process manager**: PM2
- **Storage**: Backend uploads stored at `backend/uploads` (served via Nginx alias)

---

## Temporary development server note

For now, this EC2 instance is being used as a temporary development server. The frontend is exposed using the Vite dev server (listening on port 5173) and the backend is running under PM2. This is intended only for development/testing and is **not** a secure or production-ready configuration.

Pending setup tasks to promote this server to a more stable/staged environment:
- **Nginx**: configure Nginx to serve the frontend build artifacts and proxy `/api` to the backend (planned).
- **Automated deploy cron**: add a cron job (or systemd timer) that pulls the repository periodically (e.g., every minute), runs an `npm install`/`npm run build` for the frontend, and syncs the new `dist/` files to Nginx's web root so changes are served automatically.

Example cron entry (runs as the `ubuntu` user; adjust paths and environment as needed):

```bash
# every minute: pull latest, install, build, and sync
* * * * * cd /home/ubuntu/FGAWeb && git pull origin main && cd frontend && npm ci && npm run build && rsync -a --delete dist/ /var/www/fga/
```

Notes and cautions:
- Pulling and building every minute is convenient for rapid iteration but can be resource-intensive and may cause transient site disruptions while files are replaced. Consider using a safer deployment pipeline (CI/CD) or a lockfile to avoid overlapping builds.
- Ensure the cron job runs with the correct user and PATH (use full paths for npm/node if needed) and that any secrets are not exposed in the repository. For production, prefer atomic deploys (build to a temporary directory then move).

Once Nginx + the cron-based deploy are in place, update this document to describe the final deploy flow and disable the Vite dev server exposure.

---

## Running the frontend dev server under PM2 (temporary)

If you prefer the Vite dev server to persist after logout during development, you can run it under PM2. This is useful while iterating quickly on the EC2 instance, but remember that the dev server is not optimized for production and should be replaced by a built `dist/` served by Nginx for staging/production.

Use PM2 with the working directory set via `--cwd` (or `--chdir`) so npm runs in the frontend folder:

```bash
# start the Vite dev server via npm under PM2 (binds to 0.0.0.0 so it's reachable)
pm2 start npm --name fga-frontend --cwd /home/ubuntu/FGAWeb/frontend -- run dev -- --host 0.0.0.0 --port 5173
pm2 save
```

Notes:
- Use `pm2 logs fga-frontend` to view logs and `pm2 status` to check process health.
- If you change the `backend/server.js` CORS origin while testing, restart the backend process: `pm2 restart fga-backend`.
- To stop the dev server managed by PM2: `pm2 stop fga-frontend && pm2 delete fga-frontend`.
- Running the dev server publicly is only recommended for short-term testing. For safer persistence consider a reverse proxy and serving a built frontend.


## Prerequisites (on the server)

- Ubuntu 24.04 LTS
- An AWS EC2 instance with a public IP and a security group that allows incoming:
  - TCP 22 (SSH) from your IP
  - TCP 80 (HTTP) and 443 (HTTPS) from 0.0.0.0/0
  - TCP 5173 (optional, dev) only from your IP for testing
- Domain DNS record pointed to the instance public IP (recommended for TLS)
- A GitHub account and repository access (SSH key recommended)

---

## Quick variable checklist (replace before running commands)
- REPO_SSH: `git@github.com:Tricore-Solutions/FGAWeb.git`
- APP_DIR: `/home/ubuntu/FGAWeb`
- BACKEND_DIR: `${APP_DIR}/backend`
- FRONTEND_DIR: `${APP_DIR}/frontend`
- MYSQL_DB: `fgaweb`
- MYSQL_USER: `fgauser`
- MYSQL_PASS: `StrongPasswordHere` (choose a secure password)
- JWT_SECRET: generate securely (we show how below)
- DOMAIN: `example.com` (replace with your domain)

---

## 1. System updates and basic packages

sudo apt update && sudo apt upgrade -y
sudo apt install -y curl gnupg build-essential software-properties-common apt-transport-https ca-certificates---

## 2. Install Node.js (LTS or stable)
Example for Node 20 (adjust if you prefer Node 18/16):

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v---

## 3. Install MySQL and secure it

sudo apt install -y mysql-server
sudo systemctl enable --now mysql

# Optional: run interactive secure installation
sudo mysql_secure_installationCreate DB and user (replace password):

sudo mysql <<'SQL'
CREATE DATABASE IF NOT EXISTS fgaweb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'fgauser'@'localhost' IDENTIFIED BY 'StrongPasswordHere';
GRANT ALL PRIVILEGES ON fgaweb.* TO 'fgauser'@'localhost';
FLUSH PRIVILEGES;
SQL---

## 4. Clone repository (SSH recommended)

On the server (ensure your SSH key is added to GitHub first):

cd /home/ubuntu
git clone git@github.com:Tricore-Solutions/FGAWeb.git ~/FGAWeb
cd ~/FGAWeb---

## 5. Import database schema
There is a foreign key in `users.active_subscription_id` referencing `subscriptions` so import with foreign key checks disabled (safe for initial import):

cd ~/FGAWeb/backend
# Drop + recreate DB (non-interactive)
mysql -u fgauser -p -e "DROP DATABASE IF EXISTS fgaweb; CREATE DATABASE fgaweb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
# Import schema while disabling FK checks
( printf "SET FOREIGN_KEY_CHECKS=0;\n"; cat database/schema.sql; printf "\nSET FOREIGN_KEY_CHECKS=1;\n" ) | mysql -u fgauser -p fgawebAlternative (cleaner): move the `subscriptions` CREATE TABLE block before `users` in `database/schema.sql`, then run a normal import.

Verify tables:

mysql -u fgauser -p -e "USE fgaweb; SHOW TABLES;"---

## 6. Configure backend environment

Create a `.env` file in `backend`:

cat > ~/FGAWeb/backend/.env <<'EOF'
DB_HOST=localhost
DB_USER=fgauser
DB_PASS=StrongPasswordHere
DB_NAME=fgaweb
JWT_SECRET=$(openssl rand -hex 32)
PORT=5000
EOF- **Important**: Replace `StrongPasswordHere` and keep `JWT_SECRET` secret.
- If you integrate external payment keys (AmwalPay), move keys into environment variables and avoid committing them.

---

## 7. Install backend dependencies and run with PM2

cd ~/FGAWeb/backend
npm install

# Install PM2 globally
sudo npm install -g pm2

# Start backend
pm2 start server.js --name fga-backend
pm2 save

# Register PM2 to resurrect on reboot (run the printed command or):
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
# If the above prints a command, run it with sudo, then:
pm2 saveTroubleshooting:
- If `pm2 startup` triggers polkit auth errors, run the printed `sudo` command exactly as PM2 outputs, or `sudo -i` then `systemctl enable pm2-<user>.service` depending on the PM2 message.

Check logs:

pm2 status
pm2 logs fga-backend
curl -I http://127.0.0.1:5000/---

## 8. Build frontend and deploy with Nginx (production)

1) Install Nginx:

sudo apt install -y nginx
sudo systemctl enable --now nginx2) Build frontend:

cd ~/FGAWeb/frontend
npm install
npm run build
# The build output should be in `dist/` by default3) Copy build to web root:

sudo rm -rf /var/www/fga
sudo mkdir -p /var/www/fga
sudo cp -r dist/* /var/www/fga
sudo chown -R www-data:www-data /var/www/fga4) Nginx site config (`/etc/nginx/sites-available/fga`):
inx
server {
  listen 80;
  server_name example.com www.example.com; # replace with your domain or _ for IP

  root /var/www/fga;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
  }

  location /uploads/ {
    alias /home/ubuntu/FGAWeb/backend/uploads/;
    autoindex off;
    sendfile off;
  }
}Enable and test:

sudo ln -sf /etc/nginx/sites-available/fga /etc/nginx/sites-enabled/fga
sudo nginx -t
sudo systemctl reload nginx---

## 9. Obtain TLS certificate (Certbot / Let's Encrypt)

sudo apt install -y snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Run certbot for Nginx (interactive)
sudo certbot --nginx -d example.com -d www.example.com
# Follow prompts to obtain and auto-configure TLSAuto-renewal is configured by certbot; test with:

sudo certbot renew --dry-run---

## 10. File permissions and uploads

Ensure backend `uploads` directory is writable by the app user:

sudo mkdir -p /home/ubuntu/FGAWeb/backend/uploads
sudo chown -R ubuntu:www-data /home/ubuntu/FGAWeb/backend/uploads
sudo chmod -R 755 /home/ubuntu/FGAWeb/backend/uploadsAdjust owner/group according to how you run the backend (PM2 user).

---

## 11. Firewall and AWS security group

- On the server (ufw):

sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'  # opens 80 and 443
# optional dev port
sudo ufw allow 5173/tcp
sudo ufw enable
sudo ufw status- On AWS: update the instance's Security Group to allow inbound:
  - TCP 80 (0.0.0.0/0)
  - TCP 443 (0.0.0.0/0)
  - TCP 22 (your IP, be restrictive)
  - (Optional) TCP 5173 (your IP only)

---

## 12. Backups, monitoring, and maintenance

- Database backups (daily/weekly):
  - Simple dump:
   
    mysqldump -u fgauser -p fgaweb > /home/ubuntu/backups/fgaweb-$(date +%F).sql
      - Automate with cron jobs and rotate/delete old backups; consider S3 for offsite storage.

- Logs:
  - PM2 logs: `pm2 logs fga-backend`
  - Nginx access/error logs: `/var/log/nginx/`

- Monitoring:
  - Consider services like UptimeRobot (HTTP checks), PM2 monitoring, or Datadog/Prometheus for metrics.

- Security:
  - Keep system packages updated.
  - Rotate secrets periodically.
  - Use least-privilege DB user.
  - Enforce HTTPS and HSTS in Nginx for production.

---

## 13. Quick troubleshooting

- Backend connection errors:
  - Ensure `backend/.env` has correct DB credentials.
  - Confirm `pm2 status` shows `online`.
  - Test `curl -I http://127.0.0.1:5000/`.

- Frontend shows CORS errors:
  - Update `backend/server.js` CORS origin to include your frontend domain or `*` for testing only.
  - Restart backend (via PM2) after changes.

- Schema import errors (foreign keys):
  - Use the FK checks wrapper shown above, or reorder the table creation in `database/schema.sql`.

---

## 14. Deployment checklist (one-shot)

1. Create EC2, attach keypair, set SGs (22,80,443).
2. SSH in, run system updates.
3. Install Node.js, MySQL, Nginx.
4. Add SSH key to GitHub, clone repo.
5. Create MySQL DB and user.
6. Import schema (disable FK checks if needed).
7. Create `backend/.env`.
8. Install backend deps, start with PM2, enable startup.
9. Build frontend, copy to `/var/www/fga`.
10. Configure Nginx site, test, reload.
11. Obtain TLS with Certbot.
12. Configure backups and monitoring.

---

## 15. Useful commands summary

# Clone repo
git clone git@github.com:Tricore-Solutions/FGAWeb.git ~/FGAWeb

# DB import with FK checks off
( printf "SET FOREIGN_KEY_CHECKS=0;\n"; cat database/schema.sql; printf "\nSET FOREIGN_KEY_CHECKS=1;\n" ) | mysql -u fgauser -p fgaweb

# Start backend
cd ~/FGAWeb/backend
npm install
pm2 start server.js --name fga-backend
pm2 save

# Build frontend
cd ~/FGAWeb/frontend
npm install
npm run build

# Nginx reload
sudo nginx -t && sudo systemctl reload nginx

# Obtain cert
sudo certbot --nginx -d example.com -d www.example.com---

## 16. Notes and best practices

- Do not run the Vite dev server in production — build static files and serve them with Nginx.
- Keep secrets out of VCS; use `backend/.env` or a secrets manager.
- Prefer disabling password SSH and using key-based auth only.
- If you plan to scale, move MySQL off the instance to an RDS or managed DB service.