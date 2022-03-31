const e = require('express');
const express =require('express');
const dotenv =require('dotenv');
const querystring =require('querystring')
const axios = require('axios');
const { response } = require('express');
const { error } = require('console');
const stateKey = 'spotify_auth_state';
const path = require('path');




const app =express();

app.use(express.static(path.resolve(__dirname, './client/build')));
dotenv.config();

const SPOTIFY_C_ID =process.env.SPOTIFY_C_ID;
const SPOTIFY_C_SECRET =process.env.SPOTIFY_C_SECRET;
const REDIRECT_URI =process.env.REDIRECT_URI;
const FRONTEND_URI =process.env.FRONTEND_URI;
const PORT =process.env.PORT || 5000;


function generateRandomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
  



app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
  ].join(' ');

  const queryParams = querystring.stringify({
    client_id: SPOTIFY_C_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: scope,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get('/callback/',(req,res)=>{
    var code = req.query.code || null;

    axios({
        method:'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
          }),
          
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${SPOTIFY_C_ID}:${SPOTIFY_C_SECRET}`).toString('base64')}`,
          },
    }).then(response => {
        if (response.status === 200) {
    
          const { access_token, refresh_token,expires_in} = response.data;

          //redirect ti react app
          //pass query param
          const queryParams=querystring.stringify({
              access_token,
              refresh_token,
              expires_in

          })

          res.redirect(`${FRONTEND_URI}?${queryParams}`)
    
        //   axios.get('https://api.spotify.com/v1/me', {
        //     headers: {
        //       Authorization: `${token_type} ${access_token}`
        //     }
        //   })
        //     .then(response => {
        //       res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
        //     })
        //     .catch(error => {
        //       res.send(error);
        //     });
        }else {
            res.redirect(`/?${querystring.stringify({error:"invalid token"})}`);
          }
    }).catch(error=>{
        res.send(error)
    });
});


app.get('/refresh_token', (req, res) => {
  var refresh_token = req.query.refresh_token;
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${SPOTIFY_C_ID}:${SPOTIFY_C_SECRET}`).toString('base64')}`,
      },
    })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        res.send(error);
      });
  });
    
   
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });



app.listen(PORT,()=>console.log("server started"));



