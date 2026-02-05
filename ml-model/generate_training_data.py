import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

def train_and_save_model(min_accuracy=0.85):
    data_path = 'hair_fall_dataset.csv'
    if not os.path.exists(data_path):
        print(f"Error: Dataset {data_path} not found!")
        return False
    
    data = pd.read_csv(data_path)
    target_col = 'hairfall_level'
    X = data.drop(columns=[target_col])
    y = data[target_col]

    # One-hot encode categorical features
    categorical_cols = X.select_dtypes(include=['object']).columns.tolist()
    if categorical_cols:
        X = pd.get_dummies(X, columns=categorical_cols)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )

    rf = RandomForestClassifier(random_state=42)
    param_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [None, 5, 10, 15, 20],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }

    grid_search = GridSearchCV(rf, param_grid, cv=5, n_jobs=-1, scoring='accuracy', verbose=2)
    grid_search.fit(X_train, y_train)
    
    best_rf = grid_search.best_estimator_
    print(f"Best Parameters: {grid_search.best_params_}")

    y_pred = best_rf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Test Accuracy: {accuracy*100:.2f}%")
    print("Classification Report:\n", classification_report(y_test, y_pred))

    if accuracy >= min_accuracy:
        model_path = 'hairfall_model_optimized.pkl'
        joblib.dump(best_rf, model_path)
        print(f"✅ Model saved with accuracy {accuracy*100:.2f}% at {model_path}")
        return True
    else:
        print(f"⚠️ Model accuracy {accuracy*100:.2f}% is below the threshold {min_accuracy*100:.2f}%.")
        return False


if __name__ == "__main__":
    success = train_and_save_model()
    if success:
        print("🎉 Training completed with target accuracy achieved!")
    else:
        print("❌ Training did not meet minimum accuracy target. Consider improving data or features.")
