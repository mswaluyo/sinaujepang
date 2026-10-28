import json
p='d:\\soal-jft\\public\\basu3-quiz\\quiz-data.json'
d=json.load(open(p,encoding='utf-8'))
d[0]['img']='https://docs.google.com/forms-images-rt/ANbbkijemD84Xstfu6AxAGj_L1n-1KqpXw8KgmBuM_ByjOdXqsEAZ3FJm2TO0xUyUTnS6Ui6Byj1JU3wAlYBEEzIx8kTAOWX6fwlTGJZDW-xx7o_pSzp_ivjWBFzWymiGwnQvNu6FeT94fn9AY2kWoUpWA7J8XYNXlWO8CeSxVVcNcKhuV81zEcttp2wyg6EOLWrlhLD_lt6ph_keHgMllsYwaPJHeT_8Pgxmg7xo_rUU=w740'
json.dump(d,open(p,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
print('done')
