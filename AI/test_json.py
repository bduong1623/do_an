import pandas as pd
import json

# Load 75 dòng đầu từ CSV
df = pd.read_csv("./AI/02_data_clean.csv", nrows=75)

print(f"Loaded {len(df)} rows")
print("Columns:", df.columns.tolist())

# Convert thành list of dictionaries
data_list = df.to_dict('records')

# Tạo JSON format cho API
api_payload = {
    "data": data_list
}

# Save thành file JSON
with open('api_test_data.json', 'w') as f:
    json.dump(api_payload, f, indent=2)

print("Saved to api_test_data.json")
print(f"Total records: {len(data_list)}")
print("\nFirst record:")
print(json.dumps(data_list[0], indent=2))
print("\nLast record:")
print(json.dumps(data_list[-1], indent=2))

# Tạo thêm file compact (không indent) để copy dễ dàng
with open('api_test_data_compact.json', 'w') as f:
    json.dump(api_payload, f)

print("\nAlso saved compact version to api_test_data_compact.json")
print("You can copy this file content directly to Postman body!")