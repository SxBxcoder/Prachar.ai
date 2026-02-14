# Find unmatched triple quotes
with open('agent.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_string = False
quote_count = 0
for i, line in enumerate(lines, 1):
    count = line.count('"""')
    if count > 0:
        quote_count += count
        print(f"Line {i}: {count} triple quotes (total: {quote_count}) - {line.strip()[:60]}")
        
print(f"\nTotal triple quotes: {quote_count}")
if quote_count % 2 != 0:
    print("❌ UNMATCHED! There's an odd number of triple quotes.")
else:
    print("✅ All triple quotes are matched.")
