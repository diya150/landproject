import json
import re
import PyPDF2
from typing import Dict, Any, List

pdf_path = r'c:\Users\sumit\Downloads\data_land.pdf'
output_file = r'c:\Users\sumit\Desktop\main_land_project\land_plots_geographic_data.json'

try:
    with open(pdf_path, 'rb') as f:
        pdf_reader = PyPDF2.PdfReader(f)
        all_text = ''
        
        print(f"Extracting from {len(pdf_reader.pages)} pages...")
        for page_num, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            all_text += text
        
    print(f"Total text length: {len(all_text)} characters")
    
    # Remove control characters but keep the structure
    # Replace \n and \r with spaces in unwanted places
    cleaned_text = all_text
    
    # Try different approaches to find and fix JSON
    print("Cleaning and parsing JSON...")
    
    # Find JSON structure
    json_start_patterns = [
        r'\{"type"\s*:\s*"FeatureCollection"',
        r'\{[\s\n]*"type"[\s\n]*:[\s\n]*"',
    ]
    
    best_start = -1
    for pattern in json_start_patterns:
        match = re.search(pattern, cleaned_text)
        if match:
            best_start = match.start()
            break
    
    if best_start == -1:
        best_start = cleaned_text.find('{')
    
    if best_start != -1:
        # Find matching closing brace
        brace_count = 0
        for i in range(best_start, len(cleaned_text)):
            if cleaned_text[i] == '{':
                brace_count += 1
            elif cleaned_text[i] == '}':
                brace_count -= 1
                if brace_count == 0:
                    json_str = cleaned_text[best_start:i+1]
                    break
        
        # Clean up the JSON string
        # Replace newlines within strings carefully
        json_str = json_str.replace('\n', ' ').replace('\r', ' ')
        
        # Fix multiple spaces
        json_str = re.sub(r' +', ' ', json_str)
        
        try:
            data = json.loads(json_str)
            print("✓ Successfully parsed complete GeoJSON!")
            
            with open(output_file, 'w', encoding='utf-8') as out:
                json.dump(data, out, indent=2, ensure_ascii=False)
            
            print(f"✓ Saved to: {output_file}")
            
            # Print comprehensive summary
            print("\n" + "="*60)
            print("EXTRACTED LAND PLOT DATA SUMMARY")
            print("="*60)
            
            if 'features' in data:
                features = data['features']
                print(f"\nTotal Features (Land Plots): {len(features)}")
                
                # Extract unique properties
                all_properties = {}
                unique_locations = set()
                
                for feature in features:
                    if 'properties' in feature:
                        for key, value in feature['properties'].items():
                            if key not in all_properties:
                                all_properties[key] = set()
                            if value:
                                all_properties[key].add(str(value)[:50])
                    
                    if 'geometry' in feature and feature['geometry'].get('type') == 'Polygon':
                        coords = feature['geometry']['coordinates']
                        if coords:
                            unique_locations.add(f"{coords[0][0][0]:.4f}, {coords[0][0][1]:.4f}")
                
                print(f"\nUnique Locations: {len(unique_locations)}")
                print(f"Property Types: {len(all_properties)}")
                
                for prop_key, prop_values in all_properties.items():
                    print(f"\n  Property: '{prop_key}'")
                    print(f"    Unique values: {len(prop_values)}")
                    for val in list(prop_values)[:5]:
                        print(f"      - {val}")
                
                # Print sample feature details
                print("\n" + "="*60)
                print("SAMPLE FEATURE (Land Plot) DETAILS")
                print("="*60)
                
                if features:
                    sample = features[0]
                    print(json.dumps(sample, indent=2)[:1500])
                    print("...")
            
            # Print JSON snippet
            print("\n" + "="*60)
            print("JSON DATA STRUCTURE PREVIEW")
            print("="*60)
            print(json.dumps(data, indent=2, ensure_ascii=False)[:2000])
            print("...[Data continues]...")
            
        except json.JSONDecodeError as e:
            print(f"✗ JSON Parse Error: {e}")
            print(f"  Error at position: {e.pos}")
            
    else:
        print("✗ Could not find JSON structure")
        
except Exception as e:
    import traceback
    print(f"✗ Error: {e}")
    traceback.print_exc()

print("\n✓ Complete data has been extracted and saved to:")
print(f"  {output_file}")
print("\nYou can now use this JSON file to create geographical maps.")
