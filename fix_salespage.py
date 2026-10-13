import re

with open('src/components/SalesPage/SalesPage.tsx', 'r') as f:
    content = f.read()

# Fix the problematic lines
content = re.sub(
    r'<p className="text-sm">AI-powered 30-day content strategies for businesses that want to show up consistently\.\s*</p>',
    '<p className="text-sm">AI-powered 30-day content strategies for businesses that want to show up consistently.</p>',
    content,
    flags=re.DOTALL
)

content = content.replace(
    '<p>&copy; 2024 Social Content Engine. All rights reserved.\n        </p>',
    '<p>&copy; 2024 Social Content Engine. All rights reserved.</p>'
)

with open('src/components/SalesPage/SalesPage.tsx', 'w') as f:
    f.write(content)
print('Fixed')