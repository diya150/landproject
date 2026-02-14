#!/usr/bin/env python3
"""
Extract and decode encoded data from PDF
Supports Base64, Hex, and other common encodings
"""

import json
import base64
import binascii
import re
from pathlib import Path

def try_decode_base64(text):
    """Try to decode base64 string"""
    try:
        decoded = base64.b64decode(text).decode('utf-8')
        return decoded
    except:
        return None

def try_decode_hex(text):
    """Try to decode hex string"""
    try:
        decoded = bytes.fromhex(text).decode('utf-8')
        return decoded
    except:
        return None

def extract_encoded_data(pdf_path):
    """Extract and decode data from PDF"""
    try:
        # Try using PyPDF2 first
        try:
            import PyPDF2
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text()
        except:
            # If PyPDF2 not available, try pdfplumber
            try:
                import pdfplumber
                with pdfplumber.open(pdf_path) as pdf:
                    text = "\n".join([page.extract_text() for page in pdf.pages])
            except:
                # Last resort - try reading binary content
                with open(pdf_path, 'rb') as file:
                    text = file.read().decode('utf-8', errors='ignore')
        
        print("Extracted text from PDF:")
        print("=" * 80)
        print(text[:1000])  # First 1000 chars
        print("=" * 80)
        
        # Look for encoded patterns
        encoded_patterns = [
            (r'[A-Za-z0-9+/]{40,}={0,2}', 'base64'),  # Base64
            (r'[0-9a-fA-F]{40,}', 'hex'),  # Hex
        ]
        
        for pattern, encoding_type in encoded_patterns:
            matches = re.findall(pattern, text)
            if matches:
                print(f"\nFound potential {encoding_type} encoded data:")
                for match in matches[:3]:  # Show first 3 matches
                    print(f"  {match[:100]}...")
                    
                    if encoding_type == 'base64':
                        decoded = try_decode_base64(match)
                    else:
                        decoded = try_decode_hex(match)
                    
                    if decoded:
                        print(f"  ✓ Successfully decoded:\n  {decoded[:200]}")
                        return decoded
        
        return text
        
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return None

if __name__ == "__main__":
    pdf_path = r"c:\Users\sumit\Downloads\data_land.pdf"
    decoded_data = extract_encoded_data(pdf_path)
    
    if decoded_data:
        print("\n" + "=" * 80)
        print("DECODED DATA:")
        print("=" * 80)
        print(decoded_data)
