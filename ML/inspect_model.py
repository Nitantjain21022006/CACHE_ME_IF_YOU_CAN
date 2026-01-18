import joblib
import pandas as pd

try:
    scaler = joblib.load("model/scaler.pkl")
    print("Scaler Features:", scaler.n_features_in_)
    if hasattr(scaler, "get_feature_names_out"):
        print("Feature Names:", scaler.get_feature_names_out())
    else:
        print("Feature names not available in this scaler version.")
    
    xgb = joblib.load("model/xgboost_attack_model.pkl")
    if hasattr(xgb, "feature_names_in_"):
        print("XGB Features:", xgb.feature_names_in_)
except Exception as e:
    print(f"Error: {e}")
