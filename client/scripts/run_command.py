#!/usr/bin/env python3
import sys
import subprocess
import os

def main():
    if len(sys.argv) < 3:
        print("❌ Not enough arguments provided.")
        print(f"Usage: {sys.argv[0]} <os_type> <command>")
        return

    os_type = sys.argv[1].lower()
    
    # Get the command - it should be a single argument
    command = sys.argv[2]
    
    print(f"🚀 Running on {os_type}: {command}")
    print("=" * 50)
    
    if os_type in ["linux", "ubuntu"]:
        # Direct terminal launch without shell scripts
        bash_command = f"echo '🐳 Docker Labs - Command Executor' && echo '==================================' && echo 'Executing: {command}' && echo '' && {command} && echo '' && echo '✅ Command completed! Press Enter to close...' && read"
        
        # Try different terminal emulators with direct bash execution
        terminals = [
            ["gnome-terminal", "--", "bash", "-c", bash_command],
            ["xfce4-terminal", "-e", f"bash -c \"{bash_command}\""],
            ["konsole", "-e", "bash", "-c", bash_command],
            ["xterm", "-e", "bash", "-c", bash_command],
            ["x-terminal-emulator", "-e", f"bash -c \"{bash_command}\""]
        ]
        
        success = False
        for terminal_cmd in terminals:
            try:
                subprocess.Popen(terminal_cmd, 
                               stdout=subprocess.DEVNULL, 
                               stderr=subprocess.DEVNULL)
                success = True
                print(f"✅ Successfully launched terminal with: {terminal_cmd[0]}")
                break
            except (subprocess.CalledProcessError, FileNotFoundError) as e:
                print(f"❌ Failed to launch {terminal_cmd[0]}: {e}")
                continue
        
        if not success:
            print("❌ Failed to launch any terminal emulator.")
            print("Please ensure one of the following is installed: gnome-terminal, xfce4-terminal, konsole, xterm")
            
    elif os_type == "macos":
        # For macOS - Direct terminal launch with AppleScript
        bash_command = f"echo '🐳 Docker Labs - Command Executor' && echo '==================================' && echo 'Executing: {command}' && echo '' && {command} && echo '' && echo '✅ Command completed! Press Enter to close...' && read"
        safe_command = bash_command.replace('\\', '\\\\').replace('"', '\\"').replace("'", "\\'")
        
        apple_script = f'''
        tell application "Terminal"
            activate
            do script "{safe_command}"
        end tell
        '''
        try:
            subprocess.run(['osascript', '-e', apple_script], check=True)
            print("✅ Successfully launched Terminal on macOS")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to execute command on macOS: {e}")
            
    elif os_type == "windows":
        # For Windows - Direct command prompt launch
        cmd_command = f'echo 🐳 Docker Labs - Command Executor && echo ================================== && echo Executing: {command} && echo. && {command} && echo. && echo ✅ Command completed! Press any key to close... && pause > nul'
        
        try:
            subprocess.Popen(['cmd', '/c', 'start', 'cmd', '/k', cmd_command],
                           stdout=subprocess.DEVNULL, 
                           stderr=subprocess.DEVNULL)
            print("✅ Successfully launched Command Prompt on Windows")
        except Exception as e:
            print(f"❌ Failed to execute command on Windows: {e}")
    else:
        print(f"❌ Unsupported OS type: {os_type}")

if __name__ == "__main__":
    main()