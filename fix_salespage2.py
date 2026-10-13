with open('src/components/SalesPage/SalesPage.tsx', 'r') as f:
    content = f.read()

# Fix the problematic lines
content = content.replace(
    '<p className="text-sm">AI-powered 30-day content strategies for businesses that want to show up consistently.\n            </p>',
    '<p className="text-sm">AI-powered 30-day content strategies for businesses that want to show up consistently.</p>'
)

content = content.replace(
    '<p>&copy; 2024 Social Content Engine. All rights reserved.</p>\n        </p>',
    '<p>&copy; 2024 Social Content Engine. All rights reserved.</p>'
)

# Also check if there's an extra </p> after the copyright
content = content.replace(
    '<p>&copy; 2024 Social Content Engine. All rights reserved.</p>\n        </p>',
    '<p>&copy; 2024 Social Content Engine. All rights reserved.</p>'
)

with open('src/components/SalesPage/SalesPage.tsx', 'w') as f:
    f.write(content)
print('Fixed')