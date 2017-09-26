export var config =  {
  "url": {
//    "data": "http://127.0.0.1:5000/cursor_compress",
//    "channels": "http://localhost:5000/channels",
//    "chunk": "http://localhost:5000/chunk_compress/",
//    "templates": "http://localhost:5000/template",

    "data": "http://zephyr/api/v1/cursor_compress",
    "channels": "http://zephyr/api/v1/channels",
    "chunk": "http://zephyr/api/v1/chunk_compress/",
    "templates": "http://zephyr/api/v1/template",

    "template_host": "172.16.1.117",
    "template_port": 5000,
    "template_url": "http://172.16.1.117:5000/"
  },
  "interval": [86400000.0, 604800000.0, 2592000000.0]
}
