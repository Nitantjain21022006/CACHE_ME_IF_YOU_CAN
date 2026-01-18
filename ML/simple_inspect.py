import joblib
import os

try:
    xgb = joblib.load("model/xgboost_attack_model.pkl")
    print(f"XGB_FEATURES:{','.join(xgb.feature_names_in_)}")
except Exception as e:
    print(f"ERROR:{str(e)}")
