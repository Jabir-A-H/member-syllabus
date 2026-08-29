import json
import os
import re

book_jsons_dir = 'book_jsons'
for filename in os.listdir(book_jsons_dir):
    if filename.endswith('.json'):
        filepath = os.path.join(book_jsons_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            desc = data.get('book_description')
            if desc and isinstance(desc, str):
                if 'publish' in desc and 'closed' in desc:
                    print(f'Found in: {filename}')
                    # Find index of ('195' or similar insert pattern
                    match = re.search(r'\(.*publish.*closed', desc)
                    if match:
                        data['book_description'] = desc[:match.start()].strip()
                    else:
                        data['book_description'] = desc.split('(')[0].strip()
                        
                    with open(filepath, 'w', encoding='utf-8') as fw:
                        json.dump(data, fw, ensure_ascii=False, indent=4)
                    print('Cleaned!')
                    break
