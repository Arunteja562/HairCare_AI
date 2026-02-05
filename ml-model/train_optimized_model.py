import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split, RandomizedSearchCV, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
import xgboost as xgb
import joblib

def train_and_save_model(data_path='hair_fall_dataset.csv', min_accuracy=0.6):
    if not os.path.exists(data_path):
        print(f"Error: Dataset '{data_path}' not found!")
        return False

    # Load data
    data = pd.read_csv(data_path)
    print("Columns in loaded data:", data.columns.tolist())

    # Target column name as per your latest CSV
    target_col = 'hairfall_level'
    
    # Drop rows missing the target
    data = data.dropna(subset=[target_col])
    print("Sample target column values after dropping NA:\n", data[target_col].head())

    # Check: are labels already integer and valid?
    unique_labels = set(data[target_col].unique())
    print(f"Unique labels in target_col: {unique_labels}")

    valid_labels = {0, 1, 2}
    if not unique_labels.issubset(valid_labels):
        print(f"Error: Some label values are not 0, 1, or 2. Found: {unique_labels}")
        return False
    else:
        print("Label values are correctly formatted as 0, 1, and 2. Proceeding without mapping.")

    # Separate features and target
    X = data.drop(columns=[target_col])
    y = data[target_col].astype(int)  # ensure integer type

    # One-hot encode any remaining object-type (categorical) columns
    categorical_cols = X.select_dtypes(include=['object']).columns.tolist()
    if categorical_cols:
        print("One-hot encoding columns:", categorical_cols)
        X = pd.get_dummies(X, columns=categorical_cols)

    # Drop any rows with NaN in the features
    nan_rows = X.isna().any(axis=1)
    if nan_rows.sum() > 0:
        print(f"Dropping {nan_rows.sum()} row(s) with NaN in features.")
        X = X[~nan_rows]
        y = y[~nan_rows]

    print(f"Remaining samples for training: {len(y)}")

    # Split train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, stratify=y, random_state=42
    )

    # Use SMOTE to balance training data
    smote = SMOTE(random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train, y_train)

    # Create XGBoost classifier
    model = xgb.XGBClassifier(random_state=42, use_label_encoder=False, eval_metric='mlogloss')

    # Define hyperparameter search space
    param_dist = {
        'n_estimators': [100, 200, 300, 400],
        'max_depth': [5, 10, 15, 20, None],
        'learning_rate': [0.01, 0.05, 0.1, 0.2],
        'subsample': [0.6, 0.8, 1.0],
        'colsample_bytree': [0.6, 0.8, 1.0],
        'min_child_weight': [1, 3, 5]
    }

    random_search = RandomizedSearchCV(
        model,
        param_distributions=param_dist,
        n_iter=30,
        scoring='accuracy',
        cv=5,
        verbose=2,
        random_state=42,
        n_jobs=-1
    )

    random_search.fit(X_train_res, y_train_res)

    best_model = random_search.best_estimator_
    print(f"Best Hyperparameters: {random_search.best_params_}")

    # Cross-validation score
    cv_scores = cross_val_score(best_model, X, y, cv=5, scoring='accuracy')
    print(f"Cross-validation accuracy: {cv_scores.mean()*100:.2f}% ± {cv_scores.std()*100:.2f}%")

    # Test set metrics
    y_pred = best_model.predict(X_test)
    test_acc = accuracy_score(y_test, y_pred)
    print(f"Test Accuracy: {test_acc*100:.2f}%")
    print("Classification Report:\n", classification_report(y_test, y_pred))

    # Save the model
    model_path = "hairfall_model_optimized.pkl"
    joblib.dump(best_model, model_path)
    print(f"✅ Model saved: {model_path} with accuracy {test_acc*100:.2f}%")
    return True

if __name__ == "__main__":
    train_and_save_model()
