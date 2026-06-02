# config
from dotenv import load_dotenv
import os

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")
KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID")
MODEL_ID = os.getenv("MODEL_ID")