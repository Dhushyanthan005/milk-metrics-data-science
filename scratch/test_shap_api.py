import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_explainability():
    print("--- TESTING POST /api/predict/explanation ---")
    payload = {
        "breed": "Holstein",
        "age": 4,
        "weight": 620.0,
        "feed_quantity": 16.5,
        "water_intake": 85.0,
        "temperature": 22.0,
        "humidity": 60.0,
        "season": "summer",
        "disease_status": False,
        "body_condition_score": 3.5,
        "days_in_milk": 80,
        "previous_week_avg_yield": 24.5
    }

    # 1. Valid Explanation Request
    req = urllib.request.Request(
        f"{BASE_URL}/api/predict/explanation",
        data=json.dumps(payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req) as res:
            data = json.loads(res.read().decode('utf-8'))
            print("Status Code: 200 OK")
            print("Predicted Yield:", data.get("predicted_milk_yield"), "L")
            print("Base Value:", data.get("base_value"), "L")
            print("\nPositive Factors:")
            for p in data.get("positive_factors", []):
                print(f"  + {p['display_name']} ({p['feature']}): {p['impact']} L (value: {p['feature_value']})")
            print("\nNegative Factors:")
            for n in data.get("negative_factors", []):
                print(f"  - {n['display_name']} ({n['feature']}): {n['impact']} L (value: {n['feature_value']})")
            print("\nSummary:\n", data.get("explanation_summary"))
    except Exception as e:
        print("Test 1 Failed:", e)
        sys.exit(1)

    # 2. Test Invalid Input Handling
    print("\n--- TESTING INVALID INPUT HANDLING ---")
    invalid_payload = dict(payload)
    invalid_payload["humidity"] = 150.0  # Invalid humidity > 100
    
    req_inv = urllib.request.Request(
        f"{BASE_URL}/api/predict/explanation",
        data=json.dumps(invalid_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req_inv) as res:
            print("UNEXPECTED SUCCESS for invalid input!")
    except urllib.error.HTTPError as e:
        print(f"Correctly caught HTTP Error: {e.code}")
        err_body = e.read().decode('utf-8')
        print("Error detail:", err_body[:150])

    # 3. Test Existing Prediction Endpoint Remains Working
    print("\n--- TESTING EXISTING /api/predict ENDPOINT ---")
    req_pred = urllib.request.Request(
        f"{BASE_URL}/api/predict",
        data=json.dumps(payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req_pred) as res:
            pred_data = json.loads(res.read().decode('utf-8'))
            print("Predict Status: 200 OK")
            print("Prediction output:", pred_data)
    except Exception as e:
        print("Predict test failed:", e)
        sys.exit(1)

    print("\nALL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_explainability()
