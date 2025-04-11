FROM python:3.10-slim
# Set the working directory in the container
WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    protobuf-compiler \
    libprotobuf-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir torch==2.2.2  torchaudio==2.2.2 torchvision==0.17.2 timm==1.0.9 onnx==1.17.0 onnxsim==0.4.36 --extra-index-url https://download.pytorch.org/whl/cpu
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["python", "main.py"]
