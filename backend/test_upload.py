import requests
import json

files = {'file': open('Dinesh_Resume.pdf', 'rb')}
data = {'student_id': 'STU020', 'name': 'Test User', 'email': 'new@test.com'}
r = requests.post('http://127.0.0.1:8000/resume/upload/', files=files, data=data, timeout=30)
print('Status:', r.status_code)
if r.status_code != 200:
    print('Error:', r.text)
else:
    d = r.json()
    print('Domain:', d['domain'])
    print('Skills:', d['required_skills'][:5])