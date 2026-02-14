import json
import PyPDF2
from typing import Dict, Any, List

pdf_path = r'c:\Users\sumit\Downloads\data_land.pdf'
output_file = r'c:\Users\sumit\Desktop\main_land_project\extracted_land_data.json'

try:
    with open(pdf_path, 'rb') as f:
        pdf_reader = PyPDF2.PdfReader(f)
        all_text = ''
        
        print(f"Processing PDF with {len(pdf_reader.pages)} pages...")
        
        # Extract text from all pages
        for page_num, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            all_text += text
            if (page_num + 1) % 50 == 0:
                print(f"  Processed {page_num + 1}/{len(pdf_reader.pages)} pages...")
        
    print(f"\nTotal text extracted: {len(all_text)} characters")
    
    # Try to parse as JSON or clean it up
    print("\nAttempting to parse as JSON...")
    
    # The PDF likely contains JSON data
    # Look for JSON object patterns
    import re
    
    # Find the main JSON structure
    json_start = all_text.find('{')
    if json_start != -1:
        # Find the last closing brace
        json_end = all_text.rfind('}')
        if json_end != -1:
            json_str = all_text[json_start:json_end+1]
            
            # Try to parse it
            try:
                data = json.loads(json_str)
                print("✓ Successfully parsed JSON!")
                
                # Save to file
                with open(output_file, 'w', encoding='utf-8') as out:
                    json.dump(data, out, indent=2, ensure_ascii=False)
                
                print(f"✓ Data saved to: {output_file}")
                
                # Print summary
                if 'features' in data:
                    print(f"\nData Summary:")
                    print(f"  - Number of features: {len(data.get('features', []))}")
                    print(f"  - Type: {data.get('type')}")
                    
                    if data.get('features'):
                        first_feature = data['features'][0]
                        if 'geometry' in first_feature:
                            geom_type = first_feature['geometry'].get('type')
                            print(f"  - Geometry type: {geom_type}")
                        if 'properties' in first_feature:
                            print(f"  - Sample properties: {json.dumps(first_feature['properties'], indent=4)}")
                
                # Print a compact version to console
                print(f"\n✓ Complete JSON data structure (first 2000 chars):")
                print(json.dumps(data, indent=2, ensure_ascii=False)[:2000])
                print("...")
                
            except json.JSONDecodeError as e:
                print(f"✗ Failed to parse complete JSON: {str(e)[:100]}")
                
                # Try to extract just the useful parts
                print("\nAttempting to extract structured data...")
                
                # Look for coordinate patterns [lon, lat, 0]
                coord_pattern = r'\[[\d\.\-]+,[\d\.\-]+,[0-9]\]'
                coords = re.findall(coord_pattern, all_text)
                
                # Look for property patterns
                prop_pattern = r'"properties":\s*\{[^}]+\}'
                properties = re.findall(prop_pattern, all_text)
                
                extracted = {
                    "coordinate_count": len(coords),
                    "sample_coordinates": coords[:10] if coords else [],
                    "property_count": len(properties),
                    "sample_properties": properties[:10] if properties else [],
                    "raw_text_length": len(all_text)
                }
                
                with open(output_file, 'w', encoding='utf-8') as out:
                    json.dump(extracted, out, indent=2)
                    
                print(f"✓ Extracted data saved to: {output_file}")
                print(json.dumps(extracted, indent=2)[:1000])
        else:
            print("✗ Could not find closing brace in JSON")
    else:
        print("✗ Could not find opening brace for JSON")
        
except FileNotFoundError:
    print(f"✗ PDF file not found: {pdf_path}")
except Exception as e:
    import traceback
    print(f"✗ Error processing PDF: {e}")
    traceback.print_exc()
