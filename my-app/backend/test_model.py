from model import VitaGuideModel

def test_model():
    # Initialize model
    print("Initializing model...")
    model = VitaGuideModel()
    
    # Test some countries
    test_cases = [
        {'Entity': 'Afghanistan', 'Code': 'AFG', 'Year': 2000},
        {'Entity': 'Afghanistan', 'Code': 'AFG', 'Year': None},  # Will get most recent
        {'Entity': 'India', 'Code': 'IND', 'Year': 2000},
    ]
    
    for test_input in test_cases:
        try:
            prevalence = model.get_prevalence(test_input)
            year_info = f"in {test_input['Year']}" if test_input['Year'] else "(most recent)"
            print(f"\nVitamin A Deficiency Prevalence for {test_input['Entity']} {year_info}: {prevalence:.2f}%")
        except Exception as e:
            print(f"\nError for {test_input['Entity']}: {str(e)}")

if __name__ == "__main__":
    test_model() 