#!/bin/sh
# Return JSON with disk usage percentages
nvme=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')
ssd=$(df -h /mnt/immich-bulk | awk 'NR==2 {print $5}' | tr -d '%')
printf '{"nvme": %s, "ssd": %s}\n' "$nvme" "$ssd"