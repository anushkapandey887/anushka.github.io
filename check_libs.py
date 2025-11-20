import sys
import os

print(f"Python version: {sys.version}")

try:
    import fitz
    print("fitz (PyMuPDF) is available")
except ImportError:
    print("fitz is NOT available")

try:
    import PyPDF2
    print("PyPDF2 is available")
except ImportError:
    print("PyPDF2 is NOT available")

try:
    import pdf2image
    print("pdf2image is available")
except ImportError:
    print("pdf2image is NOT available")

try:
    from pdfminer.high_level import extract_text
    print("pdfminer is available")
except ImportError:
    print("pdfminer is NOT available")
