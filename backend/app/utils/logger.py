import logging
import sys


def setup_logging(level=logging.INFO):
    fmt = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    logging.basicConfig(stream=sys.stdout, level=level, format=fmt)


def get_logger(name: str = "smart_dairy") -> logging.Logger:
    return logging.getLogger(name)


setup_logging()
logger = get_logger()
