import json
p='d:\\soal-jft\\public\\basu3-quiz\\quiz-data.json'
d=json.load(open(p,encoding='utf-8'))
d[0]['img']='https://docs.google.com/forms-images-rt/ANbbkigSKwKw5gbYyzh6ymTufhOSjDJ0jYFj9RKpu2tbv0v6GhLtJHp1qlpZNfK4A5GhBItotg71sU5N7HmIA1aUu0GLDEZpLC4OummeEVSYNbzzkVVmJ4pYhasmSnrx3nockWJIZzZwagNUnp5Wne7cvYrKDDn5ApeaNHYOqOWALYnrzI34Oh67FIPrWXQftr90EOVDmdroLfw=w740'
json.dump(d,open(p,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
print('done')
