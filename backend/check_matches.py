import requests
import json

r = requests.get('http://127.0.0.1:8000/matches/', timeout=30)
print(r.status_code)
d = r.json()
print('Keys:', d.keys())
if 'matches' in d:
    print('Matches:', len(d['matches']))
    for m in d['matches'][:3]:
        print('  {} | {} | {:.3f}'.format(m['job_title'][:40], m['domain'], m['match_score']))