var request = require('superagent');
var key = process.env.mailgun_key;

module.exports = function(from, to, subject, html){
  if(!key) return console.log('mailgun key not defined');
  var email = {
    from,
    to,
    subject,
    html,
  };
  return new Promise((res, rej) => {
    request
      .post(`https://api:${key}@api.mailgun.net/v3/ycmjason.com/messages`)
      .type('form')
      .send(email)
      .end(function(err, result){
        if(err) return rej(err);
        res(result);
      });
  });
};
