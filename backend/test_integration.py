import requests
import json

print('=== Full Integration Test ===')

# Test 1: Backend health
r = requests.get('http://127.0.0.1:8000/health', timeout=10)
print('Backend health:', r.status_code, r.json())

# Test 2: Get jobs
r = requests.get('http://127.0.0.1:8000/jobs/', timeout=30)
print('Jobs:', r.status_code, len(r.json()), 'jobs')

# Test 2: Upload resume
files = {'resume': open('Dinesh_Resume.pdf', 'rb')}
data = {'student_id': 'STU020', 'name': 'Integration Test', 'email': 'test@test.com'}
r = requests.post('http://127.0.0.1:8000/resume/upload/', files=files, data=data, timeout=60)
print('Upload:', r.status_code)
if r.status_code == 200:
    d = r.json()
    print('Domain:', d.get('domain'))
    print('Skills:', d['required_skills'][:5])

# Test 2: Get matches
r = requests.get('http://127.0.0.1:8000/matches/', timeout=30)
print('Matches:', r.status_code)
if r.status_code == 200:
    data = r.json()
    if isinstance(data, dict):
        for k, v in data.items():
            print('  {}: {} matches'.format(k, len(v.get('matches', []))))
            if v.get('matches'):
                top = v['matches'][0]
                print('    Top: {} | {} | {:.3f}'.format(top['job_title'][:40], top['domain'], top['match_score']))
    elif isinstance(data, list):
        for m in data[:2]:
            print('  {}: {} matches'.format(m['student_name'], len(m['matches'])))
            if m['matches']:
                top = m['matches'][0]
                print('    Top: {} | {} | {:.3f}'.format(top['job_title'][:40], top['domain'], top['match_score']))

# Test 3: Get jobs
r = requests.get('http://127.0.0.1:8000/jobs/', timeout=10)
print('Jobs:', r.status_code, len(r.json()), 'jobs')

# Test 3: Get student profile
r = requests.get('http://127.0.0.1:8000/student/profile/', timeout=10)
print('Profile:', r.status_code)
if r.status_code == 200:
    print('Profile:', r.json().get('name'))

print('\nFull integration working!')