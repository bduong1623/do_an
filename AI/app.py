from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
import joblib
from sklearn.preprocessing import MinMaxScaler, Normalizer

app = Flask(__name__)

# ====== CORS Configuration ======
CORS(app, resources={
    r"/*": {
        "origins": ["*"],  # Cho phép tất cả origins, bạn có thể giới hạn theo domain cụ thể
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
        "supports_credentials": True
    }
})

# ====== Load model & scaler ======
model = load_model("./AI/best_cnn_lstm.keras")
scaler = joblib.load("./AI/scaler.pkl")

GRID = 5
TIME_STEPS = 3
FEATURES = ["dust", "temp", "humidity", "MQ2", "MQ7"]

def prepare_data_for_prediction(df):
    times_sorted = sorted(df["time"].unique())
    if len(times_sorted) < TIME_STEPS:
        raise ValueError(f"Cần ít nhất {TIME_STEPS} time steps")
    
    selected_times = times_sorted[:TIME_STEPS]
    X_block = []
    
    for t in selected_times:
        time_data = df[df["time"] == t].sort_values(["x", "y"])
        feature_values = time_data[FEATURES].values
        
        if len(feature_values) == GRID*GRID:
            grid_snapshot = feature_values.reshape(GRID, GRID, len(FEATURES))
        else:
            grid_snapshot = np.zeros((GRID, GRID, len(FEATURES)))
            for _, row in time_data.iterrows():
                x_idx = int(row['x']) - 1
                y_idx = int(row['y']) - 1
                if 0 <= x_idx < GRID and 0 <= y_idx < GRID:
                    grid_snapshot[x_idx, y_idx] = row[FEATURES].values
        
        X_block.append(grid_snapshot)
    
    X = np.array([X_block])
    original_shape = X.shape
    X_scaled = scaler.transform(X.reshape(-1, len(FEATURES)))
    X_scaled = X_scaled.reshape(original_shape)
    
    return X_scaled

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200
        
    try:
        # Nhận JSON data từ request
        csv_data = request.get_json()['data']
        df = pd.DataFrame(csv_data)
        
        # Prepare data
        X_pred_scaled = prepare_data_for_prediction(df)
        
        # Predict
        y_pred_scaled = model.predict(X_pred_scaled, verbose=0)
        
        # Reshape và inverse transform
        step_25x5 = y_pred_scaled.reshape(GRID*GRID, len(FEATURES))
        
        if isinstance(scaler, MinMaxScaler):
            step_unscaled = scaler.inverse_transform(step_25x5)
        elif isinstance(scaler, Normalizer):
            step_unscaled = step_25x5.copy()
        else:
            step_unscaled = step_25x5.copy()
        
        # Format thành response
        pred_flat = step_unscaled.flatten()
        snap = pred_flat.reshape(GRID, GRID, len(FEATURES))
        
        rows = []
        prediction_time = "2025-08-09 14:10:27+07:00"
        
        for i in range(GRID):
            for j in range(GRID):
                row = {"time": prediction_time, "x": i+1, "y": j+1}
                for f_id, f_name in enumerate(FEATURES):
                    row[f_name] = float(snap[i, j, f_id])
                rows.append(row)
        
        response = jsonify({
            "status": "success",
            "predictions": rows
        })
        
        # Thêm CORS headers (optional, flask-cors đã handle)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
        
    except Exception as e:
        error_response = jsonify({
            "status": "error", 
            "message": str(e)
        })
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 400

@app.route('/predict_csv', methods=['POST', 'OPTIONS'])
def predict_csv():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200
        
    try:
        # Load từ CSV file
        df = pd.read_csv("./AI/02_data_clean.csv", nrows=75)
        
        # Prepare data
        X_pred_scaled = prepare_data_for_prediction(df)
        
        # Predict
        y_pred_scaled = model.predict(X_pred_scaled, verbose=0)
        
        # Reshape và inverse transform
        step_25x5 = y_pred_scaled.reshape(GRID*GRID, len(FEATURES))
        
        if isinstance(scaler, MinMaxScaler):
            step_unscaled = scaler.inverse_transform(step_25x5)
        elif isinstance(scaler, Normalizer):
            step_unscaled = step_25x5.copy()
        else:
            step_unscaled = step_25x5.copy()
        
        # Format thành response
        pred_flat = step_unscaled.flatten()
        snap = pred_flat.reshape(GRID, GRID, len(FEATURES))
        
        rows = []
        prediction_time = "2025-08-09 14:10:27+07:00"
        
        for i in range(GRID):
            for j in range(GRID):
                row = {"time": prediction_time, "x": i+1, "y": j+1}
                for f_id, f_name in enumerate(FEATURES):
                    row[f_name] = float(snap[i, j, f_id])
                rows.append(row)
        
        response = jsonify({
            "status": "success",
            "predictions": rows
        })
        
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
        
    except Exception as e:
        error_response = jsonify({
            "status": "error", 
            "message": str(e)
        })
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 400

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Sensor Prediction API with CORS",
        "endpoints": {
            "/predict": "POST - Send sensor data as JSON",
            "/predict_csv": "POST - Predict from CSV file"
        },
        "cors": "Enabled for all origins"
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)