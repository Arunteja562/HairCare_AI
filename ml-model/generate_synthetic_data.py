import pandas as pd
import numpy as np


def generate_synthetic_data(n_samples=1000):
    np.random.seed(42)

    ages = np.random.randint(18, 70, n_samples)
    stress_levels = np.random.randint(1, 11, n_samples)     # 1-10 scale
    sleep_hours = np.clip(np.random.normal(7, 1.5, n_samples), 3, 12)  # normal around 7h, clipped to [3,12]
    work_hours = np.random.randint(5, 13, n_samples)        # 5-12 hours

    hairfall_level = []
    # Improved logic for label assignment
    for i in range(n_samples):
        if stress_levels[i] >= 8 or sleep_hours[i] <= 5:
            hairfall_level.append(2)  # High risk
        elif (stress_levels[i] >= 5 or work_hours[i] >= 10 or sleep_hours[i] < 7):
            hairfall_level.append(1)  # Medium risk
        else:
            hairfall_level.append(0)  # Low risk

    df = pd.DataFrame({
        'age': ages,
        'stress_level': stress_levels,
        'sleep_hours': sleep_hours,
        'work_hours': work_hours,
        'hairfall_level': hairfall_level
    })

    print("Generated label counts:")
    print(df['hairfall_level'].value_counts())
    df.to_csv('hair_fall_dataset.csv', index=False)
    print("✅ Synthetic dataset created as hair_fall_dataset.csv")


if __name__ == "__main__":
    generate_synthetic_data()
