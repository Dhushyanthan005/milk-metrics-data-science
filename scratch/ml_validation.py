import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import xgboost as xgb

DATASET_PATH = r"C:\Users\Dhushyanthan M\Downloads\global_cattle_milk_yield_prediction_dataset.csv"

def run_validation():
    print(f"Loading dataset from: {DATASET_PATH}")
    df = pd.read_csv(DATASET_PATH)
    
    # ----------------------------------------------------
    # TASK 1: DATASET INSPECTION
    # ----------------------------------------------------
    shape = df.shape
    total_records, total_cols = shape
    missing_vals = df.isnull().sum().to_dict()
    missing_cols_count = sum(1 for v in missing_vals.values() if v > 0)
    duplicate_rows = int(df.duplicated().sum())
    
    num_cols = list(df.select_dtypes(include=[np.number]).columns)
    cat_cols = list(df.select_dtypes(include=['object', 'category']).columns)
    
    target_col = 'Milk_Yield_L'
    prev_yield_col = 'Previous_Week_Avg_Yield'
    
    print("\n--- DATASET INSPECTION ---")
    print(f"Total Rows: {total_records}")
    print(f"Total Columns: {total_cols}")
    print(f"Target Column: {target_col}")
    print(f"Historical Yield Feature: {prev_yield_col}")
    print(f"Missing Values total columns with missing: {missing_cols_count}")
    print(f"Duplicate Rows: {duplicate_rows}")
    print(f"Numeric Columns ({len(num_cols)}): {num_cols}")
    print(f"Categorical Columns ({len(cat_cols)}): {cat_cols}")
    
    # ----------------------------------------------------
    # TASK 2: TARGET LEAKAGE ANALYSIS
    # ----------------------------------------------------
    corr_prev_target = float(df[prev_yield_col].corr(df[target_col]))
    abs_diff = (df[prev_yield_col] - df[target_col]).abs()
    mean_abs_diff = float(abs_diff.mean())
    std_abs_diff = float(abs_diff.std())
    
    print("\n--- TARGET LEAKAGE INVESTIGATION ---")
    print(f"Correlation between {prev_yield_col} and {target_col}: {corr_prev_target:.4f}")
    print(f"Mean Absolute Difference: {mean_abs_diff:.4f} Liters")
    print(f"Standard Dev of Difference: {std_abs_diff:.4f} Liters")
    
    # ----------------------------------------------------
    # PREPARATION FOR MODEL TRAINING
    # ----------------------------------------------------
    # Drop identifier and date columns that are non-generalizable
    ignore_cols = ['Cattle_ID', 'Farm_ID', 'Date', target_col]
    
    # Clean categorical columns for XGBoost categorical support
    cat_features = ['Breed', 'Region', 'Country', 'Climate_Zone', 'Management_System', 
                    'Lactation_Stage', 'Feed_Type', 'Season']
    
    X_full = df.drop(columns=ignore_cols, errors='ignore').copy()
    for col in cat_features:
        if col in X_full.columns:
            X_full[col] = X_full[col].astype('category')
            
    y = df[target_col].values
    
    # Train / Test Split
    X_train_full, X_test_full, y_train, y_test = train_test_split(
        X_full, y, test_size=0.20, random_state=42
    )
    
    # ----------------------------------------------------
    # TASK 3: EXPERIMENT A (WITH Previous_Week_Avg_Yield)
    # ----------------------------------------------------
    print("\n--- TRAINING EXPERIMENT A (WITH Previous_Week_Avg_Yield) ---")
    model_a = xgb.XGBRegressor(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        random_state=42,
        enable_categorical=True
    )
    model_a.fit(X_train_full, y_train)
    
    y_train_pred_a = model_a.predict(X_train_full)
    y_test_pred_a = model_a.predict(X_test_full)
    
    train_mae_a = float(mean_absolute_error(y_train, y_train_pred_a))
    train_rmse_a = float(np.sqrt(mean_squared_error(y_train, y_train_pred_a)))
    train_r2_a = float(r2_score(y_train, y_train_pred_a))
    
    test_mae_a = float(mean_absolute_error(y_test, y_test_pred_a))
    test_rmse_a = float(np.sqrt(mean_squared_error(y_test, y_test_pred_a)))
    test_r2_a = float(r2_score(y_test, y_test_pred_a))
    
    # Feature importances for Experiment A
    importances_a = model_a.feature_importances_
    feat_names_a = X_train_full.columns
    top15_a = sorted(zip(feat_names_a, importances_a), key=lambda x: x[1], reverse=True)[:15]
    
    # ----------------------------------------------------
    # TASK 3: EXPERIMENT B (WITHOUT Previous_Week_Avg_Yield)
    # ----------------------------------------------------
    print("\n--- TRAINING EXPERIMENT B (WITHOUT Previous_Week_Avg_Yield) ---")
    X_train_b = X_train_full.drop(columns=[prev_yield_col])
    X_test_b = X_test_full.drop(columns=[prev_yield_col])
    
    model_b = xgb.XGBRegressor(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        random_state=42,
        enable_categorical=True
    )
    model_b.fit(X_train_b, y_train)
    
    y_train_pred_b = model_b.predict(X_train_b)
    y_test_pred_b = model_b.predict(X_test_b)
    
    train_mae_b = float(mean_absolute_error(y_train, y_train_pred_b))
    train_rmse_b = float(np.sqrt(mean_squared_error(y_train, y_train_pred_b)))
    train_r2_b = float(r2_score(y_train, y_train_pred_b))
    
    test_mae_b = float(mean_absolute_error(y_test, y_test_pred_b))
    test_rmse_b = float(np.sqrt(mean_squared_error(y_test, y_test_pred_b)))
    test_r2_b = float(r2_score(y_test, y_test_pred_b))
    
    # Feature importances for Experiment B
    importances_b = model_b.feature_importances_
    feat_names_b = X_train_b.columns
    top15_b = sorted(zip(feat_names_b, importances_b), key=lambda x: x[1], reverse=True)[:15]
    
    # Output Json Results
    results = {
        "dataset_summary": {
            "total_records": total_records,
            "total_columns": total_cols,
            "missing_values_count": sum(missing_vals.values()),
            "duplicate_rows": duplicate_rows,
            "target_variable": target_col,
            "prev_yield_corr": corr_prev_target,
            "mean_abs_diff": mean_abs_diff
        },
        "experiment_a": {
            "name": "With Previous_Week_Avg_Yield",
            "train_mae": train_mae_a,
            "train_rmse": train_rmse_a,
            "train_r2": train_r2_a,
            "test_mae": test_mae_a,
            "test_rmse": test_rmse_a,
            "test_r2": test_r2_a,
            "top15_features": [{"feature": f, "importance": float(imp)} for f, imp in top15_a]
        },
        "experiment_b": {
            "name": "Without Previous_Week_Avg_Yield",
            "train_mae": train_mae_b,
            "train_rmse": train_rmse_b,
            "train_r2": train_r2_b,
            "test_mae": test_mae_b,
            "test_rmse": test_rmse_b,
            "test_r2": test_r2_b,
            "top15_features": [{"feature": f, "importance": float(imp)} for f, imp in top15_b]
        }
    }
    
    os.makedirs(r"c:\milk yield\scratch", exist_ok=True)
    with open(r"c:\milk yield\scratch\ml_validation_results.json", "w") as f:
        json.dump(results, f, indent=2)
        
    print("\nResults successfully saved to scratch/ml_validation_results.json")
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    run_validation()
