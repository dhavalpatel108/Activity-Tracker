import re, json

files = {
    'morning': 'reference_designs/morning.html',
    'evening-light': 'reference_designs/evening-light.html',
    'night': 'reference_designs/evening.html'
}

themes_css = ''
colors_map = {}

for theme_name, file_path in files.items():
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        match = re.search(r'tailwind\.config\s*=\s*(\{.*?\})\s*</script>', content, re.DOTALL)
        if match:
            config_str = match.group(1)
            colors_match = re.search(r'"colors":\s*(\{.*?\})', config_str, re.DOTALL)
            if colors_match:
                colors_json_str = colors_match.group(1)
                # Ensure the JSON string is valid (sometimes keys might lack quotes, though in this HTML they seem quoted)
                # It is valid JSON as seen from the file snippet.
                colors_json = json.loads(colors_json_str)
                if not colors_map:
                    colors_map = {k: k for k in colors_json.keys()}
                themes_css += f'.theme-{theme_name} {{\n'
                for k, v in colors_json.items():
                    themes_css += f'  --color-{k}: {v};\n'
                themes_css += '}\n\n'
    except Exception as e:
        print(f"Error parsing {file_path}: {e}")

print("Extracted CSS:")
print(themes_css)

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write('@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@layer base {\n')
    f.write('  :root {\n')
    for k in colors_map.keys():
        f.write(f'    --color-{k}: #ffffff;\n') # default placeholder
    f.write('  }\n')
    f.write(themes_css)
    f.write('}\n')

print("Wrote to src/index.css")

# Also generate tailwind config
tailwind_colors = '{\n'
for k in colors_map.keys():
    tailwind_colors += f'        "{k}": "var(--color-{k})",\n'
tailwind_colors += '      }'

tailwind_config = f"""/** @type {{import('tailwindcss').Config}} */
export default {{
  content: [
    "./index.html",
    "./src/**/*.{{js,ts,jsx,tsx}}",
  ],
  theme: {{
    extend: {{
      colors: {tailwind_colors},
      fontFamily: {{
        'headline-xl': ['Lexend', 'sans-serif'],
        'body-md': ['Lexend', 'sans-serif'],
        'label-sm': ['Lexend', 'sans-serif'],
        'headline-md': ['Lexend', 'sans-serif'],
        'body-lg': ['Lexend', 'sans-serif'],
        'headline-lg': ['Lexend', 'sans-serif'],
        'label-md': ['Lexend', 'sans-serif'],
        lexend: ['Lexend', 'sans-serif']
      }}
    }},
  }},
  plugins: [],
}}
"""

with open('tailwind.config.js', 'w', encoding='utf-8') as f:
    f.write(tailwind_config)

print("Wrote tailwind.config.js")
