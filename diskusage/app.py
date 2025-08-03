from flask import Flask, jsonify
import os
import psutil

def format_bytes(num):
    for unit in ['B', 'KB', 'MB', 'GB', 'TB', 'PB']:
        if num < 1024:
            return f"{num:,.1f} {unit}".replace('.', ',')
        num /= 1024
    return f"{num:,.1f} PB".replace('.', ',')

targets = {
    'root': os.getenv('NVME_PATH', '/'),
    'immich': os.getenv('SSD_PATH', '/mnt/immich-bulk'),
    'nas': '/mnt/nas',
    'archive': '/mnt/archive',
    'backups': '/mnt/backups'
}

app = Flask(__name__)

@app.route('/')
def disk_usage():
    data = {}
    for name, path in targets.items():
        usage = psutil.disk_usage(path)
        data[name] = {
            'percent': int(usage.percent),
            'used': format_bytes(usage.used),
            'total': format_bytes(usage.total)
        }
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
