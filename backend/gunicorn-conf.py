import multiprocessing


workers = multiprocessing.cpu_count() * 2 + 1
reload = True
# bind = "0.0.0.0:8000"

# accesslog = "/app/logs/gunicorn/access.log"
# errorlog = "/app/logs/gunicorn/error.log"
capture_output = True
log_level = "info"
