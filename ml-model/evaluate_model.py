import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

def evaluate_hairfall_model():
    dataset_file = 'hair_fall_dataset.csv'

    if not os.path.exists(dataset_file):
        print(f"Error: {dataset_file} not found!")
        return

    print(f"Loading dataset {dataset_file} ...")
    data = pd.read_csv(dataset_file)
    print("Columns in dataset:", data.columns.tolist())

    target_col = 'hairfall_level'  # Use exact column name as in CSV

    # Drop rows with missing target labels
    data = data.dropna(subset=[target_col])

    print("First 5 rows of target column after dropping NaNs:")
    print(data[target_col].head())

    # If target is already numeric and correct, no mapping needed
    if data[target_col].dtype == object:
        data[target_col] = data[target_col].astype(str).str.strip().str.lower()
        label_mapping = {'low': 0, 'medium': 1, 'high': 2}
        data[target_col] = data[target_col].map(label_mapping)
        data = data.dropna(subset=[target_col])

    X = data.drop(columns=[target_col])
    y = data[target_col].astype(int)

    # Check and filter numeric columns presence
    numeric_columns_to_check = ['family_history', 'stress_level', 'medication_usage']
    present_numeric_cols = [col for col in numeric_columns_to_check if col in X.columns]

    if present_numeric_cols:
        mask_numeric = X[present_numeric_cols].notna().all(axis=1)
        X = X.loc[mask_numeric]
        y = y.loc[mask_numeric]

    # One-hot encoding for categorical columns
    possible_categorical_cols = ['gender', 'occupation', 'country', 'health_condition', 'diet_quality']
    categorical_cols = [col for col in possible_categorical_cols if col in X.columns]

    if categorical_cols:
        X = pd.get_dummies(X, columns=categorical_cols)

    print(f"Features after encoding: {list(X.columns)}")
    print(f"Classes after cleaning: {y.unique()}")
    print(f"Number of samples after cleaning: {len(y)}")

    if len(y) == 0:
        print("Error: No samples available after cleaning.")
        return

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, stratify=y, test_size=0.3, random_state=42
    )

    print(f"Training samples: {len(X_train)}, Testing samples: {len(X_test)}")

    try:
        model_path = 'hairfall_model_optimized.pkl'
        model = joblib.load(model_path)
        print(f"Model loaded from {model_path}")
    except Exception as e:
        print(f"Failed to load model: {e}")
        return

    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

    train_acc = accuracy_score(y_train, y_pred_train)
    test_acc = accuracy_score(y_test, y_pred_test)

    precision = precision_score(y_test, y_pred_test, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred_test, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred_test, average='weighted', zero_division=0)

    print(f"\nTrain Accuracy: {train_acc:.4f} ({train_acc*100:.2f}%)")
    print(f"Test Accuracy: {test_acc:.4f} ({test_acc*100:.2f}%)")
    print(f"Precision: {precision:.4f} ({precision*100:.2f}%)")
    print(f"Recall: {recall:.4f} ({recall*100:.2f}%)")
    print(f"F1-score: {f1:.4f} ({f1*100:.2f}%)")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred_test))


if __name__ == "__main__":
    evaluate_hairfall_model()
