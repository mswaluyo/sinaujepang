with open('d:/soal-jft/public/admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_gate = '<div id="gate" class="bg-white rounded-2xl border p-8 text-center max-w-md mx-auto">'
new_gate = '<div id="gate" class="hidden">'

if old_gate in content:
    content = content.replace(old_gate, new_gate)
    print('Gate div removed successfully')
else:
    print('Gate div not found')

with open('d:/soal-jft/public/admin.html', 'w', encoding='utf-8') as f:
    f.write(content)