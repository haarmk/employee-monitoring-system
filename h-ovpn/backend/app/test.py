import emails
from emails.template import JinjaTemplate as T
message = emails.html(subject=T('Payment Receipt No.{{ billno }}'),
                      html=T('<p>Dear {{ name }}! This is a receipt...'),
                      mail_from=('ABC', 'vpn@haarmk.com'))

r = message.send(to=('John Brown', 'ankit@haarmk.com'),
            render={'name': 'John Brown', 'billno': '141051906163'},
            smtp={'host':'mail.haarmk.com', 'port': 465, 'ssl': True, 'user': 'vpn@haarmk.com', 'password': 'Neet@7045'})
print(r)
