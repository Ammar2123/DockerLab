import subprocess
import sys
import json

def run_command(cmd):
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return {'stdout': result.stdout, 'stderr': result.stderr, 'returncode': result.returncode}
    except Exception as e:
        return {'error': str(e)}

if __name__ == "__main__":
    data = sys.stdin.read()
    try:
        req = json.loads(data)
        cmd = req['command']
        output = run_command(cmd)
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({'error': str(e)}))