# Script to clean tabs and fix indentation
with open('agent.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace tabs with 4 spaces
content = content.expandtabs(4)

# Write cleaned content
with open('agent.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("File cleaned successfully!")
