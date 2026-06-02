import logging

logging.basicConfig(
    filename="runtimes_log/chat.log",
    level=logging.INFO,
    format="%(asctime)s - %(message)s"
)

logger = logging.getLogger(__name__)