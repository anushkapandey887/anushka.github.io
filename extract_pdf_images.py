#!/usr/bin/env python3
import PyPDF2
from PIL import Image
import io
import os

def extract_images_from_pdf(pdf_path, output_folder='portfolio_images'):
    # Create output folder if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)
    
    # Open the PDF
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        
        print(f"PDF has {len(pdf_reader.pages)} pages")
        
        # Also extract text content
        text_content = []
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text = page.extract_text()
            text_content.append(f"--- Page {page_num + 1} ---\n{text}\n")
        
        # Save text content
        with open(os.path.join(output_folder, 'content.txt'), 'w', encoding='utf-8') as f:
            f.write('\n'.join(text_content))
        
        print(f"Text content extracted to {output_folder}/content.txt")
        
        # Try to extract images
        image_count = 0
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            
            if '/XObject' in page['/Resources']:
                xObject = page['/Resources']['/XObject'].get_object()
                
                for obj in xObject:
                    if xObject[obj]['/Subtype'] == '/Image':
                        try:
                            size = (xObject[obj]['/Width'], xObject[obj]['/Height'])
                            data = xObject[obj].get_data()
                            
                            if xObject[obj]['/ColorSpace'] == '/DeviceRGB':
                                mode = "RGB"
                            else:
                                mode = "P"
                            
                            image_filename = f"{output_folder}/image_page{page_num + 1}_{image_count}.png"
                            
                            if '/Filter' in xObject[obj]:
                                filter_type = xObject[obj]['/Filter']
                                if filter_type == '/DCTDecode':
                                    # JPEG image
                                    image_filename = f"{output_folder}/image_page{page_num + 1}_{image_count}.jpg"
                                    with open(image_filename, 'wb') as img_file:
                                        img_file.write(data)
                                elif filter_type == '/FlateDecode':
                                    # PNG-like image
                                    img = Image.frombytes(mode, size, data)
                                    img.save(image_filename)
                                else:
                                    # Try to save as is
                                    img = Image.frombytes(mode, size, data)
                                    img.save(image_filename)
                            else:
                                img = Image.frombytes(mode, size, data)
                                img.save(image_filename)
                            
                            print(f"Extracted: {image_filename}")
                            image_count += 1
                        except Exception as e:
                            print(f"Error extracting image from page {page_num + 1}: {str(e)}")
        
        print(f"\nTotal images extracted: {image_count}")

if __name__ == '__main__':
    pdf_path = '/Users/anushka/Downloads/test_gemini/PORTFOLIO.PDF'
    extract_images_from_pdf(pdf_path)
