function GetWords(book){
  var without_newline = book.toLowerCase().split('\n').join(' '),
      only_letters = without_newline.replace(/[^a-z\s]/g, ''),
      no_contractions = only_letters.replace(/([a-z]+)\'(?:[a-z]+)[^a-z]/g, '$1'),
      remove_duplicate_spaces = no_contractions.replace(/\s+/g, ' ');
      total_words = remove_duplicate_spaces.split(' ');
  
  total_words = total_words.filter(function(value){
    return value.length != 0;
  });
  
  return total_words;
}

function FormHistogram(words){
  var hist = {}, undefined;
  
  for(var i=0,word; word=words[i++];){
    if(hist[word] != undefined) hist[word]++;
    else hist[word] = 1;
  }
  
  return hist;
}

function GetStatistics(hist){
  var mean = 0, variance = 0, values = 0;
  
  for(var key in hist){
    var value = hist[key];
    mean += value;
    values++;
  }
  mean /= values;
  
  for(var key in hist){
    var value = hist[key];
    variance += Math.pow(value - mean, 2);
  }
  variance /= (values-1);
  
  return {
    mean: mean,
    std: Math.sqrt(variance)
  }
}

function NormSInv(p) {
    var a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969;
    var a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;
    var b1 = -54.4760987982241, b2 = 161.585836858041, b3 = -155.698979859887;
    var b4 = 66.8013118877197, b5 = -13.2806815528857, c1 = -7.78489400243029E-03;
    var c2 = -0.322396458041136, c3 = -2.40075827716184, c4 = -2.54973253934373;
    var c5 = 4.37466414146497, c6 = 2.93816398269878, d1 = 7.78469570904146E-03;
    var d2 = 0.32246712907004, d3 = 2.445134137143, d4 = 3.75440866190742;
    var p_low = 0.02425, p_high = 1 - p_low;
    var q, r;
    var retVal;

    if ((p < 0) || (p > 1))
    {
        alert("NormSInv: Argument out of range.");
        retVal = 0;
    }
    else if (p < p_low)
    {
        q = Math.sqrt(-2 * Math.log(p));
        retVal = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
    else if (p <= p_high)
    {
        q = p - 0.5;
        r = q * q;
        retVal = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    }
    else
    {
        q = Math.sqrt(-2 * Math.log(1 - p));
        retVal = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }

    return retVal;
}

function KeepTop(hist, percent){
  var stats = GetStatistics(hist),
      zmin = NormSInv(1-percent),
      words = [];
  
  for(var key in hist){
    var value = hist[key],
        z = (value - stats.mean) / stats.std;
    
    if(z > zmin) words.push(key);
  }
  
  return words;
}

function Analyze(urls, percent, callback){
  var words = [], urls_recieved = 0;
  
  for(var i=0,url; url=urls[i++];){
    (function(url){
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
          console.log('Recieved URL '+(urls_recieved+1)+' of '+urls.length);
          words = words.concat(GetWords(xmlhttp.responseText));
          if(++urls_recieved == urls.length) Calc();
        }
      }
      xmlhttp.open("GET",url,true);
      xmlhttp.send();
    })(url);
  }
  
  function Calc(){
    console.log('Calculating');
    
    var histogram = FormHistogram(words),
        top_words = KeepTop(histogram, percent);

    callback(top_words);
  }
}

