# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# import uvicorn
# from Crontab import classifier_image
# app = FastAPI()
# from APIs import *
# import dotenv
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load the environment variables
# dotenv.load_dotenv()

# if __name__ == '__main__':
#     uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
import dotenv
dotenv.load_dotenv()
from services import classifier_image
print("Deeplearning service started")
