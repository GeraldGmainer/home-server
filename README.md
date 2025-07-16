# Home Server Docker Compose

This repository contains the `docker-compose.yml` and configuration to run a complete self-hosted homelab stack on your server.

It includes:

- **Pi-hole** – network-wide ad-blocking
- **Caddy** – reverse proxy with automatic HTTPS
- **Vaultwarden** – Bitwarden-compatible password manager
- **Wiki.js** – Documentation/wiki
- **Immich** – Photo backup and sharing
- **Nextcloud** – Personal cloud storage
- **Prometheus / Grafana / Node Exporter / cAdvisor** – Monitoring stack
- **Portainer** – Docker management UI
- **Glances** – System metrics
- **Glance** – Beautiful dashboard
- **Blackbox Exporter** – Endpoint monitoring

---

## Features

✅ Reverse proxy with HTTPS (via Caddy)
✅ Easy service discovery and dashboard (via Glance)
✅ Monitoring and metrics (Prometheus, Grafana, Node Exporter, cAdvisor)
✅ Self-hosted password vault (Vaultwarden)
✅ Network-wide DNS blocking (Pi-hole)
✅ Photo management (Immich)
✅ Personal cloud (Nextcloud)
✅ Container management (Portainer)

---

## 📦 Requirements

- Docker
- Docker Compose v2
- Domain (for Caddy reverse proxy)

---

## ⚙️ Setup

1️⃣ Clone this repo:

```bash
git clone https://github.com/GeraldGmainer/home-server.git
cd home-server
```

2️⃣ Create your .env file with secrets:

```bash
PIHOLE_WEBPASSWORD=your_pihole_password
VAULTWARDEN_ADMIN_TOKEN=your_vaultwarden_admin_token
```

3️⃣ Edit Caddyfile to set your domains.

4️⃣ Start everything:

```bash
docker compose up -d
```

🚀 Managing your stack

- Start:

```bash
docker compose up -d
```

- Stop:

```bash
docker compose down
```

- View logs:

```bash
docker compose logs -f
```

🖥️ Access your services

- Pi-hole: http://YOUR_IP:8081/admin
- Portainer: http://YOUR_IP:9000
- Grafana: http://YOUR_IP:3000
- Prometheus: http://YOUR_IP:9090
- Nextcloud: http://YOUR_IP:8082
- Immich: http://YOUR_IP:2283
- Vaultwarden: https://YOUR_DOMAIN
- Glance dashboard: http://YOUR_IP:3010

(Replace YOUR_IP or YOUR_DOMAIN accordingly)

🔒 Reverse Proxy Notes
Uses Caddy for automatic HTTPS.

Ensure your DNS (Pi-hole or public) points domains to your server.

Edit the Caddyfile to set your domain rules.

📊 Monitoring stack
Includes:

- Prometheus – metrics collection
- Grafana – dashboards
- Node Exporter – host metrics
- cAdvisor – container metrics
- Blackbox Exporter – endpoint monitoring

✨ Glance dashboard
Your central homelab dashboard with:

- Container status
- Server stats
- Service monitors
- Pi-hole stats

Configure in glance/glance.yml.

## Run disk usage api

build:

```
docker build --network=host -t disk_usage_api ./diskusage
```

start:

```
docker compose up -d disk_usage_api
```

test:

```
curl http://192.168.178.10:8000/

```
