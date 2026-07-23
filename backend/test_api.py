import requests
import json

# Test upload with correct field name
files = {'resume': open('Dinesh_Resume.pdf', 'rb')}
data = {'student_id': 'STU099', 'name': 'Test User', 'email': 'test@test.com'}
r = requests.post('http://127.0.0.1:8000/resume/upload/', files=files, data=data, timeout=60)
print('Upload:', r.status_code)
if r.status_code == 200:
    d = r.json()
    print('Domain:', d.get('domain'))
    print('Skills:', d.get('required_skills', [])[:5])

# Test matches
r = requests.get('http://127.0.0.1:8000/matches/', timeout=60)
print('Matches:', r.status_code)
if r.status_code == 200:
    data = r.json()
    print('Type:', type(data))
    if isinstance(data, dict):
        for k, v in data.items():
            print('  {}: {} matches'.format(k, len(v.get('matches', []))))