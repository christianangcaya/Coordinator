from flask import Flask, jsonify, request
import os
from flask_cors import CORS
import re
import mysql.connector

app = Flask(__name__)

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "scholarship_db"
}

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
            
            # Extract last 8 digits from subfolder contents
            last_8_digits = []
            for item in subfolder_contents:
                match = re.search(r'(\d{8})$', item)
                if match:
                    last_8_digits.append(match.group(1))
            
            # Connect to MySQL database
            connection = mysql.connector.connect(**db_config)
            cursor = connection.cursor(dictionary=True)

            # Query the af_basic_info table
            query_basic_info = """
                SELECT 
                    applicant_id, 
                    last_name, 
                    first_name, 
                    middle_name, 
                    suffix, 
                    street, 
                    purok, 
                    barangay, 
                    municipality,
                    contact_number
                FROM af_basic_info 
                WHERE applicant_id IN (%s)
            """
            placeholders = ", ".join(["%s"] * len(last_8_digits))
            formatted_query_basic_info = query_basic_info % placeholders
            
            cursor.execute(formatted_query_basic_info, last_8_digits)
            basic_info_results = cursor.fetchall()

            # Query the af_educ_info table
            query_educ_info = """
                SELECT 
                    applicant_id, 
                    school_name 
                FROM af_educ_info 
                WHERE applicant_id IN (%s)
            """
            formatted_query_educ_info = query_educ_info % placeholders
            
            cursor.execute(formatted_query_educ_info, last_8_digits)
            educ_info_results = cursor.fetchall()

            # Query the af_file_initial table
            query_file_initial = """
                SELECT 
                    applicant_id, 
                    photo_path 
                FROM af_file_initial 
                WHERE applicant_id IN (%s)
            """

            formatted_query_file_initial = query_file_initial % placeholders

            cursor.execute(formatted_query_file_initial, last_8_digits)
            file_initial_results = cursor.fetchall()

            # Close the database connection
            cursor.close()
            connection.close()

            # Merge results from both tables
            educ_info_dict = {row['applicant_id']: row['school_name'] for row in educ_info_results}
            for applicant in basic_info_results:
                applicant['school_name'] = educ_info_dict.get(applicant['applicant_id'], None)

            print(f"Contents of {subfolder_name} in {folder_name}: {basic_info_results}")
            return jsonify(basic_info_results)
        else:
            return jsonify({"error": f"Subfolder {subfolder_name} not found in {folder_name}"}), 404
    except FileNotFoundError:
        return jsonify({"error": "Folder or subfolder not found"}), 404
    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return jsonify({"error": "Database error"}), 500

@app.route('/api/<application_id>/scholar_files', methods=['GET'])
def list_files(application_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    try:
        # Parameterized query to prevent SQL injection
        query = "SELECT final_req_folder_path FROM final_requirements WHERE application_id = %s"
        cursor.execute(query, (application_id,))
        result = cursor.fetchone()
    finally:
        cursor.close()
        connection.close()
    
    if not result:
        return jsonify({"error": "Invalid application ID or no files found"}), 404

    base_path = result['final_req_folder_path']
    if not os.path.exists(base_path):
        return jsonify({"error": f"Directory {base_path} does not exist"}), 404

    try:
        files = os.listdir(base_path)
        app.logger.info(f"Files found: {files}")
        return jsonify({"path": base_path, "files": files}), 200
    except Exception as e:
        app.logger.error(f"Error listing files: {str(e)}")
        return jsonify({"error": f"Unable to list files: {str(e)}"}), 500
    
@app.route("/api/applicants", methods=["GET"])
def get_applicants_with_info():
    try:
        # Establish the database connection
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        
        # Query to fetch applicants with their corresponding info from af_basic_info
        query = """
        SELECT 
            a.application_id, 
            a.status,
            COALESCE(a.remarks, 'N/A') AS remarks,
            b.last_name, 
            b.first_name, 
            b.middle_name, 
            b.contact_number,
            b.suffix, 
            b.street, 
            b.purok, 
            b.barangay, 
            b.municipality,
            c.school_name
        FROM 
            applicants a
        JOIN 
            af_basic_info b
        ON 
            a.application_id = b.applicant_id
        JOIN 
            af_educ_info c
        ON 
            a.application_id = c.applicant_id
        WHERE 
            a.status = 'applicant';
        """
        
        cursor.execute(query)
        
        # Fetch all rows
        applicants_with_info = cursor.fetchall()
        print(applicants_with_info)
        # Return the result as JSON
        if not applicants_with_info:
            return jsonify({"error": "No applicants found"}), 404
        
        return jsonify(applicants_with_info), 200

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": "Database error"}), 500

    finally:
        # Ensure cursor and connection are closed
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route('/api/applicants/<applicant_id>', methods=['PUT'])
def update_applicant_status(applicant_id):
    try:
        new_status = request.json.get("status")
        
        if new_status != "pending_scholar":
            return jsonify({"error": "Invalid status. Must be 'pending_scholar'."}), 400
        
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        
        update_query = """
            UPDATE applicants
            SET status = %s
            WHERE application_id = %s
        """
        cursor.execute(update_query, (new_status, applicant_id))
        connection.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Applicant not found."}), 404
        
        return jsonify({"success": True, "message": f"Applicant {applicant_id} status updated to pending_scholar."})
    
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": "Error updating applicant status"}), 500
    
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route('/api/applicants/count', methods=['GET'])
def get_applicants_count():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM applicants WHERE status = 'applicant'")
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        return jsonify({"applicant_count": result[0]})

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500


@app.route("/api/pending_scholars", methods=["GET"])
def get_pending_scholars_with_info():
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        
        query = """
        SELECT 
            a.application_id, 
            a.status,
            COALESCE(a.remarks, 'N/A') AS remarks,
            b.last_name, 
            b.first_name, 
            b.middle_name, 
            b.contact_number,
            b.suffix, 
            b.street, 
            b.purok, 
            b.barangay, 
            b.municipality,
            c.school_name
        FROM 
            applicants a
        JOIN 
            af_basic_info b
        ON 
            a.application_id = b.applicant_id
        JOIN 
            af_educ_info c
        ON 
            a.application_id = c.applicant_id
        WHERE 
            a.status = 'pending_scholar';
        """
        
        cursor.execute(query)
        
        applicants_with_info = cursor.fetchall()
        print(applicants_with_info)
        if not applicants_with_info:
            return jsonify({"error": "No applicants found"}), 404
        
        return jsonify(applicants_with_info), 200

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": "Database error"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route('/api/pending_scholars/<applicant_id>', methods=['PUT'])
def update_pending_scholars_status(applicant_id):
    try:
        new_status = request.json.get("status")
        
        if new_status != "scholar":
            return jsonify({"error": "Invalid status. Must be 'scholar'."}), 400
        
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        
        update_query = """
            UPDATE applicants
            SET status = %s
            WHERE application_id = %s
        """
        cursor.execute(update_query, (new_status, applicant_id))
        connection.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Applicant not found."}), 404
        
        return jsonify({"success": True, "message": f"Applicant {applicant_id} status updated to scholar."})
    
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": "Error updating applicant status"}), 500
    
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route('/api/pending_scholars/count', methods=['GET'])
def get_pending_scholars_count():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM applicants WHERE status = 'pending_scholar'")
        result = cursor.fetchone()
        print(result)

        cursor.close()
        conn.close()

        return jsonify({"pending_scholar_count": result[0]})

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

if __name__ == "__main__":
    app.run(debug=True)
