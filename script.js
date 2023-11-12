const accessory = /(\r\n|\n|[,;:!?\.])/;

function kalama(id){
    
    //scrap
    var tkpn = document.getElementById(id).value.split(" ");
    for(var i = 0; i < tkpn.length; i++){
        tkpn[i] = tkpn[i].split(accessory);
    }
    tkpn = tkpn.flat().filter(Boolean);

    //convert
    for(var i = 0; i < tkpn.length; i++){
        tkpn[i] = tkpn[i].toLowerCase().replace(
            /([kstnpmjlw])?([aiueo])(n(?![aiueo]))?/g,
            (_,c,v,n) => "" + !!c*" kstnpmjlw".indexOf(c) + ("aiueo".indexOf(v) + !!n*5)
        );
    }

    console.log(tkpn);

    //play sounds
    if(playing){
        return;
    }
    playing = true;
    ctx = new AudioContext();
    t = 0;
    for(var i = 0; i < tkpn.length; i++){
        for(var j = 0; j < tkpn[i].length; j++){
            tone(tkpn[i][j], 0.5/tkpn[i].length);
            sleep(t, ()=> { t = 0; playing = false; });
        }
    }
    setTimeout(()=>{playing = false}, t*1000);

}

var playing = false;

var t = 0; // do not change this value
function tone(tone, len) {

    var bass = document.getElementById("bass").value;
    var equal = document.getElementById("equal").value;
    
    osc = new OscillatorNode(ctx);

    osc.type = (document.getElementById("type") != null)? document.getElementById("type").value : "square";

    osc.frequency.value = accessory.test(tone)? 0 : bass*Math.pow(2, tone/equal);
    
    osc.connect(ctx.destination);
    
    osc.start(t);
    osc.stop(t += len);

}

var arr = [];

function zero(id){
    document.getElementById(id).value = "";
}

function reset(id){
    zero(id);
    for(var i in arr){
        document.getElementById(id).value += (i+":"+arr[i]+" ");
    }
}

function setting(id){
    var text = document.getElementById(id).value.split(/\r\n|\n|\ /).filter(Boolean);
    //[構文チェック]
    arr = [];
    for(var i in text){
        arr[text[i].split(":")[0]] = parseFloat(text[i].split(":")[1]);
    }
    console.log(arr);
}
