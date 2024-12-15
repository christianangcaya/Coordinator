from flask import Flask, jsonify
import os
from flask_cors import CORS
import re

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/api/folders', methods=['GET'])
def get_folders():
    base_path = "C:/LGU Daet Scholarship"
    
    try:
        # Get all folders (directories) in the base_path
        folder_names = [folder for folder in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, folder))]
        print(folder_names)
        return jsonify(folder_names)  # Return the list of folder names
    except FileNotFoundError:
        return jsonify({"error": "Folder not found"}), 404

@app.route('/api/folder/<folder_name>', methods=['GET'])
def get_folder_data(folder_name):
    folder_path = f"C:/LGU Daet Scholarship/{folder_name}"
    
    try:
        # List all files and folders in the selected folder
        folder_contents = os.listdir(folder_path)
        print(folder_contents)
        return jsonify(folder_contents)  # Return the list of files and folders as JSON
    except FileNotFoundError:
        return jsonify({"error": "Folder not found"}), 404

@app.route('/api/folder/<folder_name>/<subfolder_name>', methods=['GET'])
def get_subfolder_data(folder_name, subfolder_name):
    base_path = f"C:/LGU Daet Scholarship/{folder_name}/{subfolder_name}"
    
    try:
        if os.path.isdir(base_path):
            subfolder_contents = os.listdir(base_path)
            
            last_8_digits = []
            for item in subfolder_contents:
                match = re.search(r'(\d{8})$', item)
                if match:
                    last_8_digits.append(match.group(1))

            print(f"Contents of {subfolder_name} in {folder_name}: {last_8_digits}")
            return jsonify(last_8_digits)
        else:
            return jsonify({"error": f"Subfolder {subfolder_name} not found in {folder_name}"}), 404
    except FileNotFoundError:
        return jsonify({"error": "Folder or subfolder not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
