import pandas as pd
import os

class VitaGuideModel:
    def __init__(self):
        self.data = None
        self.data_dir = os.path.join(os.path.dirname(__file__), 'data')
        os.makedirs(self.data_dir, exist_ok=True)
        self.default_csv_path = "/Users/alaineperdomo/Downloads/prevalence-of-vitamin-a-deficiency-in-children/prevalence-of-vitamin-a-deficiency-in-children.csv"
        self.load_data()

    def load_data(self):
        try:
            # Load the CSV file and print columns to debug
            self.data = pd.read_csv(self.default_csv_path)
            print("Available columns:", self.data.columns.tolist())
            
            # Get the most recent data point for each country
            self.data = self.data.sort_values('Year').groupby('Entity').last().reset_index()
            return True
        except Exception as e:
            print(f"Error loading data: {str(e)}")
            return False

    def get_prevalence(self, input_data):
        if self.data is None:
            raise ValueError("Data not loaded. Please check the CSV file.")
            
        try:
            # Filter data for the given country
            country_data = self.data[self.data['Entity'] == input_data['Entity']]
            
            if country_data.empty:
                raise ValueError(f"No data found for country: {input_data['Entity']}")

            # Get the prevalence value (adjust column name if needed)
            prevalence_column = [col for col in self.data.columns if 'prevalence' in col.lower()][0]
            prevalence = country_data.iloc[0][prevalence_column]
            return float(prevalence)
            
        except Exception as e:
            raise ValueError(f"Error getting prevalence: {str(e)}") 