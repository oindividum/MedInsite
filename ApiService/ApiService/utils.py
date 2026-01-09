import uuid


def generate_name(file):
    file_id = str(uuid.uuid4())
    return f"{file_id}.{file.filename.split('.')[-1]}"

def generate_id():
    return str(uuid.uuid4())

