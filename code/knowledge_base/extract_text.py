import os
import json
import pandas as pd

# Define paths
DOCUMENTS_DIR = "test_data"  # Change this to your document directory
EXCEL_FILE = "final.xlsx"  # Change this to your Excel file path
OUTPUT_DIR = "meta_data2"  # Directory where metadata JSON files will be saved
SHEET_NAME = "Sheet6"  # Sheet name in Excel you got from llm

# Load metadata from the Excel sheet
df = pd.read_excel(EXCEL_FILE, sheet_name=SHEET_NAME, dtype=str)

# Ensure the output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Required columns mapping for metadata
required_columns = {
    "Company name": "Company_Name",
    "Document Name": "Document_Name",
    "Company ID (Ticker)": "Company_ID",
    "Document ID Type": "Document_Type",
    "Document Category ID": "Document_Category"
}

# Normalize column names (handling extra spaces or casing issues)
df.columns = df.columns.str.strip()

# Process each file in the directory
for file in os.listdir(DOCUMENTS_DIR):
    file_path = os.path.join(DOCUMENTS_DIR, file)

    if os.path.isfile(file_path):
        file_name_ = file.split('.')
        file_name_=file_name_[:len(file_name_)-1]
        file_name_.insert(1,'.')
        file_name_without_ext=''.join(file_name_)
        

        
              # Remove file extension
        print(file_name_without_ext)
        # Find metadata that matches the file name
        metadata = df[df["Document Name"] == file_name_without_ext].to_dict(orient="records")

        if metadata:
            metadata = metadata[0]  # Take the first matching row

            # Format metadata for Amazon Kendra
            kendra_metadata = {
                "DocumentId": file,  # Using filename as document ID
                "Attributes": {
                    required_columns[key]: value.strip()
                    for key, value in metadata.items() if key in required_columns and pd.notna(value)
                },
                "Title": file,  # Optional: Add a title if available
                "ContentType": "PDF"  # Adjust based on your document type
            }
            if file.split('.')[-1]=='txt':
                kendra_metadata['Attributes']['setsource']='-'
                kendra_metadata['Attributes']['ContentType']='PLAIN_TEXT'
            else:
                kendra_metadata["Attributes"]['setsource']='nil'
            
            # Save metadata to JSON
            metadata_filename = f"{file}.metadata.json"
            metadata_filepath = os.path.join(OUTPUT_DIR, metadata_filename)

            with open(metadata_filepath, "w", encoding="utf-8") as json_file:
                json.dump(kendra_metadata, json_file, indent=4)

            print(f"✅ Metadata created: {metadata_filepath}")

print("🎉 All metadata files have been successfully generated!")

