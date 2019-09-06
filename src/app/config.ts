export var config =  {
  "url": {
   // "data": "http://127.0.0.1:5000/cursor_compress",
   // "channels": "http://localhost:5000/channels",
   // "chunk": "http://localhost:5000/chunk_compress/",
   // "templates": "http://localhost:5000/template",

    "data": "http://zephyr/api/v2/cursor_compress",
    "channels": "http://zephyr/api/v2/channels",
    "chunk": "http://zephyr/api/v2/chunk_compress/",
    "templates": "http://zephyr/api/v2/template",

    "template_host": "172.16.1.117",
    "template_port": 80,
    "template_path": "/api/v2"
  },
  "interval": [86400000.0, 604800000.0, 2592000000.0]
}
