import joblib
import pandas as pd
import sys

with open("model_info.txt", "w") as f:
    try:
        le = joblib.load("model/label_encoders.pkl")
        f.write(f"Label Encoders: {list(le.keys())}\n")
        for k, v in le.items():
            f.write(f"  {k}: {list(v.classes_)}\n")
        
        xgb = joblib.load("model/xgboost_attack_model.pkl")
        if hasattr(xgb, "feature_names_in_"):
            f.write(f"XGB Features: {list(xgb.feature_names_in_)}\n")
        
        scaler = joblib.load("model/scaler.pkl")
        f.write(f"Scaler Features Count: {scaler.n_features_in_}\n")
        
    except Exception as e:
        f.write(f"Error: {e}\n")
