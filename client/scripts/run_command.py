import sys
import subprocess
import os
import json

def main():
    if len(sys.argv) > 2:
        os_type = sys.argv[1]
        
        # Try to parse the command as JSON
        try:
            command = json.loads(sys.argv[2])
        except json.JSONDecodeError:
            # If not JSON, combine all remaining arguments
            command = " ".join(sys.argv[2:])
        
        print(f"Running on {os_type}: {command}")
        
        if os_type.lower() in ["linux", "ubuntu"]:
            # Create shell script with the full command
            temp_script = os.path.expanduser("~/docker_command.sh")
            with open(temp_script, 'w') as f:
                f.write("#!/bin/bash\n")
                f.write(f"echo 'Executing: {command}'\n")
                f.write(f"{command}\n")
                f.write("echo ''\n")
                f.write("echo 'Command executed. Press Enter to close...'\n")
                f.write("read\n")
            
            # Make executable
            os.chmod(temp_script, 0o755)
            
            # Launch terminal with the script
            try:
                subprocess.run(["gnome-terminal", "--", temp_script], check=False)
            except Exception:
                try:
                    # Try xterm as fallback
                    subprocess.run(["xterm", "-e", temp_script], check=False)
                except Exception:
                    print("Failed to launch terminal. Please ensure gnome-terminal or xterm is installed.")
            
        elif os_type.lower() == "macos":
            # For macOS - Use AppleScript
            safe_command = command.replace('"', '\\"').replace("'", "\\'")
            apple_script = f'''
            tell application "Terminal"
                activate
                do script "{safe_command}"
            end tell
            '''
            subprocess.run(['osascript', '-e', apple_script], check=False)
            
        else:
            # For Windows
            temp_dir = os.environ.get('TEMP', os.getcwd())
            temp_batch = os.path.join(temp_dir, 'docker_command.bat')
            
            with open(temp_batch, 'w', encoding='utf-8') as f:
                f.write('@echo off\n')
                f.write('echo Executing Docker command...\n')
                f.write(f'echo {command}\n')
                f.write(f'{command}\n')
                f.write('echo.\n')
                f.write('echo Command executed. Press any key to close...\n')
                f.write('pause > nul\n')
            
            subprocess.run(['cmd', '/c', 'start', 'cmd', '/k', temp_batch], check=False)
            
    else:
        print("❌ Not enough arguments provided.")
        print(f"Arguments received: {len(sys.argv)}")
        for i, arg in enumerate(sys.argv):
            print(f"Arg {i}: {arg}")

if __name__ == "__main__":
    main()