Analyze([
  "http://www.gutenberg.org/cache/epub/1342/pg1342.txt",
  "http://www.gutenberg.org/cache/epub/1661/pg1661.txt",
  "http://www.gutenberg.org/cache/epub/4300/pg4300.txt",
  "http://www.gutenberg.org/cache/epub/11/pg11.txt",
  "http://www.gutenberg.org/cache/epub/27827/pg27827.txt",
  "http://www.gutenberg.org/cache/epub/76/pg76.txt",
  "http://www.gutenberg.org/cache/epub/74/pg74.txt",
  "http://www.gutenberg.org/cache/epub/174/pg174.txt",
  "http://www.gutenberg.org/cache/epub/2701/pg2701.txt",
  "http://www.gutenberg.org/cache/epub/5200/pg5200.txt",
  "http://www.gutenberg.org/cache/epub/345/pg345.txt",
  "http://www.gutenberg.org/cache/epub/1232/pg1232.txt",
  "http://www.gutenberg.org/cache/epub/30254/pg30254.txt",
  "http://www.gutenberg.org/cache/epub/98/pg98.txt",
  "http://www.gutenberg.org/cache/epub/2591/pg2591.txt",
  "http://www.gutenberg.org/cache/epub/84/pg84.txt",
  "http://www.gutenberg.org/cache/epub/135/pg135.txt",
  "http://www.gutenberg.org/cache/epub/1184/pg1184.txt",
  "http://www.gutenberg.org/cache/epub/48423/pg48423.txt",
  "http://www.gutenberg.org/cache/epub/844/pg844.txt",
  "http://www.gutenberg.org/cache/epub/48420/pg48420.txt",
  "http://www.gutenberg.org/cache/epub/2814/pg2814.txt",
  "http://www.gutenberg.org/cache/epub/1400/pg1400.txt",
  "http://www.gutenberg.org/cache/epub/768/pg768.txt",
  "http://www.gutenberg.org/cache/epub/16/pg16.txt",
  "http://www.gutenberg.org/cache/epub/158/pg158.txt",
  "http://www.gutenberg.org/cache/epub/1260/pg1260.txt",
  "http://www.gutenberg.org/cache/epub/1952/pg1952.txt",
  "http://www.gutenberg.org/cache/epub/526/pg526.txt",
  "http://www.gutenberg.org/cache/epub/42/pg42.txt",
  "http://www.gutenberg.org/cache/epub/2600/pg2600.txt",
  "http://www.gutenberg.org/cache/epub/48426/pg48426.txt",
  "http://www.gutenberg.org/cache/epub/48422/pg48422.txt",
  "http://www.gutenberg.org/cache/epub/1399/pg1399.txt",
  "http://www.gutenberg.org/cache/epub/829/pg829.txt",
  "http://www.gutenberg.org/cache/epub/30360/pg30360.txt",
  "http://www.gutenberg.org/cache/epub/55/pg55.txt",
  "http://www.gutenberg.org/cache/epub/205/pg205.txt",
  "http://www.gutenberg.org/cache/epub/2554/pg2554.txt",
  "http://www.gutenberg.org/cache/epub/20203/pg20203.txt",
  "http://www.gutenberg.org/cache/epub/4363/pg4363.txt",
  "http://www.gutenberg.org/cache/epub/863/pg863.txt",
  "http://www.gutenberg.org/cache/epub/2147/pg2147.txt",
  "http://www.gutenberg.org/cache/epub/5740/pg5740.txt",
  "http://www.gutenberg.org/cache/epub/1322/pg1322.txt",
  "http://www.gutenberg.org/cache/epub/120/pg120.txt",
  "http://www.gutenberg.org/cache/epub/2500/pg2500.txt",
  "http://www.gutenberg.org/cache/epub/30601/pg30601.txt",
  "http://www.gutenberg.org/cache/epub/35/pg35.txt",
  "http://www.gutenberg.org/cache/epub/161/pg161.txt",
  "http://www.gutenberg.org/cache/epub/236/pg236.txt",
  "http://www.gutenberg.org/cache/epub/62/pg62.txt",
  "http://www.gutenberg.org/cache/epub/105/pg105.txt",
  "http://www.gutenberg.org/cache/epub/244/pg244.txt",
  "http://www.gutenberg.org/cache/epub/1155/pg1155.txt",
  "http://www.gutenberg.org/cache/epub/48414/pg48414.txt",
  "http://www.gutenberg.org/cache/epub/48428/pg48428.txt",
  "http://www.gutenberg.org/cache/epub/20/pg20.txt",
  "http://www.gutenberg.org/cache/epub/5000/pg5000.txt",
  "http://www.gutenberg.org/cache/epub/48409/pg48409.txt",
  "http://www.gutenberg.org/cache/epub/996/pg996.txt",
  "http://www.gutenberg.org/cache/epub/100/pg100.txt",
  "http://www.gutenberg.org/cache/epub/23/pg23.txt",
  "http://www.gutenberg.org/cache/epub/16328/pg16328.txt",
  "http://www.gutenberg.org/cache/epub/2148/pg2148.txt",
  "http://www.gutenberg.org/cache/epub/8800/pg8800.txt",
  "http://www.gutenberg.org/cache/epub/730/pg730.txt",
  "http://www.gutenberg.org/cache/epub/33/pg33.txt",
  "http://www.gutenberg.org/cache/epub/1497/pg1497.txt",
  "http://www.gutenberg.org/cache/epub/583/pg583.txt",
  "http://www.gutenberg.org/cache/epub/28520/pg28520.txt",
  "http://www.gutenberg.org/cache/epub/1080/pg1080.txt",
  "http://www.gutenberg.org/cache/epub/147/pg147.txt",
  "http://www.gutenberg.org/cache/epub/14591/pg14591.txt",
  "http://www.gutenberg.org/cache/epub/48418/pg48418.txt",
  "http://www.gutenberg.org/cache/epub/10/pg10.txt",
  "http://www.gutenberg.org/cache/epub/103/pg103.txt",
  "http://www.gutenberg.org/cache/epub/45631/pg45631.txt",
  "http://www.gutenberg.org/cache/epub/2542/pg2542.txt",
  "http://www.gutenberg.org/cache/epub/28054/pg28054.txt",
  "http://www.gutenberg.org/cache/epub/2852/pg2852.txt",
  "http://www.gutenberg.org/cache/epub/48413/pg48413.txt",
  "http://www.gutenberg.org/cache/epub/215/pg215.txt",
  "http://www.gutenberg.org/cache/epub/521/pg521.txt",
  "http://www.gutenberg.org/cache/epub/1567/pg1567.txt",
  "http://www.gutenberg.org/cache/epub/48417/pg48417.txt",
  "http://www.gutenberg.org/cache/epub/7849/pg7849.txt",
  "http://www.gutenberg.org/cache/epub/2680/pg2680.txt",
  "http://www.gutenberg.org/cache/epub/33283/pg33283.txt",
  "http://www.gutenberg.org/cache/epub/766/pg766.txt",
  "http://www.gutenberg.org/cache/epub/6130/pg6130.txt",
  "http://www.gutenberg.org/cache/epub/1257/pg1257.txt",
  "http://www.gutenberg.org/cache/epub/3300/pg3300.txt",
  "http://www.gutenberg.org/cache/epub/48407/pg48407.txt",
  "http://www.gutenberg.org/cache/epub/3207/pg3207.txt",
  "http://www.gutenberg.org/cache/epub/1998/pg1998.txt",
  "http://www.gutenberg.org/cache/epub/1727/pg1727.txt",
  "http://www.gutenberg.org/cache/epub/41/pg41.txt",
  "http://www.gutenberg.org/cache/epub/31547/pg31547.txt",
  "http://www.gutenberg.org/cache/epub/22381/pg22381.txt"
  ], 0.7, function(words){
    window.words = words;
  }
);