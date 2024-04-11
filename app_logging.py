import logging
from pythonjsonlogger import jsonlogger
import os
import sys


def setup_logger(name="WebAppLogger", log_file="/tmp/webapp.log"):
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    for handler in logger.handlers:
        logger.removeHandler(handler)

    if os.getenv("CI") == "true":

        handler = logging.StreamHandler(sys.stdout)
    else:

        handler = logging.FileHandler(log_file)

    handler.setLevel(logging.DEBUG)

    fmt = jsonlogger.JsonFormatter(
        "%(name)s %(asctime)s %(levelname)s %(filename)s %(lineno)s %(process)d %(message)s",
        rename_fields={"levelname": "severity", "asctime": "timestamp"},
    )
    handler.setFormatter(fmt)
    logger.addHandler(handler)

    return logger
