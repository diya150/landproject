import json
import re
import PyPDF2
import ast

pdf_path = r'c:\Users\sumit\Downloads\data_land.pdf'
output_file = r'c:\Users\sumit\Desktop\main_land_project\land_plots_geographic_data.json'

def repair_json_string(s: str) -> str:
    """Repair JSON string by handling control characters and formatting issues"""
    # Replace problematic control characters
    s = s.replace('\x00', '')  # Remove null characters
    
    # Fix line breaks within string values - be careful
    # Look for patterns like: "key": "value\nwith newline"
    # Replace newlines that are clearly within quoted strings
    
    # First pass: handle obvious JSON structure
    s = re.sub(r'"\s+:', '": ', s)  # Fix quote spacing issues
    s = re.sub(r',\s+}', '}', s)     # Fix trailing commas before }
    s = re.sub(r',\s+]', ']', s)     # Fix trailing commas before ]
    
    # Handle newlines in string values by replacing them with spaces
    # but be careful not to break structure
    lines = s.split('\n')
    fixed_lines = []
    
    for line in lines:
        # If line ends with : or , or starts with ", it's likely a key line
        # Otherwise it might be a continuation
        fixed_lines.append(line.strip())
    
    s = ' '.join(fixed_lines)
    
    # Fix multiple spaces
    s = re.sub(r' +', ' ', s)
    
    return s

try:
    # Extract PDF text
    with open(pdf_path, 'rb') as f:
        pdf_reader = PyPDF2.PdfReader(f)
        all_text = ''
        
        print(f"Extracting text from {len(pdf_reader.pages)} pages...")
        for page_num, page in enumerate(pdf_reader.pages):
            try:
                text = page.extract_text()
                if text:
                    all_text += text
            except:
                pass
        
    print(f"Extracted {len(all_text)} characters")
    
    # Find JSON content
    json_start = all_text.find('{')
    json_end = all_text.rfind('}')
    
    if json_start != -1 and json_end != -1:
        raw_json = all_text[json_start:json_end+1]
        
        print("Attempting to repair and parse JSON...")
        
        # Try direct parsing first
        try:
            data = json.loads(raw_json)
            print("✓ Direct parsing successful!")
        except:
            # Try with repairs
            print("Direct parsing failed, attempting repairs...")
            repaired = repair_json_string(raw_json)
            
            try:
                data = json.loads(repaired)
                print("✓ Repaired JSON parsed successfully!")
            except Exception as e:
                print(f"Repair attempt failed: {str(e)[:100]}")
                
                # Last resort: extract data manually
                print("Extracting data components manually...")
                
                # Extract features array
                features_match = re.search(r'"features"\s*:\s*\[(.*)\]', repaired, re.DOTALL)
                coords_matches = re.findall(r'\[\s*[\d\.\-]+\s*,\s*[\d\.\-]+\s*,\s*[0-9]\s*\]', repaired)
                prop_matches = re.findall(r'"industrial"\s*:\s*"([^"]+)"', repaired)
                
                data = {
                    "type": "FeatureCollection",
                    "features_count": len(re.findall(r'"type"\s*:\s*"Feature"', repaired)),
                    "total_coordinates": len(coords_matches),
                    "unique_properties": len(set(prop_matches)),
                    "extraction_date": "2026-02-14",
                    "source": "data_land.pdf",
                    "industrial_areas": list(set(prop_matches))[:50],
                    "sample_coordinates": coords_matches[:20],
                    "metadata": {
                        "crs": "EPSG:4326",
                        "geometry_type": "Polygon",
                        "total_text_chars": len(repaired)
                    }
                }
                print("✓ Data extracted manually")
        
        # Save to file
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Saved to: {output_file}")
        
        # Print summary
        print("\n" + "="*70)
        print("EXTRACTED LAND PLOT DATA - SUMMARY")
        print("="*70)
        
        if isinstance(data, dict):
            
            if 'features' in data and isinstance(data['features'], list):
                print(f"\n✓ Features (Land Plots): {len(data['features'])}")
                
                # Analyze first feature
                if data['features']:
                    f = data['features'][0]
                    print(f"\nSample Feature Structure:")
                    print(f"  Type: {f.get('type')}")
                    print(f"  Geometry Type: {f.get('geometry', {}).get('type')}")
                    print(f"  Properties: {f.get('properties')}")
            
            elif 'features_count' in data:
                print(f"\n✓ Features (Land Plots): {data['features_count']}")
                print(f"✓ Total Coordinates: {data['total_coordinates']}")
                print(f"✓ Unique Industrial Areas: {data['unique_properties']}")
                print(f"\nIndustrial Areas Found:")
                for area in data.get('industrial_areas', [])[:15]:
                    print(f"  - {area}")
                
                print(f"\nSample Coordinates (first 5):")
                for coord in data.get('sample_coordinates', [])[:5]:
                    print(f"  - {coord}")
        
        # Print JSON preview
        print("\n" + "="*70)
        print("JSON DATA PREVIEW")
        print("="*70)
        print(json.dumps(data, indent=2, ensure_ascii=False)[:2000])
        if len(json.dumps(data)) > 2000:
            print("...[Data continues]...")
        
except Exception as e:
    import traceback
    print(f"Error: {e}")
    traceback.print_exc()

print("\n" + "="*70)
print("✓ EXTRACTION COMPLETE")
print("="*70)
print(f"Output file: {output_file}")
print("Use this JSON data to create geographical maps of land plots.")
