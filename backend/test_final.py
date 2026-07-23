import requests
import json
import sys

print('=== Full Integration Test ===')

# Test 1: Backend health
try:
    r = requests.get('http://127.0.0.1:8000/health', timeout=15)
    print('Backend health:', r.status_code, r.json())
except Exception as e:
    print('Backend health error:', e)
    sys.exit(1)

# Test 2: Upload resume
files = {'resume': open('Dinesh_Resume.pdf', 'rb')}
data = {'student_id': 'STU020', 'name': 'Integration Test', 'email': 'test@test.com'}
r = requests.post('http://127.0.0.1:8000/resume/upload/', files=files, data=data, timeout=120)
print('Upload:', r.status_code)
if r.status_code == 200:
    d = r.json()
    print('Domain:', d.get('domain'))
    print('Skills:', d.get('required_skills', [])[:5])

# Test matches
r = requests.get('http://127.0.0.1:8000/matches/', timeout=120)
print('Matches:', r.status_code)
if r.status_code == 200:
    data = r.json()
    if isinstance(data, dict):
        for k, v in data.items():
            if isinstance(v, dict) and 'matches' in v:
                matches = v['matches']
                print(f'  {k}: {len(matches)} matches')
                if matches:
                    top = matches[0]
                    print('    Top: {} | {} | {:.3f}'.format(top['job_title'][:40], top['domain'], top['match_score']))

# Test jobs
r = requests.get('http://127.0.0.1:8000/jobs/', timeout=30)
print('Jobs:', r.status_code, len(r.json()), 'jobs')

print('\nFull integration working!')