import json
import base64
import re
import PyPDF2
from typing import Any, Dict, List

pdf_path = r'c:\Users\sumit\Downloads\data_land.pdf'

def decode_base64(text: str) -> str:
    """Attempt to decode base64 text"""
    try:
        decoded = base64.b64decode(text)
        return decoded.decode('utf-8', errors='replace')
    except:
        return None

def decode_hex(text: str) -> str:
    """Attempt to decode hex text"""
    try:
        decoded = bytes.fromhex(text)
        return decoded.decode('utf-8', errors='replace')
    except:
        return None

def extract_json_from_text(text: str) -> List[Dict]:
    """Extract JSON objects from text"""
    json_objects = []
    # Try to find JSON patterns
    json_pattern = r'\{[^{}]*\}'
    matches = re.finditer(json_pattern, text)
    for match in matches:
        try:
            obj = json.loads(match.group())
            json_objects.append(obj)
        except:
            pass
    return json_objects

try:
    with open(pdf_path, 'rb') as f:
        pdf_reader = PyPDF2.PdfReader(f)
        print(f"PDF has {len(pdf_reader.pages)} pages\n")
        
        all_text = ''
        for page_num, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            all_text += text
            
    print("=" * 60)
    print("RAW PDF TEXT CONTENT")
    print("=" * 60)
    print(all_text)
    print("\n" + "=" * 60)
    print("SEARCHING FOR ENCODED DATA")
    print("=" * 60)
    
    # Look for base64 patterns (at least 32 chars)
    base64_pattern = r'[A-Za-z0-9+/]{32,}={0,2}'
    base64_matches = re.findall(base64_pattern, all_text)
    
    # Look for hex patterns (at least 32 chars)
    hex_pattern = r'[0-9a-fA-F]{32,}'
    hex_matches = re.findall(hex_pattern, all_text)
    
    # Look for JSON
    json_objects = extract_json_from_text(all_text)
    
    print(f"\nFound {len(base64_matches)} potential base64 strings")
    print(f"Found {len(hex_matches)} potential hex strings")
    print(f"Found {len(json_objects)} JSON objects")
    
    # Try to decode base64 strings
    if base64_matches:
        print("\n" + "=" * 60)
        print("ATTEMPTING TO DECODE BASE64 DATA")
        print("=" * 60)
        for i, b64_str in enumerate(base64_matches[:5]):  # First 5
            decoded = decode_base64(b64_str)
            if decoded:
                print(f"\nBase64 String {i+1}:")
                print(f"Encoded: {b64_str[:50]}...")
                print(f"Decoded: {decoded[:200]}...")
    
    # Try to decode hex strings
    if hex_matches:
        print("\n" + "=" * 60)
        print("ATTEMPTING TO DECODE HEX DATA")
        print("=" * 60)
        for i, hex_str in enumerate(hex_matches[:5]):  # First 5
            decoded = decode_hex(hex_str)
            if decoded:
                print(f"\nHex String {i+1}:")
                print(f"Encoded: {hex_str[:50]}...")
                print(f"Decoded: {decoded[:200]}...")
    
except Exception as e:
    import traceback
    print(f'Error: {e}')
    traceback.print_exc()
